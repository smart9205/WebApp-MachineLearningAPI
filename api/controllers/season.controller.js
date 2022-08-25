const db = require("../models");
const Season = db.season;
const Op = db.Sequelize.Op;

exports.create =  (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const season = {
    name: req.body.name,
  };

  Season.create(season)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Season."
      });
    });
 
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Season.findAll({ where: condition })
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

  Season.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Season with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Season.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Season was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Season with id=${id}. Maybe Season was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Season with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Season.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Season was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Season with id=${id}. Maybe Season was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Season with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Season.destroy({
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

