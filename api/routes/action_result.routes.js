const { authJwt } = require("../middleware");
const controller = require("../controllers/action_result.controller");
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
		"/action_result",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.get(
		"/action_result", 
		controller.findAll
	);

	app.get(
		"/action_result/:id",
		controller.findOne
	);

	app.put(
		"/action_result/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/action_result/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/action_result", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  