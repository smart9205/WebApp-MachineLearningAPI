const { authJwt } = require("../middleware");
const controller = require("../controllers/coach_team.controller");
module.exports = app => {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.use([authJwt.verifyToken]);

	app.post(
		"/coach_team",
		[authJwt.isAdmin],
		controller.create
	);

	app.post(
		"/coach_team/get_tags_by_player",
		[authJwt.isCoach],
		controller.getTagsByPlayer
	);

	app.get(
		"/coach_team",
		controller.findAll
	);

	app.get(
		"/coach_team/mine",
		[authJwt.isCoach],
		controller.findAllMine
	);

	app.get(
		"/coach_team/player_games/:id",
		[authJwt.isCoach],
		controller.getAllPlayerGames
	);

	app.get(
		"/coach_team/team_players/:teamId/:seasonId",
		[authJwt.isCoach],
		controller.getCoachTeamPlayers
	);

	app.get(
		"/coach_team/players",
		[authJwt.isCoach],
		controller.getAllPlayers
	);

	app.get(
		"/coach_team/:id",
		controller.findOne
	);

	app.put(
		"/coach_team/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/coach_team/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/coach_team",
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
