const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.get(
    "/api/test/logger",
    [authJwt.verifyToken, authJwt.isLogger],
    controller.loggerBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.get(
    "/user/coach",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllCoach
  );

  app.get(
    "/user/representative",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllRepresentatives
  );

  app.put(
    "/user/representative/add/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.addRepresentative
  );

  app.delete(
    "/user/representative/delete/:roleId/:userId",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteRepresentative
  );

  app.get(
    "/user/all",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );
};
