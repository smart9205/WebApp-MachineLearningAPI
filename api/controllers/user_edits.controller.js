const db = require("../models");
const User_Edits = db.user_edits;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const user_edits = {
    name: req.body.name,
  };

  User_Edits.create(user_edits)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User_Edits."
      });
    });

};

exports.findAll = (req, res) => {
  console.log("getUserEdit", req.body);
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  User_Edits.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits."
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  User_Edits.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving User_Edits with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  User_Edits.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User_Edits was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User_Edits with id=${id}. Maybe User_Edits was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User_Edits with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  User_Edits.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User_Edits was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete User_Edits with id=${id}. Maybe User_Edits was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User_Edits with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  User_Edits.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} UserEdits were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all UserEdits."
      });
    });
};

