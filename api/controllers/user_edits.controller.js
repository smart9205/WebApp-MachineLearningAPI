const db = require("../models");
const User_Edits = db.user_edits;
const User_Edits_Folder = db.user_edits_folders;
const Edit_Clips = db.edit_clips;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

var bcrypt = require("bcryptjs");

exports.create = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  const date = new Date();
  const user_edits = {
    name: req.body.name,
    user_id: req.userId,
    parent_id: null,
    share_id: bcrypt.hashSync(date.toString(), 8),
    order_num: 2,
  };

  const userEdits = await User_Edits.create(user_edits);

  Sequelize.query(
    `
    SELECT *,
      public."Player_Tags".id as player_tag_id,
      public."Player_Tags".start_time as p_start_time,
      public."Player_Tags".end_time as p_end_time,
      public."Team_Tags".start_time as t_start_time,
      public."Team_Tags".end_time as t_end_time,
      public."Games".date
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Player_Tags".team_tag_id = public."Team_Tags".id
    LEFT JOIN public."Games" on public."Team_Tags".game_id = public."Games".id
    WHERE 
      ${
        req.body.actionIds.length > 0
          ? `action_id in (${req.body.actionIds.join(",")}) and `
          : ""
      }
      ${
        req.body.actionTypeIds.length > 0
          ? `action_type_id in (${req.body.actionTypeIds.join(",")}) and `
          : ""
      }
      ${
        req.body.actionResultIds.length > 0
          ? `action_result_id in (${req.body.actionResultIds.join(",")}) and `
          : ""
      }
      ${
        req.body.curSelect === 0
          ? `offensive_team_id = ${req.body.teamId} and `
          : ""
      }
      ${
        req.body.curSelect === 1
          ? `defensive_team_id = ${req.body.teamId} and `
          : ""
      }
      ${req.body.curSelect === 2 ? `player_id = ${req.body.playerId} and ` : ""}
      game_id in (${req.body.gameIds.join(",")})
    ORDER BY date, t_start_time, p_start_time
  `
  )
    .then((data) => {
      const tagList = data[0];

      tagList.forEach(async (tag, idx) => {
        const clip =
          req.body.curSelect === 2
            ? {
                start_time: tag.p_start_time,
                end_time: tag.p_end_time,
                edit_id: userEdits.id,
                sort: idx,
              }
            : {
                start_time: tag.t_start_time,
                end_time: tag.t_end_time,
                edit_id: userEdits.id,
                sort: idx,
              };
        await Edit_Clips.create(clip);
      });
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.createFolder = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // res.send(`Name: ${req.body.name} and ParentID: ${req.body.parentID} and UserID: ${req.userId}`)

  const user_edits_folder = {
    name: req.body.name,
    user_id: req.userId,
    parent_id: req.body.parent_id,
    order_num: req.body.order,
  };

  await User_Edits_Folder.create(user_edits_folder)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating UserEditsFolder.",
      });
    });
};

exports.createEdit = async (req, res) => {
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  // res.send(`Name: ${req.body.name} and ParentID: ${req.body.parentID} and UserID: ${req.userId}`)

  const date = new Date();
  const user_edits = {
    name: req.body.name,
    user_id: req.userId,
    parent_id: req.body.parent_id,
    share_id: bcrypt.hashSync(date.toString(), 8),
    order_num: req.body.order,
  };

  await User_Edits.create(user_edits)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating UserEditsFolder.",
      });
    });
};

exports.findAll = (req, res) => {
  User_Edits.findAll({ where: { user_id: req.userId } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.findFolder = (req, res) => {
  let id = req.params.id;

  User_Edits_Folder.findAll({ where: { parent_id: id } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.findAllFolders = (req, res) => {
  Sequelize.query(
    `
    SELECT * FROM public.fnc_get_user_edit_and_folder(${req.userId})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Sequelize.query(
    `
  select * from public.fnc_get_clips_in_edits(${id}) order by sort asc
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.updateEditClipsSort = (req, res) => {
  if (req.body.length < 2)
    res.send({
      message: "Edit_clips are not enough to update sort.",
    });

  req.body.forEach((row) => Edit_Clips.update(row, { where: { id: row.id } }));

  res.send({
    message: "Edit_clips are updated successfully.",
  });
};

exports.addNewEditClips = (req, res) => {
  req.body.rows.forEach(async (row) => {
    await Edit_Clips.create(row);
  });

  res.send({
    message: "Edit_clips are saved successfully.",
  });
};

exports.updateEditClip = (req, res) => {
  const id = req.params.id;

  const editClip = {
    id: req.body.id,
    edit_id: req.body.edit_id,
    start_time: req.body.start_time,
    end_time: req.body.end_time,
    sort: req.body.sort,
    name: req.body.name,
    game_id: req.body.game_id,
  };

  Edit_Clips.update(editClip, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Team_Tag was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Team_Tag with id=${id}. Maybe Team_Tag was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Team_Tag with id=" + id,
      });
    });
};

exports.update = async (req, res) => {

  const id = req.params.id;

  const num = await User_Edits.update(req.body, { where: { id: id } });
  const num1 = await User_Edits_Folder.update(req.body, { where: { id: id } });

  if (num == 1 || num1 == 1) {
    res.send({
      message: "User_Edits was updated successfully.",
    });
  } else {
    res.send({
      message: `Cannot update User_Edits with id=${id}. Maybe User_Edits was not found or req.body is empty!`,
    });
  }
};

exports.moveFolderNewPosition = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_move_folder_new_position(
      '${req.body.type}',
      ${req.body.element_id},
      ${req.body.parent_id},
      ${req.body.order_num}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch(() => {
      res.send({
        message: `Cannot move folder. Maybe folder was not found!`,
      });
    });
};

exports.getBiggestSortNumber = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_biggest_sort_number(
      '${req.params.type}',
      ${req.params.parentId}
    )
  `
  )
    .then((data) => {
      res.send(data[0][0]);
    })
    .catch(() => {
      res.send({
        message: "Not Found Biggest Sort Number",
      });
    });
};

exports.getVideoSourceFromEdit = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_video_source_of_an_edit(
      ${req.params.parentId}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch(() => {
      res.send({
        message: "Not Found Video Source",
      });
    });
};

exports.delete = async (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_delete_edit(${req.params.id})
  `
  )
    .then(() => {
      res.send({
        message: "User_Edits was deleted successfully!",
      });
    })
    .catch(() => {
      res.send({
        message: `Cannot delete User_Edits with id=${req.params.id}. Maybe User_Edits was not found!`,
      });
    });
};

exports.deleteFolder = async (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_delete_folder(${req.params.id})
  `
  )
    .then(() => {
      res.send({
        message: "User_Edits_Folders was deleted successfully!",
      });
    })
    .catch(() => {
      res.send({
        message: `Cannot delete User_Edits_Folders with id=${req.params.id}. Maybe User_Edits_Folders was not found!`,
      });
    });
};

exports.moveClips = async (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_move_clips('${req.params.clipIds}', ${req.params.editId})
  `
  )
    .then(() => {
      res.send({
        message: "Edit_Clips was moved successfully!",
      });
    })
    .catch(() => {
      res.send({
        message: `Cannot delete User_Edits with id=${req.params.id}. Maybe User_Edits was not found!`,
      });
    });
};

exports.copyClips = async (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_copy_clips('${req.params.clipIds}', ${req.params.editId})
  `
  )
    .then(() => {
      res.send({
        message: "Edit_Clips was copied successfully!",
      });
    })
    .catch(() => {
      res.send({
        message: `Cannot delete User_Edits with id=${req.params.id}. Maybe User_Edits was not found!`,
      });
    });
};

exports.deleteClip = async (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_delete_clips('${req.params.clipIds}')
  `
  )
    .then(() => {
      res.send({
        message: "Edit_Clips was deleted successfully!",
      });
    })
    .catch(() => {
      res.send({
        message: `Cannot delete User_Edits with id=${req.params.id}. Maybe User_Edits was not found!`,
      });
    });
};

exports.deleteAll = (req, res) => {
  User_Edits.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} UserEdits were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all UserEdits.",
      });
    });
};
