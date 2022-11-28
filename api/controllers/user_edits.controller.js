const db = require("../models");
const config = require("../config/auth.config");
const User_Edits = db.user_edits;
const User_Edits_Folder = db.user_edits_folders;
const Edit_Clips = db.edit_clips;
const Email_Queue = db.email_queue;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

var bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");

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

sendShareEmail = async (origin, email, userId, subject, html) => {
  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email, // Change to your recipient
    from: origin, // Change to your verified sender
    subject: subject,
    html: html,
  };

  const email_queue = await Email_Queue.create({
    user_id: userId,
    user_email: email,
    send_date: new Date(),
    subject: subject,
    content: html,
  });

  sendgrid
    .send(msg)
    .then((resp) => {
      Email_Queue.update({ success: true }, { where: { id: email_queue.id } });
    })
    .catch((error) => {
      console.error(error);
      Email_Queue.update({ success: false }, { where: { id: email_queue.id } });
    });
};

exports.sendShareEmail = (req, res) => {
  const text = req.body.text.split("\n").join("<br/>");

  console.log("$$$$$$$$", req.body);
  Sequelize.query(
    `SELECT * FROM public."Users" WHERE public."Users".id=${req.userId}`
  )
    .then((data) => {
      const user = data[0][0];
      const ciphertext = encodeURIComponent(
        CryptoJS.AES.encrypt(`${req.body.share_id}`, config.secret).toString()
      );
      const url = `https://soccer.scouting4u.com/shareedit/${ciphertext}`;
      const emails = req.body.email.split(", ");

      emails.map((email) => {
        var html = `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body>
                <div style="border: 1px solid lightblue; padding: 10px; width:540px;">
                <a href="${url}"><img src="https://soccer-s4u-bucket.s3.eu-west-1.amazonaws.com/images/EmailThumbnail.gif" alt="" style="width: 540px;" /></a>
                <h2>${req.body.edit_name}</h2>
                <h4>Author: ${user.first_name} ${user.last_name}</h4>
                <p>${text}</p>
              </div>
              <br/>
              <br/>
              <div>
              <p>This message has been sent as a data shared between ${user.first_name} ${user.last_name} and the addressee whose name is specified above. 
              The content of this email is confidential and intended for the recipient specified in message only. 
              It is strictly forbidden to share any part of this message with any third party, without a written consent of the sender. 
              If you received this message by mistake, please reply to this message and follow with its deletion, so that we can ensure such a mistake does not occur in the future.</p>
              <br/>
              <p><b>Warning:</b> Although taking reasonable precautions to ensure no viruses or malicious software are present in this email, the Scouting4U cannot accept responsibility for any loss or damage arising from the use of this email or attachments!</p> 
              </div>
            </body>
          </html>`;

        sendShareEmail(
          user.email,
          email,
          req.userId,
          `A new share from ${user.first_name} ${user.last_name}`,
          html
        );
        sendShareEmail(
          user.email,
          user.email,
          req.userId,
          `A new share from ${user.first_name} ${user.last_name}`,
          html
        );
        sendShareEmail(
          user.email,
          "scouting4u2010@gmail.com",
          req.userId,
          `A new share from ${user.first_name} ${user.last_name}`,
          html
        );
      });
      res.status(200).send({
        message: `Shared successfully, Please check the shared url.`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.getShareURL = (req, res) => {
  Sequelize.query(
    `
  select * from public."User_Edits" where public."User_Edits".user_id=${req.userId} and public."User_Edits".id=${req.params.id}
  `
  )
    .then((data) => {
      const ciphertext = encodeURIComponent(
        CryptoJS.AES.encrypt(`${data[0][0].share_id}`, config.secret).toString()
      );
      const url = `https://soccer.scouting4u.com/shareedit/${ciphertext}`;

      res.send(url);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserEdits.",
      });
    });
};

exports.verifyShareId = (req, res) => {
  var bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(req.body.code),
    config.secret
  );
  var data = bytes.toString(CryptoJS.enc.Utf8);

  Sequelize.query(
    `SELECT * FROM public."User_Edits" WHERE public."User_Edits".share_id='${data}'`
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

exports.getEditbyId = (req, res) => {
  Sequelize.query(
    `
  select * from public."User_Edits" where public."User_Edits".user_id=${req.userId} and public."User_Edits".id=${req.params.id}
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
