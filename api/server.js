const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


// database
const db = require("./models");
const Role = db.role;
const Subscription = db.subscription;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Soccer Scouting4U!" });
});

// routes
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/whatsapp.routes')(app);

require('./routes/season.routes')(app);
require('./routes/league.routes')(app);
require('./routes/action.routes')(app);
require('./routes/action_type.routes')(app);
require('./routes/action_result.routes')(app);
require('./routes/game.routes')(app);
require('./routes/player.routes')(app);
require('./routes/player_tag.routes')(app);
require('./routes/team.routes')(app);
require('./routes/team_tag.routes')(app);
require('./routes/team_players.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.create({
    id: 1,
    name: "admin"
  });

  Role.create({
    id: 2,
    name: "tagger"
  });

  Role.create({
    id: 3,
    name: "coach"
  });

  Role.create({
    id: 4,
    name: "player"
  });

  Subscription.create({
    id: 1,
    name: "tagger"
  })
  Subscription.create({
    id: 2,
    name: "coach"
  })
  Subscription.create({
    id: 3,
    name: "player"
  })

}