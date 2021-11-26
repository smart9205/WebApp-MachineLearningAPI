const { authJwt } = require("../middleware");
const controller = require("../controllers/league.controller");
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
		"/league",
		[authJwt.isAdmin],
		controller.create
	);
	
	// Retrieve all leagues
	app.get(
		"/league", 
		controller.findAll
	);

	// Retrieve a single league with id
	app.get(
		"/league/:id",
		controller.findOne
	);

	// Update a league with id
	app.put(
		"/league/:id",
		[authJwt.isAdmin],
		controller.update
	);

	// Delete a league with id
	app.delete(
		"/league/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	// Delete all leagues
	app.delete(
		"/league", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  