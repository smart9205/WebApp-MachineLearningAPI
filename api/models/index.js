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
db.user_device = require("../models/user_devices.js")(sequelize, Sequelize);
db.last_updated = require("../models/last_updated.js")(sequelize, Sequelize);
db.language = require("../models/language.js")(sequelize, Sequelize);
db.language_field = require("../models/language_field.js")(sequelize, Sequelize);
db.language_teams = require("../models/language_teams.js")(sequelize, Sequelize);
db.email_queue = require("../models/email_queue.js")(sequelize, Sequelize);

db.player = require("../models/player.js")(sequelize, Sequelize);
db.player_tag = require("../models/player_tag.js")(sequelize, Sequelize);
db.team = require("../models/team.js")(sequelize, Sequelize);
db.team_tag = require("../models/team_tag.js")(sequelize, Sequelize);

db.action = require("../models/action.js")(sequelize, Sequelize);
db.action_type = require("../models/action_type.js")(sequelize, Sequelize);
db.action_result = require("../models/action_result.js")(sequelize, Sequelize);

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

db.user.hasOne(db.user_subscription, {
  as: 'Subscription',
  foreignKey: "user_id",
})
db.user_subscription.belongsTo(db.subscription, { 
  as: "Name",
  foreignKey: "subscription_id"
});


db.ROLES = ["analyzer", "logger", "admin"];

module.exports = db;
