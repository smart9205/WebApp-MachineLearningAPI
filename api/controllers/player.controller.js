const db = require("../models");
const Player = db.player;
const Player_Position = db.player_position;
const User_Config = db.user_config;
const Highlight = db.highlight;
const Sequelize = db.sequelize;
const Op = db.Sequelize.Op;

exports.updateTaggerConfig = async (req, res) => {

  if (!req.body.sec_before || !req.body.sec_after) return res.send({ status: "fail" });

  await User_Config.findOrCreate({ where: { user_id: req.userId } })

  const updated = await User_Config.update({
    sec_before: req.body.sec_before,
    sec_after: req.body.sec_after
  }, {
    where: { user_id: req.userId }
  })

  return res.send({ status: "success", updated });
};

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.f_name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const newPlayer = {
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    date_of_birth: req.body.date_of_birth,
    position: req.body.position,
    jersey_number: req.body.jersey_number,
    image: req.body.image
  }

  const checkPlayer = await Player.findOne({
    where: {
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      date_of_birth: req.body.date_of_birth,
    }
  });

  if (checkPlayer !== null) {
    return res.send({ status: "error", data: "Player already exists" });
  }

  Player.create(newPlayer)
    .then(data => {
      res.send({ status: "success", data });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });

};

exports.findAll = (req, res) => {
  Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
      FROM public."Players" 
      LEFT JOIN 
        public."Player_Positions" on public."Players".position = public."Player_Positions".id
      ORDER BY
        public."Players".f_name, 
        public."Players".l_name
    `).then(data => {
    res.send(data[0]);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });;
};

exports.findAllPosition = (req, res) => {

  Player_Position.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving player_positions."
      });
    });
};


exports.findOne = async (req, res) => {
  const id = req.params.id;

  const player = await Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
      FROM public."Players" 
      LEFT JOIN 
        public."Player_Positions" on public."Players".position = public."Player_Positions".id
      WHERE public."Players".id = ${id}
      ORDER BY
        public."Players".f_name, 
        public."Players".l_name
    `);
  const team = await Sequelize.query(`
    select 
      team_id, 
      name as team_name,
      image as team_image,
      team_color,
      sponsor_logo,
      sponsor_url,
      create_highlights,
      second_color,
      show_sponsor
    from public."Teams" 
    join (select team_id, date as game_date from public."Team_Players" 
      join public."Games" on 
        public."Team_Players".season_id = public."Games".season_id and
        public."Team_Players".league_id = public."Games".league_id and
        (public."Team_Players".team_id = public."Games".home_team_id or public."Team_Players".team_id = public."Games".away_team_id)
      where player_id = ${id}
      ORDER BY date desc limit 1
    ) g on g.team_id = public."Teams".id
  `);

  res.send({ ...player[0][0], ...team[0][0] });
};

exports.gameByPlayerId = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
    SELECT 
      public."Games".id as game_id, 
      public."Games".*,
      public."Team_Players".*,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Team_Players" 
    JOIN public."Games" 
    on 
      public."Games".season_id = public."Team_Players".season_id and
        public."Games".league_id = public."Team_Players".league_id and
      (
        public."Games".home_team_id = public."Team_Players".team_id or
        public."Games".away_team_id = public."Team_Players".team_id
      )
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    where public."Team_Players".player_id = ${id} 
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

exports.gameDetailsByPlayerId = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
  SELECT 
	public."Games".*,
	HomeTeam.name as home_team_name,
	AwayTeam.name as away_team_name,
  (CASE WHEN ${id} in (
		select player_id from public."Team_Players" 
		where season_id = public."Games".season_id and league_id = public."Games".league_id and public."Team_Players".team_id = public."Games".home_team_id
	) THEN true ELSE false END) as is_home_team,
	SUM(CASE WHEN action_result_id = 3 and player_id in (
		select player_id from public."Team_Players" 
		where season_id = public."Games".season_id and league_id = public."Games".league_id and public."Team_Players".team_id = public."Games".home_team_id
	) THEN 1 ELSE 0 END) as home_team_goal,
	SUM(CASE WHEN action_result_id = 3 and player_id in (
		select player_id from public."Team_Players" 
		where season_id = public."Games".season_id and league_id = public."Games".league_id and public."Team_Players".team_id = public."Games".away_team_id
	) THEN 1 ELSE 0 END) as away_team_goal,
	SUM(CASE WHEN action_result_id = 3 THEN 1 ELSE 0 END) as goal,
	SUM(CASE WHEN action_id = 1 THEN 1 ELSE 0 END) as shot,
	SUM(CASE WHEN action_id = 2 THEN 1 ELSE 0 END) as pass,
	SUM(CASE WHEN action_id = 10 THEN 1 ELSE 0 END) as interception,
	SUM(CASE WHEN action_result_id = 6 THEN 1 ELSE 0 END) as saved,
	SUM(CASE WHEN action_id = 11 THEN 1 ELSE 0 END) as clearance
FROM public."Player_Tags" LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
JOIN public."Games" on public."Games".id = game_id
LEFT JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
LEFT JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
WHERE game_id in (
	SELECT public."Games".id FROM public."Team_Players" 
	JOIN public."Games" on 
		public."Games".season_id = public."Team_Players".season_id and
		public."Games".league_id = public."Team_Players".league_id and
		(
			public."Games".home_team_id = public."Team_Players".team_id or
			public."Games".away_team_id = public."Team_Players".team_id
		)
	where public."Team_Players".player_id = ${id} 
)
group by public."Games".id,home_team_name,away_team_name
    `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
}

exports.update = (req, res) => {
  const id = req.params.id;

  Player.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Player with id=${id}. Maybe Player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Player with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Player.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Player with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Player.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Seasons were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Seasons."
      });
    });
};

exports.addHighlight = async (req, res) => {
  const highlight = await Highlight.findOrCreate({
    where: {
      [Op.and]: [
        { player_id: req.body.player_id },
        { game_id: req.body.game_id },
      ]
    },
    defaults: {
      player_id: req.body.player_id,
      game_id: req.body.game_id,
      status: 1,
      video_url: btoa(new Date()) + ".mp4"
    }
  })
  if (highlight[1]) {
    return res.send({ result: "success", msg: "Highlight is created successfully!" })
  } else {
    const updated = await Highlight.update({
      ...highlight[0], status: 1
    }, {
      where: { id: highlight[0].id }
    })
    return res.send({ result: "success", msg: "Highlight is already created!" })
  }
};

exports.getAllHighlightByPlayerId = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
    SELECT 
      public."Games".*, 
      public."Games".image as game_image,
      public."Highlights".status,
      public."Highlights".video_url as highlight_video_url,
      public."Players".*,
      (
      SELECT json_agg(json_build_object(
        'action_name', temptag.action_name,
        'action_type_name', temptag.action_type_name,
        'action_result_name', temptag.action_result_name,
        'action_id', temptag.action_id,
        'action_type_id', temptag.action_type_id,
        'action_result_id', temptag.action_result_id,
        'start_time', temptag.start_time,
        'end_time', temptag.end_time,
        'player_fname', temptag.player_fname,
        'player_lname', temptag.player_lname,
        'jersey', temptag.jersey
      )) AS player_tag
    from (
        SELECT public."Actions".name as action_name,
        public."Action_Types".name as action_type_name,
        public."Action_Results".name as action_result_name,
        public."Actions".id as action_id,
        public."Action_Types".id as action_type_id,
        public."Action_Results".id as action_result_id,
        public."Player_Tags".start_time as start_time,
        public."Player_Tags".end_time as end_time,
        public."Players".f_name as player_fname,
        public."Players".l_name as player_lname,
        public."Players".jersey_number as jersey
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Actions" on public."Actions".id = public."Player_Tags".action_id
    LEFT JOIN public."Action_Types" on public."Action_Types".id = public."Player_Tags".action_type_id
    LEFT JOIN public."Action_Results" on public."Action_Results".id = public."Player_Tags".action_result_id
    LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id
    where public."Player_Tags".player_id = public."Highlights".player_id and public."Team_Tags".game_id = public."Highlights".game_id
    order by public."Player_Tags".start_time) as temptag
  ) as tags
  FROM public."Highlights" 
  JOIN public."Games" on public."Games".id = public."Highlights".game_id 
  JOIN public."Players" on public."Players".id = public."Highlights".player_id 
    where public."Highlights".player_id = ${id} 
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });
};

