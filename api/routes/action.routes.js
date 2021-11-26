const { authJwt } = require("../middleware");
const controller = require("../controllers/action.controller");
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
		"/action",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.get(
		"/action", 
		controller.findAll
	);

	app.get(
		"/action/:id",
		controller.findOne
	);

	app.put(
		"/action/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.delete(
		"/action/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/action", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  