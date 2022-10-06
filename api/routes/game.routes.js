const { authJwt } = require("../middleware");
const controller = require("../controllers/game.controller");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/game", [authJwt.verifyToken, authJwt.isAdmin], controller.create);
  app.post(
    "/game/deleteGames",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteGames
  );
  app.post("/game/getnewstream", controller.getNewStreamURL);

  app.post("/game/getplayeractions", controller.getPlayerActions);

  app.post("/game/getscoreingames", controller.getScoreInGames);

  app.get("/game", controller.findAll);

  app.get("/game/standing", controller.getTeamInitialStanding);

  app.get("/game/:id", controller.findOne);

  app.put(
    "/game/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.update
  );

  app.delete(
    "/game/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.delete
  );

  app.delete(
    "/game",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteAll
  );

  app.get(
    "/game/getbyteam/:season/:league/:team",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getbyTeam
  );

  app.get(
    "/game/getbycoach/:seasonId/:leagueId/:teamId/:datesBack",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getbyCoach
  );

  app.get(
    "/game/getadditional/:seasonId/:leagueId/:teamId/:datesBack",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getAdditionalGames
  );

  app.get(
    "/game/getgamebyid/:gameId",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getGameById
  );

  app.get(
    "/game/getcleangame/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getCleanGame
  );

  app.get(
    "/game/getteamgoals/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamGoals
  );

  app.get(
    "/game/getopponentgoals/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentGoals
  );

  app.get(
    "/game/getteamgoalopportunity/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamGoalOpportunity
  );

  app.get(
    "/game/getopponentgoalopportunity/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentGoalOpportunity
  );

  app.get(
    "/game/getteamoffensivepossession/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamOffensivePossession
  );

  app.get(
    "/game/getopponentoffensivepossession/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentOffensivePossession
  );

  app.get(
    "/game/getteamdefensivepossession/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamDefensivePossession
  );

  app.get(
    "/game/getopponentdefensivepossession/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentDefensivePossession
  );

  app.get(
    "/game/getteambuildupgoalkeeper/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamBuildUpGoalkeeper
  );

  app.get(
    "/game/getopponentbuildupgoalkeeper/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentBuildUpGoalkeeper
  );

  app.get(
    "/game/getteambuildupgoalkeeperkick/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamBuildUpGoalkeeperKick
  );

  app.get(
    "/game/getopponentbuildupgoalkeeperkick/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentBuildUpGoalkeeperKick
  );

  app.get(
    "/game/getteambuildondefensivehalf/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamBuildOnDefensiveHalf
  );

  app.get(
    "/game/getopponentbuildondefensivehalf/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentBuildOnDefensiveHalf
  );

  app.get(
    "/game/getteaminterception/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamStartedFromInterception
  );

  app.get(
    "/game/getopponentinterception/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentStartedFromInterception
  );

  app.get(
    "/game/getteamtackle/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamStartedFromTackle
  );

  app.get(
    "/game/getopponenttackle/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentStartedFromTackle
  );

  app.get(
    "/game/getteamthrowin/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamStartedFromThrowIn
  );

  app.get(
    "/game/getopponentthrowin/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentStartedFromThrowIn
  );

  app.get(
    "/game/getteamfreekick/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamFreeKick
  );

  app.get(
    "/game/getopponentfreekick/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentFreeKick
  );

  app.get(
    "/game/getteamcorner/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamCorner
  );

  app.get(
    "/game/getopponentcorner/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentCorner
  );

  app.get(
    "/game/getteamcross/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamCross
  );

  app.get(
    "/game/getopponentcross/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentCross
  );

  app.get(
    "/game/getteampenalty/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamPenaltyGained
  );

  app.get(
    "/game/getopponentpenalty/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentPenaltyGained
  );

  app.get(
    "/game/getteamdrawfoul/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamDrawFoul
  );

  app.get(
    "/game/getopponentdrawfoul/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentDrawFoul
  );

  app.get(
    "/game/getteamoffside/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamOffside
  );

  app.get(
    "/game/getopponentoffside/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentOffside
  );

  app.get(
    "/game/getteamshots/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamShots
  );

  app.get(
    "/game/getopponentshots/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentShots
  );

  app.get(
    "/game/getgamehighlight/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getGameHighlight
  );

  app.get(
    "/game/getteambuildonoffensivehalf/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamBuildOnOffensiveHalf
  );

  app.get(
    "/game/getopponentbuildonoffensivehalf/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentBuildOnOffensiveHalf
  );

  app.get(
    "/game/getteamcounterattack/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamCounterAttack
  );

  app.get(
    "/game/getopponentcounterattack/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentCounterAttack
  );

  app.get(
    "/game/getteamturnover/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamTurnovers
  );

  app.get(
    "/game/getopponentturnover/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentTurnovers
  );

  app.get(
    "/game/getteamsaved/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamSaved
  );

  app.get(
    "/game/getopponentsaved/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentSaved
  );

  app.get(
    "/game/getteamclearance/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamClearance
  );

  app.get(
    "/game/getopponentclearance/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentClearance
  );

  app.get(
    "/game/getteamblocked/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getTeamBlocked
  );

  app.get(
    "/game/getopponentblocked/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getOpponentBlocked
  );

  app.get(
    "/game/game_export_sportcode/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.gameExportSportcode
  );

  app.get(
    "/game/game_export_sportcode_short/:teamId/:gameIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.gameExportSportcodeShort
  );
};
