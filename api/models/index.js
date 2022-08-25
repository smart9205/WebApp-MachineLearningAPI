// const config = require("../config/db.config.js");
const dotenv = require('dotenv');
dotenv.config();

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.js")(sequelize, Sequelize);
db.role = require("../models/role.js")(sequelize, Sequelize);

db.verificationToken = require("../models/verificationtoken.js")(sequelize, Sequelize);
db.subscription = require("../models/subscription.js")(sequelize, Sequelize);
db.user_subscription = require("../models/user_subscription.js")(sequelize, Sequelize);

db.game = require("../models/game.js")(sequelize, Sequelize);
db.team = require("../models/team.js")(sequelize, Sequelize);
db.league = require("../models/league.js")(sequelize, Sequelize);
db.season = require("../models/season.js")(sequelize, Sequelize);
db.user_config = require("../models/user_config.js")(sequelize, Sequelize);
db.email_queue = require("../models/email_queue.js")(sequelize, Sequelize);

db.player = require("../models/player.js")(sequelize, Sequelize);
db.player_position = require("../models/player_position.js")(sequelize, Sequelize);
db.team_player = require("../models/team_players.js")(sequelize, Sequelize);
db.coach_team = require("../models/coach_team.js")(sequelize, Sequelize);
db.player_tag = require("../models/player_tag.js")(sequelize, Sequelize);
db.team = require("../models/team.js")(sequelize, Sequelize);
db.team_tag = require("../models/team_tag.js")(sequelize, Sequelize);

db.action = require("../models/action.js")(sequelize, Sequelize);
db.action_type = require("../models/action_type.js")(sequelize, Sequelize);
db.action_result = require("../models/action_result.js")(sequelize, Sequelize);
db.highlight = require("../models/highlight.js")(sequelize, Sequelize);
db.user_edits = require("../models/user_edits.js")(sequelize, Sequelize);
db.user_edits_folders = require("../models/user_edits_folder.js")(sequelize, Sequelize);
db.edit_clips = require("../models/edit_clips.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "User_Roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "User_Roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

db.ROLES = ["admin", "tagger", "coach", "player"];

module.exports = db;
