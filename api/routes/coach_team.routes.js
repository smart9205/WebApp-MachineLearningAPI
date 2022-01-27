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

	app.get(
		"/coach_team",
		controller.findAll
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
