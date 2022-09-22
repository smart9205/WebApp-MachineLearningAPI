const { authJwt } = require("../middleware");
const controller = require("../controllers/team_tag.controller");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.use([authJwt.verifyToken]);

  app.post("/team_tag", controller.create);

  app.get("/team_tag", controller.findAll);

  app.get("/team_tag/:id", controller.findOne);

  app.get("/team_tag/getbygame/:id", controller.getByGameId);

  app.put("/team_tag/:id", [authJwt.isAdmin], controller.update);

  app.delete("/team_tag/:id", controller.delete);

  app.delete("/team_tag", controller.deleteAll);
};
