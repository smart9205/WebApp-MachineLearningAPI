const { authJwt } = require("../middleware");
const controller = require("../controllers/team_player.controller");
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
		"/team_player/create",
		[authJwt.isAdmin],
		controller.create
	);
	
	app.post(
		"/team_player/findall", 
		controller.findAll
	);

	app.post(
		"/team_player/playersbygameteam", 
		controller.getPlayersByGameTeam
	);

	app.get(
		"/team_player/:id",
		controller.findOne
	);

	app.put(
		"/team_player/:id",
		[authJwt.isAdmin],
		controller.update
	);

	app.post(
		"/team_player/updatejersey",
		[authJwt.isAdmin],
		controller.updateJersey
	);

	app.delete(
		"/team_player/:id",
		[authJwt.isAdmin],
		controller.delete
	);

	app.delete(
		"/team_player", 
		[authJwt.isAdmin],
		controller.deleteAll
	);
};
  