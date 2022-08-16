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
		"/game/getbycoach/:coachId",
		[authJwt.verifyToken, authJwt.isCoach],
		controller.getbyCoach
	);
};
