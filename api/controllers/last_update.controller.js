const db = require("../models");
const Last_Updated = db.last_updated;
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Last_Update
exports.create =  async (req, res) => {

  const user = await User.findByPk(req.userId);
  const roles = await user.getRoles();
  
  if(!roles.find(role => role.name === 'admin'))
  return res.status(200).send({
    message: "You are not allowed"
  });
  
  // Create a Last_Update
  const last_update = {
    script_ran: new Date()
  };

  try{
    const last_updates = await Last_Updated.findAndCountAll({where: {}});
    if(last_updates.count > 1)
      await Last_Updated.destroy({where: {},truncate: false});
    else if(last_updates.count === 1)
      await Last_Updated.update(last_update, {where: {id: last_updates.rows[0].dataValues.id}});
    else if(last_updates.count === 0)
      await Last_Updated.create(last_update);
    return res.send(last_update);
  }catch{
    return res.status(500).send({
      message: "Some error occurred while creating the Last_Update."
    });
  }
};

// Retrieve all Last_Updates from the database.
exports.findAll = (req, res) => {
  Last_Updated.findOne({ where: {} })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Last_Updates."
      });
    });
};

// Find a single Last_Update with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Last_Update.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Last_Update with id=" + id
      });
    });
};

// Update a Last_Update by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Last_Update.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Last_Update was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Last_Update with id=${id}. Maybe Last_Update was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Last_Update with id=" + id
      });
    });
};

// Delete a Last_Update with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Last_Update.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Last_Update was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Last_Update with id=${id}. Maybe Last_Update was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Last_Update with id=" + id
      });
    });
};

// Delete all Last_Updates from the database.
exports.deleteAll = (req, res) => {
  Last_Update.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Last_Updates were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Last_Updates."
      });
    });
};

