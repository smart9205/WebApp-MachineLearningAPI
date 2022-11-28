const { authJwt } = require("../middleware");
const controller = require("../controllers/player.controller");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/player", controller.findAll);

  app.post("/player/highlight", controller.addHighlight);

  app.get("/player/highlight/:id", controller.getAllHighlightByPlayerId);

  app.get("/player/position", controller.findAllPosition);

  app.get("/player/:id", controller.findOne);

  app.get("/player/gameByPlayerId/:id", controller.gameByPlayerId);

  app.get(
    "/player/gameDetailsByPlayerId/:id",
    controller.gameDetailsByPlayerId
  );

  app.get(
    "/player/game_player_tags/:userId/:teamId/:playerId/:gameId/:actionId/:actionTypeId/:actionResultId/:gameTime/:courtArea/:inside/:gameResult/:homeAway",
    controller.getGamePlayerTags
  );

  app.get(
    "/player/opponent_tags/:userId/:teamId/:playerId/:gameId/:actionId/:actionTypeId/:actionResultId/:gameTime/:courtArea/:inside/:gameResult/:homeAway",
    controller.getOpponentTags
  );

  app.get(
    "/player/player_detection/:gameId/:videoTime/:minBefore/:minAfter",
    controller.getPlayersDetection
  );

  app.post(
    "/player/getplayersstats/advance",
    controller.getPlayersStatsAdvanced
  );

  app.post(
    "/player/getplayersstats/summary",
    controller.getPlayersStatsAdvanceSummary
  );

  app.post(
    "/player/getgoalkeepersstats/advance",
    controller.getGoalkeepersStatsAdvanced
  );

  app.post(
    "/player/getgoalkeepersstats/summary",
    controller.getGoalkeepersStatsAdvanceSummary
  );

  app.get(
    "/player/getplayersstats/:seasonId/:leagueId/:gameId/:teamId/:playerId",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getPlayersStats
  );

  app.post(
    "/player",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.create
  );

  app.post(
    "/player/getplayersstats/game",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getPlayersStatsGamebyGame
  );

  app.post(
    "/player/getgoalkeepersstats/game",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getGoalkeepersStatsGamebyGame
  );

  app.get(
    "/player/request/getcorrection",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getCorrectionRequest
  );

  app.get(
    "/player/games/:season/:teams/:players",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getPlayersGames
  );

  app.get(
    "/player/teams/:season/:players",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getPlayersTeams
  );

  app.put(
    "/player/addcorrection/:curPlayerId/:newPlayerId/:playerTagId",
    controller.addCorrectionRequest
  );

  app.put(
    "/player/docorrection/:cId",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.doCorrection
  );

  app.put(
    "/player/:id",
    [authJwt.verifyToken, authJwt.isAdminOrTagger],
    controller.update
  );

  app.delete(
    "/player/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );

  app.delete("/player/correction/:id", controller.deleteCorrection);

  app.delete("/player", [authJwt.isAdmin], controller.deleteAll);

  app.post(
    "/user/updateConfig",
    [authJwt.verifyToken],
    controller.updateTaggerConfig
  );
};
