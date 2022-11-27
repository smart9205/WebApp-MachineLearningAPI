const { authJwt } = require("../middleware");
const controller = require("../controllers/user_edits.controller");
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/user_edits",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.create
  );

  app.post(
    "/user_edits_folders",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.createFolder
  );

  app.post(
    "/user_edits_create",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.createEdit
  );

  app.get("/user_edits", controller.findAll);

  app.get("/user_edits_folders/:id", controller.findFolder);

  app.get(
    "/user_edits_folders_all",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.findAllFolders
  );

  app.get("/user_edits/:id", controller.findOne);

  app.get(
    "/user_edits/big_sort/:type/:parentId",
    controller.getBiggestSortNumber
  );

  app.get(
    "/user_edits/video_source/:parentId",
    controller.getVideoSourceFromEdit
  );

  app.post(
    "/user_edits/share",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.sendShareEmail
  );

  app.get(
    "/user_edits/get/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getEditbyId
  );

  app.get(
    "/user_edits/get_share/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.getShareURL
  );

  app.post("/user_edits_verify", controller.verifyShareId);

  app.put(
    "/user_edits/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.update
  );

  app.put(
    "/user_edit_clips_sort",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.updateEditClipsSort
  );

  app.put(
    "/user_edit_clip/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.updateEditClip
  );

  app.put(
    "/user_edit_clip/add/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.addNewEditClips
  );

  app.put(
    "/user_edit_clip/move/:clipIds/:editId",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.moveClips
  );

  app.put(
    "/user_edit_clip/copy/:clipIds/:editId",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.copyClips
  );

  app.put(
    "/user_edit_folders/move",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.moveFolderNewPosition
  );

  app.delete(
    "/user_edits/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.delete
  );

  app.delete(
    "/user_edits_folders/:id",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.deleteFolder
  );

  app.delete(
    "/user_edits/edit_clip/:clipIds",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.deleteClip
  );

  app.delete(
    "/user_edits",
    [authJwt.verifyToken, authJwt.isAdminOrCoach],
    controller.deleteAll
  );
};
