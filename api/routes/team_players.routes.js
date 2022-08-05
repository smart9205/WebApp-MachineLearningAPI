const { authJwt } = require("../middleware");
const controller = require("../controllers/team_player.controller");
module.exports = app => {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});


	app.post(
		"/team_player/findall",
		controller.findAll
	);

	app.post(
		"/team_player/playersbygameteam",
		controller.getPlayersByGame
	);

	app.get(
		"/team_player/allplayersbygameteam/:gameid",
		controller.getAllGameTeamPlayers
	);

	app.get(
		"/team_player/:id",
		controller.findOne
	);

	app.get(
		"/team_player/playersbyteam/:team/:game",
		controller.getPlayersByTeam
	);

	app.get(
		"/team_player/teambyplayergame/:playerid/:gameid",
		controller.teambyplayergame
	);

	app.post(
		"/team_player/create",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.create
	);


	app.put(
		"/team_player/:id",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.update
	);

	app.post(
		"/team_player/updatejersey",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.updateJersey
	);

	app.delete(
		"/team_player/:id",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/team_player",
		[authJwt.verifyToken, authJwt.isAdmin],
		controller.deleteAll
	);
};
