const db = require("../models");
const Coach_Team = db.coach_team;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = (req, res) => {
  // Validate request
  const coach_team = {
    user_id: req.body.user_id,
    season_id: req.body.season_id,
    league_id: req.body.league_id,
    team_id: req.body.team_id,
  };

  Coach_Team.create(coach_team)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Coach_Team.",
      });
    });
};

exports.findAll = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Coach_Teams".*,
      CONCAT (public."Users".first_name,' ', public."Users".last_name) as coach_name,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      public."Teams".name as team_name
    FROM public."Coach_Teams" 
    JOIN public."Users" on public."Users".id = public."Coach_Teams".user_id
    JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
    JOIN public."Seasons" on public."Seasons".id = public."Coach_Teams".season_id
    JOIN public."Leagues" on public."Leagues".id = public."Coach_Teams".league_id
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.findAllMine = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_coach_teams(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getAllPlayersByCoach = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_all_players_by_coach(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Players.",
      });
    });
};

exports.getAllLeaguesByCoach = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_all_leagues_by_coach(${req.params.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Leagues.",
      });
    });
};

exports.getAllTeamsByCoach = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_all_teams_by_coach(${req.params.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Teams.",
      });
    });
};

exports.getAllTeamsByLeagueSeason = (req, res) => {
  Sequelize.query(
    `
        select
            public."Coach_Teams".*,
            public."Teams".name as team_name
        from public."Coach_Teams"
        join public."Teams" on public."Teams".id = public."Coach_Teams".team_id
        where public."Coach_Teams".user_id = ${req.params.userId} and public."Coach_Teams".season_id = ${req.params.seasonId} and public."Coach_Teams".league_id = ${req.params.leagueId}
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Teams.",
      });
    });
};

exports.getAllLeaguesOfAdditionalGamesByCoach = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_all_leagues_of_additional_games_by_coach(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Leagues of additional games.",
      });
    });
};

exports.getAllTeamsOfAdditionalGamesByCoach = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_all_teams_of_additional_games_by_coach(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Teams of additional games.",
      });
    });
};

exports.getNumberOfGamesOrdered = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_number_of_games_ordered(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving number of games.",
      });
    });
};

exports.getCoachTeamList = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Coach_Teams".id,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      public."Teams".name as team_name
    FROM public."Coach_Teams" 
    JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
    JOIN public."Seasons" on public."Seasons".id = public."Coach_Teams".season_id
    JOIN public."Leagues" on public."Leagues".id = public."Coach_Teams".league_id
    WHERE public."Coach_Teams".user_id = ${req.userId}
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getCoachPlayers = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Players".*,
      CONCAT (public."Players".f_name,' ', public."Players".l_name) as name,
      public."Teams".name as team_name,
      public."Player_Positions".name as pos_name,
      public."Coach_Teams".id as coach_id
    FROM public."Coach_Teams" 
    JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
    join public."Team_Players" on
      public."Team_Players".team_id = public."Coach_Teams".team_id and
      public."Team_Players".season_id = public."Coach_Teams".season_id and
      public."Team_Players".league_id = public."Coach_Teams".league_id
    join public."Players" on public."Players".id = public."Team_Players".player_id
    join public."Player_Positions" on public."Player_Positions".id = public."Players".position
    WHERE public."Coach_Teams".user_id = ${req.userId}
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getCoachTeamPlayers = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Players".*,
      CONCAT (public."Players".f_name,' ', public."Players".l_name) as name,
      public."Teams".name as team_name,
      public."Player_Positions".name as pos_name
    FROM public."Coach_Teams" 
    JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
    JOIN (
        SELECT *, public."Team_Players".team_id as temp_team_id, public."Team_Players".season_id as temp_season_id, public."Team_Players".league_id as temp_league_id
        FROM public."Team_Players" 
        GROUP BY
          public."Team_Players".team_id,
          public."Team_Players".season_id,
          public."Team_Players".league_id,
          public."Team_Players".id
      ) AS tempTeamTable on 
          tempTeamTable.temp_team_id = public."Coach_Teams".team_id and
          tempTeamTable.temp_season_id = public."Coach_Teams".season_id and
          tempTeamTable.temp_league_id = public."Coach_Teams".league_id
    join public."Players" on public."Players".id = tempTeamTable.player_id
    join public."Player_Positions" on public."Player_Positions".id = public."Players".position
    WHERE public."Coach_Teams".user_id = ${req.userId} and public."Coach_Teams".team_id = ${req.params.teamId} and public."Coach_Teams".season_id = ${req.params.seasonId} and public."Coach_Teams".league_id = ${req.params.leagueId}
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getGameCoachTeamPlayers = (req, res) => {
  Sequelize.query(
    `
    SELECT * FROM public.fnc_get_team_players_in_games(
      ${req.params.teamId},
      '${req.params.gameIds}')
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getGameOpponentPlayers = (req, res) => {
  Sequelize.query(
    `
    SELECT * FROM public.fnc_get_opponent_players_in_games(
      ${req.params.teamId},
      '${req.params.gameIds}')
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTagsByPlayer = (req, res) => {
  const playerId = req.body.player_id;
  const gameIds = req.body.gameIds;

  Sequelize.query(
    `
  SELECT 
    public."Player_Tags".*,
    public."Actions".name as action_name,
    public."Action_Types".name as action_type_name,
    public."Action_Results".name as action_result_name,
    public."Players".f_name as player_fname,
    public."Players".l_name as player_lname,
    public."Players".jersey_number as jersey,
    public."Team_Tags".period,
    CASE
      WHEN public."Team_Tags".period = 1 THEN '1st Half'
      WHEN public."Team_Tags".period = 2 THEN '2nd Half'
      ELSE 'Overtime'
    END 
    AS period_name,
    public."Team_Tags".start_time as t_start_time,
    public."Team_Tags".end_time as t_end_time,
    offenseTeam.name as offensive_team_name,
    defenseTeam.name as defensive_team_name,
    offenseTeam.id as offensive_team_id,
    defenseTeam.id as defensive_team_id,
    game_id,
    to_char(public."Games"."date", 'DD Mon YYYY') as game_date,
    public."Games".video_url
  FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Games" on public."Team_Tags".game_id = public."Games".id
    LEFT JOIN public."Actions" on public."Actions".id = public."Player_Tags".action_id
    LEFT JOIN public."Action_Types" on public."Action_Types".id = public."Player_Tags".action_type_id
    LEFT JOIN public."Action_Results" on public."Action_Results".id = public."Player_Tags".action_result_id
    LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id
    JOIN public."Teams" as offenseTeam on public."Team_Tags".offensive_team_id = offenseTeam.id
    JOIN public."Teams" as defenseTeam on public."Team_Tags".defensive_team_id = defenseTeam.id
  WHERE public."Team_Tags".game_id in (${
    gameIds ?? 0
  }) and public."Players".id = ${playerId}
  ORDER BY public."Team_Tags".start_time, public."Player_Tags".start_time 
`
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getAllPlayerGames = (req, res) => {
  const playerId = req.params.id;

  Sequelize.query(
    `
  select public."Games".*,
  HomeTeam.name as home_team_name,
  AwayTeam.name as away_team_name

  from public."Team_Players" 
  
  join public."Coach_Teams" on 
    public."Team_Players".team_id = public."Coach_Teams".team_id and
    public."Team_Players".season_id = public."Coach_Teams".season_id and
    public."Team_Players".league_id = public."Coach_Teams".league_id
  join public."Games" on
    (public."Games".home_team_id = public."Coach_Teams".team_id or public."Games".away_team_id = public."Coach_Teams".team_id) and
    public."Games".season_id = public."Coach_Teams".season_id and
    public."Games".league_id = public."Coach_Teams".league_id
  JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
  JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
  
  where public."Coach_Teams".user_id = ${req.userId} and public."Team_Players".player_id = ${playerId}
  ORDER BY public."Games".date desc
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getAllPlayers = (req, res) => {
  Sequelize.query(
    `
    SELECT public."Players".*,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short
    FROM public."Coach_Teams" 
      JOIN public."Users" on public."Users".id = public."Coach_Teams".user_id
      JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
      JOIN public."Team_Players" on 
        public."Team_Players".season_id = public."Coach_Teams".season_id and 
        public."Team_Players".league_id = public."Coach_Teams".league_id and 
        public."Team_Players".team_id = public."Coach_Teams".team_id 
      LEFT JOIN public."Players" on
        public."Team_Players".player_id = public."Players".id
      LEFT JOIN 
        public."Player_Positions" on public."Players".position = public."Player_Positions".id
    WHERE public."Coach_Teams".user_id = ${req.userId} 
    group by public."Players".id, public."Player_Positions".id
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Coach_Team.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Coach_Team with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Coach_Team.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Coach_Team was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Coach_Team with id=${id}. Maybe Coach_Team was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Coach_Team with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Coach_Team.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Coach_Team was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Coach_Team with id=${id}. Maybe Coach_Team was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Coach_Team with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Coach_Team.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Seasons were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Seasons.",
      });
    });
};
