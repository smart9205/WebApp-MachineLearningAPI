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

    app.post(
        "/player",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.create
    );

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
        "/player/getplayersstats/:seasonId/:leagueId/:gameId/:teamId/:playerId",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getPlayersStats
    );

    app.post(
        "/player/getplayersstats/advance",
        controller.getPlayersStatsAdvanced
    );

    app.post(
        "/player/getplayersstats/game",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getPlayersStatsGamebyGame
    );

    app.get(
        "/player/game_player_tags/:userId/:teamId/:playerId/:gameId/:actionId/:actionTypeId/:actionResultId",
        controller.getGamePlayerTags
    );

    app.get(
        "/player/player_detection/:gameId/:videoTime",
        controller.getPlayersDetection
    );

    app.get(
        "/player/request/getcorrection",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getCorrectionRequest
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
        [authJwt.verifyToken, authJwt.isAdmin],
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
