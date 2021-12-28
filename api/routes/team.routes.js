const { authJwt } = require("../middleware");
const controller = require("../controllers/team.controller");
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
		"/team",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.get(
		"/team", 
		controller.findAll
	);

	app.get(
		"/team/:id",
		controller.findOne
	);

	app.put(
		"/team/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/team/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/team", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  