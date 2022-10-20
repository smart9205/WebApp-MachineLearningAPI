const { authJwt } = require("../middleware");
const controller = require("../controllers/coach_team.controller");
module.exports = (app) => {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post(
        "/coach_team",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.create
    );

    app.post(
        "/coach_team/get_tags_by_player",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getTagsByPlayer
    );

    app.get("/coach_team", controller.findAll);

    app.get(
        "/coach_team/mine",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.findAllMine
    );

    app.get(
        "/coach_team/teams",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getCoachTeamList
    );

    app.get(
        "/coach_team/player_games/:id",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getAllPlayerGames
    );

    app.get(
        "/coach_team/getAllPlayersByCoach",
        controller.getAllPlayersByCoach
    );

    app.get(
        "/coach_team/getAllLeaguesByCoach",
        controller.getAllLeaguesByCoach
    );

    app.get("/coach_team/getAllTeamsByCoach", controller.getAllTeamsByCoach);

    app.get(
        "/coach_team/getAllLeaguesOfAdditionalGamesByCoach",
        controller.getAllLeaguesOfAdditionalGamesByCoach
    );

    app.get(
        "/coach_team/getAllTeamsOfAdditionalGamesByCoach",
        controller.getAllTeamsOfAdditionalGamesByCoach
    );

    app.get(
        "/coach_team/getNumberOfGamesOrdered",
        controller.getNumberOfGamesOrdered
    );

    app.get(
        "/coach_team/team_players/:teamId/:seasonId/:leagueId",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getCoachTeamPlayers
    );

    app.get(
        "/coach_team/game_team_players/:teamId/:gameIds",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getGameCoachTeamPlayers
    );

    app.get(
        "/coach_team/game_opponent_players/:teamId/:gameIds",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getGameOpponentPlayers
    );

    app.get(
        "/coach_team/coach_players",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getCoachPlayers
    );

    app.get(
        "/coach_team/players",
        [authJwt.verifyToken, authJwt.isAdminOrCoach],
        controller.getAllPlayers
    );

    app.get("/coach_team/:id", controller.findOne);

    app.put(
        "/coach_team/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.update
    );

    app.delete(
        "/coach_team/:id",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.delete
    );

    app.delete(
        "/coach_team",
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteAll
    );
};
