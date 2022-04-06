const db = require("../models");
const Action_Type = db.action_type;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const action_type = {
    name: req.body.name,
  };

  Action_Type.create(action_type)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Action_Type."
      });
    });

};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Action_Type.findAll({ where: condition })
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

  Action_Type.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Action_Type with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Action_Type.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action_Type was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Action_Type with id=${id}. Maybe Action_Type was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Action_Type with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Action_Type.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Action_Type was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Action_Type with id=${id}. Maybe Action_Type was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Action_Type with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Action_Type.destroy({
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

