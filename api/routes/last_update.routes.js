const { authJwt } = require("../middleware");
const controller = require("../controllers/last_update.controller");
module.exports = app => {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use([authJwt.verifyToken]);

	app.post("/last_update",
		controller.create
	);
	
	// Retrieve all last_updates
	app.get("/last_update", 
		controller.findAll
	);

	// Retrieve a single last_update with id
	app.get("/last_update/:id",
		controller.findOne
	);

	// Update a last_update with id
	app.put("/last_update/:id",
		controller.update
	);

	// Delete a last_update with id
	app.delete("/last_update/:id",
		controller.delete
	);

	// Delete all last_updates
	app.delete("/last_update", 
		controller.deleteAll
	);
};
  