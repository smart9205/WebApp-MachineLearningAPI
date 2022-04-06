const db = require("../models");
const Team_Tag = db.team_tag;
const Player_Tag = db.player_tag;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = (req, res) => {
  Team_Tag.create({
    game_id: req.body.game_id,
    offensive_team_id: req.body.offensive_team_id,
    defensive_team_id: req.body.defensive_team_id,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    period: req.body.period
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Team_Tag."
      });
    });

};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Team_Tag.findAll({ where: condition })
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

  Team_Tag.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Team_Tag with id=" + id
      });
    });
};

exports.getByGameId = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
    SELECT 
      public."Team_Tags".*, public."Team_Tags".id as id,
      offenseTeam.name as offensive_team_name,
      defenseTeam.name as defensive_team_name
    FROM public."Team_Tags" 
    JOIN public."Games" on public."Games".id = public."Team_Tags".game_id
    JOIN public."Teams" as offenseTeam on public."Team_Tags".offensive_team_id = offenseTeam.id
    JOIN public."Teams" as defenseTeam on public."Team_Tags".defensive_team_id = defenseTeam.id
    WHERE public."Team_Tags".game_id = ${id}
    order by public."Team_Tags".start_time desc
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });

};

exports.update = (req, res) => {
  const id = req.params.id;

  Team_Tag.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Team_Tag was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Team_Tag with id=${id}. Maybe Team_Tag was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Team_Tag with id=" + id
      });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  // delete playertags first
  await Player_Tag.destroy({
    where: { team_tag_id: id }
  })

  Team_Tag.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Team_Tag was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Team_Tag with id=${id}. Maybe Team_Tag was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Team_Tag with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Team_Tag.destroy({
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

