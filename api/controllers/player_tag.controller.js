const db = require("../models");
const Player_Tag = db.player_tag;
const Op = db.Sequelize.Op;

exports.create =  (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const player_tag = {
    name: req.body.name,
  };

  Player_Tag.create(player_tag)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player_Tag."
      });
    });
 
};

exports.findAll = (req, res) => {
  console.log("getSeason", req.body);
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Player_Tag.findAll({ where: condition })
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

  Player_Tag.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Player_Tag with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Player_Tag.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player_Tag was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Player_Tag with id=${id}. Maybe Player_Tag was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Player_Tag with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Player_Tag.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player_Tag was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Player_Tag with id=${id}. Maybe Player_Tag was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Player_Tag with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Player_Tag.destroy({
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

