const db = require("../models");
const League = db.league;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const league = {
    name: req.body.name,
    image: req.body.image
  };

  League.create(league)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the League."
      });
    });

};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  League.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving leagues."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  League.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving League with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  League.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "League was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update League with id=${id}. Maybe League was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating League with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  League.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "League was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete League with id=${id}. Maybe League was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete League with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  League.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} leagues were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all leagues."
      });
    });
};

