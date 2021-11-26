const { authJwt } = require("../middleware");
const controller = require("../controllers/action_type.controller");
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
		"/action_type",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.get(
		"/action_type", 
		controller.findAll
	);

	app.get(
		"/action_type/:id",
		controller.findOne
	);

	app.put(
		"/action_type/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/action_type/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/action_type", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  