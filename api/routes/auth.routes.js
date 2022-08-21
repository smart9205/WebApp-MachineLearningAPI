const { verifySignUp, authJwt } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/verification",  controller.firstVerify);

  app.post("/api/auth/forgetpassword",  controller.forgetpassword);

  app.post("/api/auth/resetPwdVerify",  controller.resetPwdVerify);

  app.post("/api/auth/resetpassword",  controller.resetPassword);

  app.post("/api/auth/updatepassword",  controller.updatePassword);

  app.post(
    "/api/auth/updateprofile", 
    [authJwt.verifyToken],
    controller.updateProfile
  );

  app.post(
    "/api/auth/updateprofile1", 
     [authJwt.verifyToken, authJwt.isCoach],
    controller.updateProfile1
  );

  app.post(
    "/api/auth/updateprofile2", 
     [authJwt.verifyToken, authJwt.isCoach],
    controller.updateProfile2
  );
};
