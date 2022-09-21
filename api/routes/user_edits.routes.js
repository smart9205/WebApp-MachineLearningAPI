const { authJwt } = require("../middleware");
const controller = require("../controllers/user_edits.controller");
module.exports = app => {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});
	app.use([authJwt.verifyToken]);

	app.post(
		"/user_edits",
		[authJwt.isCoach],
		controller.create
	);

	app.post(
		"/user_edits_folders",
		[authJwt.isCoach],
		controller.createFolder
	);

	app.post(
		"/user_edits_create",
		[authJwt.isCoach],
		controller.createEdit
	);

	app.get(
		"/user_edits",
		controller.findAll
	);

	app.get(
		"/user_edits_folders/:id",
		controller.findFolder
	);

	app.get(
		"/user_edits_folders_all",
		[authJwt.isCoach],
		controller.findAllFolders
	)

	app.get(
		"/user_edits/:id",
		controller.findOne
	);

	app.get(
		"/user_edits/big_sort/:type/:parentId",
		controller.getBiggestSortNumber
	);

	app.get(
		"/user_edits/video_source/:parentId",
		controller.getVideoSourceFromEdit
	);

	app.put(
		"/user_edits/:id",
		[authJwt.isCoach],
		controller.update
	);

	app.put(
		"/user_edit_clips_sort",
		[authJwt.isCoach],
		controller.updateEditClipsSort
	);

	app.put(
		"/user_edit_clip/:id",
		[authJwt.isCoach],
		controller.updateEditClip
	);

	app.put(
		"/user_edit_clip/add/:id",
		[authJwt.isCoach],
		controller.addNewEditClips
	);

	app.put(
		"/user_edit_clip/move/:clipIds/:editId",
		[authJwt.isCoach],
		controller.moveClips
	);

	app.put(
		"/user_edit_clip/copy/:clipIds/:editId",
		[authJwt.isCoach],
		controller.copyClips
	);

	app.put(
		"/user_edit_folders/move",
		[authJwt.isCoach],
		controller.moveFolderNewPosition
	);

	app.delete(
		"/user_edits/:id",
		[authJwt.isCoach],
		controller.delete
	);

	app.delete(
		"/user_edits_folders/:id",
		[authJwt.isCoach],
		controller.deleteFolder
	);

	app.delete(
		"/user_edits/edit_clip/:id",
		[authJwt.isCoach],
		controller.deleteClip
	);

	app.delete(
		"/user_edits",
		[authJwt.isCoach],
		controller.deleteAll
	);
};
