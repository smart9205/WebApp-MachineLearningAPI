const db = require("../models");
const Action = db.action;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const action = {
    name: req.body.name,
  };

  Action.create(action)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Action."
      });
    });

};

exports.findAll = (req, res) => {
  Action.findAll()
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

  Action.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Action with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Action.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Action with id=${id}. Maybe Action was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Action with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Action.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Action with id=${id}. Maybe Action was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Action with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Action.destroy({
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

