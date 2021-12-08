const db = require("../models");
const Team_Player = db.team_player;
const Player = db.player;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create =  async (req, res) => {
  const [player, playerCreated] = await Player.findOrCreate({
    where: { 
      f_name: req.body.f_name,
      l_name: req.body.l_name,
      date_of_birth: req.body.date_of_birth,
      position: req.body.position,
      jersey_number: req.body.jersey_number
    }
  });

  const team_player = {
    season_id: req.body.season_id,
    league_id: req.body.league_id,
    team_id: req.body.team_id,
    player_id: player.id
  };

  console.log("Team_Player ::", team_player);
  Team_Player.create(team_player)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Team_Player."
      });
    });
};

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

