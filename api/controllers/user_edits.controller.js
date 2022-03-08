const db = require("../models");
const User_Edits = db.user_edits;
const Edit_Clips = db.edit_clips;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = async (req, res) => {

  console.log("create new", req.body)
  // create new {
  //   name: 'edit2',
  //   teamId: 9,
  //   gameIds: [ 4 ],
  //   actionIds: [ 2, 4 ],
  //   actionTypeIds: [ 2, 4 ],
  //   actionResultIds: [ 6, 7 ],
  //   curSelect: 2,
  //   playerId: 25
  // }

  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!"
    });
    return;
  }

  const user_edits = {
    name: req.body.name,
    user_id: req.userId,
    processed: 1,
  };

  const userEdits = await User_Edits.create(user_edits);

  Sequelize.query(`
    SELECT *,
      public."Player_Tags".id as player_tag_id,
      public."Player_Tags".start_time as p_start_time,
      public."Player_Tags".end_time as p_end_time,
      public."Team_Tags".start_time as t_start_time,
      public."Team_Tags".end_time as t_end_time
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Player_Tags".team_tag_id = public."Team_Tags".id
    WHERE 
      ${req.body.actionIds.length > 0 ? `action_id in (${req.body.actionIds.join(",")}) and ` : ""}
      ${req.body.actionTypeIds.length > 0 ? `action_id in (${req.body.actionTypeIds.join(",")}) and ` : ""}
      ${req.body.actionResultIds.length > 0 ? `action_id in (${req.body.actionResultIds.join(",")}) and ` : ""}
      ${req.body.curSelect === 0 ? `offensive_team_id = ${req.body.teamId} and ` : ""}
      ${req.body.curSelect === 1 ? `defensive_team_id = ${req.body.teamId} and ` : ""}
      ${req.body.curSelect === 2 ? `player_id = ${req.body.playerId} and ` : ""}
      game_id in (${req.body.gameIds.join(",")})
  `).then(data => {
    const tagList = data[0]

    tagList.forEach(async tag => {
      const clip = req.body.curSelect === 2 ?
        {
          start_time: tag.p_start_time,
          end_time: tag.p_end_time,
          player_tag_id: tag.player_tag_id,
          edit_id: userEdits.id
        } : {
          start_time: tag.t_start_time,
          end_time: tag.t_end_time,
          team_tag_id: tag.team_tag_id,
          edit_id: userEdits.id
        }
      await Edit_Clips.create(clip)
    })
    res.send(data[0]);
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving games."
    });
  });
};

exports.findAll = (req, res) => {

  User_Edits.findAll({ where: { user_id: req.userId } })
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

  Edit_Clips.findAll({ where: { edit_id: id } })
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

