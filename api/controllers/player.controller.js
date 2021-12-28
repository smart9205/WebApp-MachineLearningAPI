const db = require("../models");
const Player = db.player;
const User_Config = db.user_config;
const Op = db.Sequelize.Op;

exports.updateTaggerConfig = async (req, res) => {

  if(!req.body.sec_before || !req.body.sec_after) return res.send({status: "fail"});
  
  await User_Config.findOrCreate({where: {user_id: req.userId}})
  
  const updated = await User_Config.update({
    sec_before : req.body.sec_before,
    sec_after : req.body.sec_after
  },{
    where: {user_id: req.userId}
  })

  return res.send({status: "success",updated});
};

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.f_name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }
  const checkPlayer = await Player.findOne({ where: {
    f_name: req.body.f_name,
    l_name: req.body.l_name,
    date_of_birth: req.body.date_of_birth,
    position: req.body.position,
    jersey_number: req.body.jersey_number
  }});
  
  if(checkPlayer !== null) {
    return res.send({status: "error", data: "Player already exists"});
  }

  Player.create(req.body)
    .then(data => {
      res.send({status:"success",data});
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Player."
      });
    });
 
};

exports.findAll = (req, res) => {
  console.log("getSeason", req.body);
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Player.findAll({ where: condition })
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

  Player.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Player with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Player.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Player with id=${id}. Maybe Player was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Player with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Player.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Player was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Player with id=${id}. Maybe Player was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Player with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Player.destroy({
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
