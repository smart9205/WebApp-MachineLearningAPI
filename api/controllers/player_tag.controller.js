const db = require("../models");
const Player_Tag = db.player_tag;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = (req, res) => {
  console.log("PlayerTag", req.body)

  Player_Tag.create({
    team_tag_id: req.body.team_tag_id,
    team_id: req.body.team_id,
    action_id: req.body.action_id,
    player_id: req.body.player_id,
    action_type_id: req.body.action_type_id,
    action_result_id: req.body.action_result_id,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
  })
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

exports.getByTeamTag = (req, res) => {
  const id = req.params.id;

  Sequelize.query(`
    SELECT 
      public."Player_Tags".*,
      public."Actions".name as action_name,
      public."Action_Types".name as action_type_name,
      public."Action_Results".name as action_result_name,
      public."Teams".name as team_name,
      public."Players".f_name as player_fname,
      public."Players".l_name as player_lname,
      public."Players".jersey_number as jersey
    FROM public."Player_Tags"
    JOIN public."Actions" on public."Actions".id = public."Player_Tags".action_id
    JOIN public."Action_Types" on public."Action_Types".id = public."Player_Tags".action_type_id
    JOIN public."Action_Results" on public."Action_Results".id = public."Player_Tags".action_result_id
    JOIN public."Teams" on public."Teams".id = public."Player_Tags".team_id
    JOIN public."Players" on public."Players".id = public."Player_Tags".player_id
      WHERE public."Player_Tags".team_tag_id = ${id}
      order by public."Player_Tags".start_time 
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

exports.getByPlayer = (req, res) => {
  const playerId = req.params.player;
  const gameId = req.params.game;

  Sequelize.query(`
    SELECT 
      public."Player_Tags".*,
      public."Actions".name as action_name,
      public."Action_Types".name as action_type_name,
      public."Action_Results".name as action_result_name,
      public."Players".f_name as player_fname,
      public."Players".l_name as player_lname,
      public."Players".jersey_number as jersey
    FROM public."Player_Tags"
      LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
      LEFT JOIN public."Actions" on public."Actions".id = public."Player_Tags".action_id
      LEFT JOIN public."Action_Types" on public."Action_Types".id = public."Player_Tags".action_type_id
      LEFT JOIN public."Action_Results" on public."Action_Results".id = public."Player_Tags".action_result_id
      LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id
    WHERE public."Player_Tags".player_id = ${playerId} and public."Team_Tags".game_id = ${gameId}
      order by public."Player_Tags".start_time 
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

exports.getByTeam = (req, res) => {
  const teamId = req.params.team;
  const gameId = req.params.game;

  Sequelize.query(`
    SELECT 
      public."Player_Tags".*,
      public."Actions".name as action_name,
      public."Action_Types".name as action_type_name,
      public."Action_Results".name as action_result_name,
      public."Players".f_name as player_fname,
      public."Players".l_name as player_lname,
      public."Players".jersey_number as jersey
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Actions" on public."Actions".id = public."Player_Tags".action_id
    LEFT JOIN public."Action_Types" on public."Action_Types".id = public."Player_Tags".action_type_id
    LEFT JOIN public."Action_Results" on public."Action_Results".id = public."Player_Tags".action_result_id
    LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id
        WHERE public."Player_Tags".team_id = ${teamId} and public."Team_Tags".game_id = ${gameId}
        order by public."Player_Tags".start_time 
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

