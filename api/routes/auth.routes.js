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

  app.post("/language/getbyname",  controller.getLanguage);

  app.post(
    "/api/auth/updateprofile", 
    [authJwt.verifyToken],
    controller.updateProfile
  );
};
