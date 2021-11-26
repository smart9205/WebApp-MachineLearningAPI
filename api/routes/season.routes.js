const { authJwt } = require("../middleware");
const controller = require("../controllers/season.controller");
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
		"/season",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.get(
		"/season", 
		controller.findAll
	);

	app.get(
		"/season/:id",
		controller.findOne
	);

	app.put(
		"/season/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/season/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/season", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  