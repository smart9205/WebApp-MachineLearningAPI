const { authJwt } = require("../middleware");
const controller = require("../controllers/player_tag.controller");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/player_tag", controller.create);

  app.get("/player_tag", controller.findAll);

  app.get("/player_tag/:id", controller.findOne);

  app.get("/player_tag/getbyteamtag/:id", controller.getByTeamTag);

  app.get("/player_tag/getbyplayer/:player/:game", controller.getByPlayer);

  app.get(
    "/player_tag/getbyaction/:player/:game/:action",
    controller.getByAction
  );

  app.post("/player_tag/getbyteam", controller.getByTeam);

  app.get("/player_tag/getgamescore/:game", controller.getGameScore);

  app.put("/player_tag/:id", [authJwt.verifyToken], controller.update);

  app.delete("/player_tag/:id", controller.delete);

  app.delete("/player_tag", controller.deleteAll);
};
