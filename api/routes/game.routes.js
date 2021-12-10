const { authJwt } = require("../middleware");
const controller = require("../controllers/game.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use([authJwt.verifyToken]);

	app.post(
		"/game",
		[authJwt.isAdmin],
		controller.create
	);
	app.post(
		"/game/deleteGames",
		[authJwt.isAdmin],
		controller.deleteGames
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
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/game/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/game", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  