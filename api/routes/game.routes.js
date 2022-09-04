const { authJwt } = require("../middleware");
const controller = require("../controllers/game.controller");
module.exports = app => {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});

	app.post(
		"/game",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.create
	);
	app.post(
		"/game/deleteGames",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.deleteGames
	);
	app.post(
		"/game/getnewstream",
		controller.getNewStreamURL
	);

	app.post(
		"/game/getplayeractions",
		controller.getPlayerActions
	);

	app.post(
		"/game/getscoreingames",
		controller.getScoreInGames
	);

	app.get(
		"/game",
		controller.findAll
	);

	app.get(
		"/game/:id",
		controller.findOne
	);

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
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getbyTeam
	);

	app.get(
		"/game/getbycoach/:seasonId/:leagueId/:teamId/:datesBack",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getbyCoach
	);

	app.get(
		"/game/getgamebyid/:gameId",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getGameById
	);

	app.get(
		"/game/getcleangame/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getCleanGame
	);

	app.get(
		"/game/getteamgoals/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamGoals
	);

	app.get(
		"/game/getopponentgoals/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentGoals
	);

	app.get(
		"/game/getteamgoalopportunity/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamGoalOpportunity
	);

	app.get(
		"/game/getopponentgoalopportunity/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentGoalOpportunity
	);

	app.get(
		"/game/getteamoffensivepossession/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamOffensivePossession
	);

	app.get(
		"/game/getopponentoffensivepossession/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentOffensivePossession
	);

	app.get(
		"/game/getteamdefensivepossession/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamDefensivePossession
	);

	app.get(
		"/game/getopponentdefensivepossession/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentDefensivePossession
	);

	app.get(
		"/game/getteambuildupgoalkeeper/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamBuildUpGoalkeeper
	);

	app.get(
		"/game/getopponentbuildupgoalkeeper/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentBuildUpGoalkeeper
	);

	app.get(
		"/game/getteambuildupgoalkeeperkick/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamBuildUpGoalkeeperKick
	);

	app.get(
		"/game/getopponentbuildupgoalkeeperkick/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentBuildUpGoalkeeperKick
	);

	app.get(
		"/game/getteambuildondefensivehalf/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamBuildOnDefensiveHalf
	);

	app.get(
		"/game/getopponentbuildondefensivehalf/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentBuildOnDefensiveHalf
	);

	app.get(
		"/game/getteaminterception/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamStartedFromInterception
	);

	app.get(
		"/game/getopponentinterception/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentStartedFromInterception
	);

	app.get(
		"/game/getteamtackle/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamStartedFromTackle
	);

	app.get(
		"/game/getopponenttackle/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentStartedFromTackle
	);

	app.get(
		"/game/getteamthrowin/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamStartedFromThrowIn
	);

	app.get(
		"/game/getopponentthrowin/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentStartedFromThrowIn
	);

	app.get(
		"/game/getteamfreekick/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamFreeKick
	);

	app.get(
		"/game/getopponentfreekick/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentFreeKick
	);

	app.get(
		"/game/getteamcorner/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamCorner
	);

	app.get(
		"/game/getopponentcorner/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentCorner
	);

	app.get(
		"/game/getteamcross/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamCross
	);

	app.get(
		"/game/getopponentcross/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentCross
	);

	app.get(
		"/game/getteampenalty/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamPenaltyGained
	);

	app.get(
		"/game/getopponentpenalty/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentPenaltyGained
	);

	app.get(
		"/game/getteamdrawfoul/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamDrawFoul
	);

	app.get(
		"/game/getopponentdrawfoul/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentDrawFoul
	);

	app.get(
		"/game/getteamoffside/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamOffside
	);

	app.get(
		"/game/getopponentoffside/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentOffside
	);

	app.get(
		"/game/getteamshots/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamShots
	);

	app.get(
		"/game/getopponentshots/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentShots
	);

	app.get(
		"/game/getgamehighlight/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getGameHighlight
	);

	app.get(
		"/game/getteambuildonoffensivehalf/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamBuildOnOffensiveHalf
	);

	app.get(
		"/game/getopponentbuildonoffensivehalf/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentBuildOnOffensiveHalf
	);

	app.get(
		"/game/getteamcounterattack/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamCounterAttack
	);

	app.get(
		"/game/getopponentcounterattack/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentCounterAttack
	);

	app.get(
		"/game/getteamturnover/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamTurnovers
	);

	app.get(
		"/game/getopponentturnover/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentTurnovers
	);

	app.get(
		"/game/getteamsaved/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamSaved
	);

	app.get(
		"/game/getopponentsaved/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentSaved
	);

	app.get(
		"/game/getteamclearance/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamClearance
	);

	app.get(
		"/game/getopponentclearance/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentClearance
	);

	app.get(
		"/game/getteamblocked/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getTeamBlocked
	);

	app.get(
		"/game/getopponentblocked/:teamId/:gameIds",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getOpponentBlocked
	);
};
