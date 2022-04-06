const db = require("../models");
const Action_Result = db.action_result;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const action_result = {
    name: req.body.name,
  };

  Action_Result.create(action_result)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Action_Result."
      });
    });

};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Action_Result.findAll({ where: condition })
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

  Action_Result.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Action_Result with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Action_Result.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action_Result was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Action_Result with id=${id}. Maybe Action_Result was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Action_Result with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Action_Result.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action_Result was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Action_Result with id=${id}. Maybe Action_Result was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Action_Result with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Action_Result.destroy({
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

