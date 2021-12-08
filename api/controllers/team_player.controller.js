const db = require("../models");
const Team_Player = db.team_player;
const Op = db.Sequelize.Op;

exports.create =  (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const team_player = {
    name: req.body.name,
  };

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
  console.log("getSeason", req.body);
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Team_Player.findAll({ where: condition })
    .then(data => {
      res.send(data);
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

