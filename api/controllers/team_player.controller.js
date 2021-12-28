const db = require("../models");
const Team_Player = db.team_player;
const Player = db.player;
const Game = db.game;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create =  async (req, res) => {

  console.log("TeamPlayer ", req.body)

  const checkTeamPlayer = await Team_Player.findOne({ where: {
    season_id: req.body.season_id,
    league_id: req.body.league_id,
    team_id: req.body.team_id,
    player_id: req.body.player_id,
  }});
  
  if(checkTeamPlayer !== null) {
    return res.send({status: "error", data: "Player already exists in the Team"});
  }

  Team_Player.create(req.body)
    .then(data => {
      res.send({status: "success", data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Team_Player."
      });
    });
};
exports.getPlayersByGameTeam = async (req, res) => {
  let game;
  try{
    game = await Game.findByPk(req.body.game_id);
    if(!game) return res.status(500).send({message: "Game not found!"});
  }catch(e) {
    return res.status(500).send({message: "Game not found!"});
  }
  let home_team, away_team;
  try {
    home_team = await Sequelize.query(`
      SELECT *, public."Players".id as id
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.home_team_id} 
    `);
      
    away_team = await Sequelize.query(`
      SELECT *, public."Players".id as id
        FROM public."Players" 
        JOIN 
          public."Team_Players" on public."Players".id = public."Team_Players".player_id
      WHERE
        season_id = ${game.season_id} and 
        league_id = ${game.league_id} and 
        team_id = ${game.away_team_id} 
    `);
  }catch(e) {
  } 
  res.send({home_team: home_team[0], away_team:away_team[0]});
}
exports.findAll = (req, res) => {
  console.log("req team_player",req.body);
  Sequelize.query(`
  SELECT * 
    FROM public."Players" 
    JOIN 
      public."Team_Players" on public."Players".id = public."Team_Players".player_id
  WHERE
    season_id = ${req.body.season_id} and 
    league_id = ${req.body.league_id} and 
    team_id = ${req.body.team_id} 
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

  const teamPlayer = await Team_Player.findByPk(req.body.id);

  const player = await Player.findByPk(teamPlayer.player_id);

  player.jersey_number = req.body.jersey_number;

  await player.save();
 
  res.send({
    message: "Player Jersey updated"
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

