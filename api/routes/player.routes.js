const { authJwt } = require("../middleware");
const controller = require("../controllers/player.controller");
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
		"/player",
		[authJwt.isAdmin],
		controller.create
	);

	app.get(
		"/player",
		controller.findAll
	);

	app.get(
		"/player/position",
		controller.findAllPosition
	);

	app.get(
		"/player/:id",
		controller.findOne
	);

	app.get(
		"/player/gameByPlayerId/:id",
		controller.gameByPlayerId
	);

	app.put(
		"/player/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/player/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/player",
		[authJwt.isAdmin],
		controller.deleteAll
	);

	app.post(
		"/user/updateConfig",
		controller.updateTaggerConfig
	);
};
