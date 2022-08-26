const db = require("../models");
const Team_Player = db.team_player;
const Player = db.player;
const Game = db.game;
const Team = db.team;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = async (req, res) => {

  const checkTeamPlayer = await Team_Player.findOne({
    where: {
      season_id: req.body.season_id,
      league_id: req.body.league_id,
      team_id: req.body.team_id,
      player_id: req.body.player_id,
    }
  });

  if (checkTeamPlayer !== null) {
    return res.send({ status: "error", data: "Player already exists in the Team" });
  }

  Team_Player.create(req.body)
    .then(data => {
      res.send({ status: "success", data });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Team_Player."
      });
    });
};

exports.getPlayersByGame = async (req, res) => {
  let game;
  try {
    game = await Game.findByPk(req.body.game_id);
    if (!game) return res.status(500).send({ message: "Game not found!" });
  } catch (e) {
    return res.status(500).send({ message: "Game not found!" });
  }
  let home_team, away_team;
  try {
    home_team = await Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
        LEFT JOIN 
          public."Player_Positions" on public."Players".position = public."Player_Positions".id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.home_team_id} 
      order by public."Player_Positions".sort_order
    `);

    away_team = await Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
        LEFT JOIN 
          public."Player_Positions" on public."Players".position = public."Player_Positions".id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.away_team_id} 
        order by public."Player_Positions".sort_order
    `);
  } catch (e) {
  }
  res.send({ home_team: home_team[0], away_team: away_team[0] });
}

exports.getPlayersByTeam = async (req, res) => {
  const teamId = req.params.team;
  const gameIds = req.params.game;

  Sequelize.query(`
    select * from (  SELECT 
      DISTINCT ON(public."Players".id) *, public."Players".id as id,
      public."Player_Positions".name as position_name,
      public."Player_Positions".short as position_short,
      CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
      FROM public."Players" 
      JOIN 
        public."Team_Players" on public."Players".id = public."Team_Players".player_id
      LEFT JOIN 
        public."Games" 
        on 
        public."Team_Players".season_id = public."Games".season_id AND 
        public."Team_Players".league_id = public."Games".league_id AND
        (public."Team_Players".team_id = public."Games".home_team_id OR 
        public."Team_Players".team_id = public."Games".away_team_id) 
      LEFT JOIN 
        public."Player_Positions" on public."Players".position = public."Player_Positions".id
    WHERE
      public."Games".id in (${gameIds}) and
      team_id = ${teamId}
    order by public."Players".id) as a
  order by sort_order
    `).then(data => {res.send(data[0])});
}

exports.getAllGameTeamPlayers = async (req, res) => {
  let game;
  try {
    game = await Game.findByPk(req.params.gameid);
    if (!game) return res.status(500).send({ message: "Game not found!" });
  } catch (e) {
    return res.status(500).send({ message: "Game not found!" });
  }
  let home_team, away_team;
  try {
    home_team = await Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
        LEFT JOIN 
          public."Player_Positions" on public."Players".position = public."Player_Positions".id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.home_team_id} 
      order by public."Player_Positions".sort_order
    `);

    away_team = await Sequelize.query(`
      SELECT *, 
        public."Players".id as id,
        public."Player_Positions".name as position_name,
        public."Player_Positions".short as position_short,
        CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
        LEFT JOIN 
          public."Player_Positions" on public."Players".position = public."Player_Positions".id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.away_team_id} 
        order by public."Player_Positions".sort_order
    `);
  } catch (e) {
  }
  res.send({ home_team: home_team[0], away_team: away_team[0] });
}


exports.teambyplayergame = async (req, res) => {
  const playerId = req.params.playerid;
  const gameId = req.params.gameid;

  let game;
  try {
    game = await Game.findByPk(gameId);
    if (!game) return res.status(500).send({ message: "Game not found!" });
  } catch (e) {
    return res.status(500).send({ message: "Game not found!" });
  }
  Team.findOne({
    where: {
      [Op.or]: [
        { id: game.home_team_id },
        { id: game.away_team_id }
      ]
    }
  }).then((data) => {
    res.send(data);
  })
}

exports.findAll = (req, res) => {
  Sequelize.query(`
  SELECT public."Players".*,
    public."Team_Players".id as team_player_id,
    public."Player_Positions".name as position_name,
    public."Player_Positions".short as position_short,
    CONCAT (public."Players".f_name,' ', public."Players".l_name) as name
  FROM public."Players" 
    JOIN 
      public."Team_Players" on public."Players".id = public."Team_Players".player_id
    LEFT JOIN 
      public."Player_Positions" on public."Players".position = public."Player_Positions".id
  WHERE
    season_id = ${req.body.season_id} and 
    league_id = ${req.body.league_id} and 
    team_id = ${req.body.team_id} 
  order by public."Player_Positions".sort_order
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving seasons."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Team_Player.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Team_Player with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Team_Player.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Team_Player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Team_Player with id=${id}. Maybe Team_Player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Team_Player with id=" + id
      });
    });
};

exports.updateJersey = async (req, res) => {

  Sequelize.query(`
  UPDATE public."Players"
  SET jersey_number = ${req.body.jersey}
  WHERE id = ${req.body.id}
  `)
    .then(data => {
      res.send({
        message: "Players updated jersey_number"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving seasons."
      });
    });
}

exports.delete = (req, res) => {
  const id = req.params.id;

  Team_Player.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Team_Player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Team_Player with id=${id}. Maybe Team_Player was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Team_Player with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Team_Player.destroy({
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

