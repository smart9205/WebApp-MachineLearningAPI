const db = require("../models");
const axios = require("axios");
const Game = db.game;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;
const Team_Tag = db.team_tag;

exports.create = (req, res) => {
  // Validate request
  // if (!req.body.name) {
  //   res.status(400).send({
  //     message: "Name can not be empty!"
  //   });
  //   return;
  // }
  Game.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Game.",
      });
    });
};

exports.getNewStreamURL = async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.sportgate.ai/api/video/v1/youtube_download_link",
      req.body
    );
    return res.send(response?.data);
  } catch (e) {
    return res.send("error occured");
  }
};

exports.getbyTeam = (req, res) => {
  const seasonId = req.params.season;
  const leagueId = req.params.league;
  const teamId = req.params.team;

  Sequelize.query(
    `
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    WHERE (public."Games".home_team_id = ${teamId} OR public."Games".away_team_id = ${teamId})  
      AND public."Games".season_id = ${seasonId} AND public."Games".league_id = ${leagueId}
    ORDER BY public."Games".date desc
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getbyCoach = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_games(
      ${req.params.seasonId}, 
      ${req.params.leagueId}, 
      ${req.params.teamId}, 
      ${req.userId}, 
      ${req.params.datesBack}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getAdditionalGames = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_additional_games(
      ${req.params.seasonId}, 
      ${req.params.leagueId}, 
      ${req.params.teamId}, 
      ${req.userId}, 
      ${req.params.datesBack}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getCleanGame = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_clean_game(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamGoals = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_goals(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentGoals = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_goals(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamGoalOpportunity = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_shots_on_target(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentGoalOpportunity = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_shots_on_target(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamOffensivePossession = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_offensive_possessions(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentOffensivePossession = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_offensive_possessions(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamDefensivePossession = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_defensive_possessions(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentDefensivePossession = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_defensive_possessions(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamBuildOnOffensiveHalf = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_build_up_on_offensive_half(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentBuildOnOffensiveHalf = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_build_up_on_offensive_half(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamBuildUpGoalkeeper = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_build_up_goalkeeper(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentBuildUpGoalkeeper = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_build_up_goalkeeper(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamBuildUpGoalkeeperKick = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_build_up_goalkeeper_kick(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentBuildUpGoalkeeperKick = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_build_up_goalkeeper_kick(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamBuildOnDefensiveHalf = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_build_up_on_defensive_half(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentBuildOnDefensiveHalf = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_build_up_on_defensive_half(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamStartedFromInterception = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_possessions_started_of_interception(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentStartedFromInterception = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_possessions_started_of_interception(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamStartedFromTackle = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_possessions_started_of_tackle(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentStartedFromTackle = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_possessions_started_of_tackle(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamStartedFromThrowIn = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_possessions_started_of_throw_in(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentStartedFromThrowIn = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_possessions_started_of_throw_in(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamFreeKick = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_free_kicks(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentFreeKick = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_free_kicks(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamCorner = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_corners(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentCorner = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_corners(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamCross = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_crosses(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentCross = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_crosses(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamPenaltyGained = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_penalty_gained(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentPenaltyGained = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_penalty_gained(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamDrawFoul = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_draw_foul(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentDrawFoul = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_draw_foul(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamOffside = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_offside(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentOffside = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_offside(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamShots = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_shots(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentShots = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_shots(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamTurnovers = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_turnovers(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentTurnovers = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_turnovers(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamClearance = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_clearance(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentClearance = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_clearance(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamBlocked = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_blocked(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentBlocked = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_blocked(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamSaved = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_saved(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentSaved = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_saved(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getGameHighlight = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_highlights_game(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamCounterAttack = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_counter_attack(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getOpponentCounterAttack = (req, res) => {
  Sequelize.query(
    `
    SELECT * from public.fnc_get_opponent_counter_attack(
      ${req.params.teamId}, 
      '${req.params.gameIds}'
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.gameExportSportcode = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_export_game_to_sportcode(
      ${req.params.teamId},
      '${req.params.gameIds}',
      ${req.userId}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.gameExportSportcodeShort = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_export_game_to_sportcode_shorter_version(
      ${req.params.teamId},
      '${req.params.gameIds}',
      ${req.userId}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamInitialStanding = (req, res) => {
  Sequelize.query(
    `
    select * from public.fnc_get_team_initial_standing()
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.deleteGames = (req, res) => {
  Sequelize.query(
    `
    DELETE FROM public."Games" WHERE id IN (${req.body.games.map((id) => id)})
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.findAll = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Sequelize.query(
    `
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      AwayTeam.name as away_team_name
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    where public."Games".id = ${id}
  `
  )
    .then((data) => {
      res.send(data[0][0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getGameById = (req, res) => {
  Sequelize.query(
    `
    SELECT 
      public."Games".*,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      HomeTeam.name as home_team_name,
      HomeTeam.image as home_team_image,
      AwayTeam.name as away_team_name,
      AwayTeam.image as away_team_image
    FROM public."Games" 
    JOIN public."Seasons" on public."Games".season_id = public."Seasons".id
    JOIN public."Leagues" on public."Games".league_id = public."Leagues".id
    JOIN public."Teams" as HomeTeam on public."Games".home_team_id = HomeTeam.id
    JOIN public."Teams" as AwayTeam on public."Games".away_team_id = AwayTeam.id
    where public."Games".id = ${req.params.gameId}
  `
  )
    .then((data) => {
      res.send(data[0][0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getScoreInGames = (req, res) => {
  const gameIds = req.body.gameIds;
  const teamId = req.body.teamId;

  Sequelize.query(
    `
    SELECT 
      SUM(CASE WHEN team_id = ${teamId} THEN 1 ELSE 0 END) as team_score,
      SUM(CASE WHEN team_id <> ${teamId} THEN 1 ELSE 0 END) as opponent_score
    FROM public."Player_Tags"
    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Games" on public."Games".id = public."Team_Tags".game_id
    Where game_id in (${
      gameIds.length > 0 ? gameIds : 0
    }) and action_result_id = 3
  `
  )
    .then((data) => {
      res.send(data[0][0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getPlayerActions = (req, res) => {
  const gameIds = req.body.gameIds;
  const teamId = req.body.teamId;

  Sequelize.query(
    `
    SELECT 
      public."Players".*,
      SUM(CASE WHEN action_result_id = 3 THEN 1 ELSE 0 END) as "G",
      SUM(CASE WHEN action_id = 1 THEN 1 ELSE 0 END) as "SH",
      SUM(CASE WHEN action_id = 2 THEN 1 ELSE 0 END) as "P",
      SUM(CASE WHEN action_id = 10 THEN 1 ELSE 0 END) as "I",
      SUM(CASE WHEN action_id = 8 and action_type_id in (1, 2, 3) THEN 1 ELSE 0 END) as "S",
      SUM(CASE WHEN action_id = 11 and action_type_id in (1, 2, 3) THEN 1 ELSE 0 END) as "C"
      
    FROM public."Player_Tags"

    LEFT JOIN public."Team_Tags" on public."Team_Tags".id = public."Player_Tags".team_tag_id
    LEFT JOIN public."Games" on public."Games".id = public."Team_Tags".game_id
    LEFT JOIN public."Players" on public."Players".id = public."Player_Tags".player_id

    Where game_id in (${gameIds}) and team_id = ${teamId}
    group by public."Players".id
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Game.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Game was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Game with id = ${id}. Maybe Game was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Game with id=" + id,
      });
    });
};

exports.delete = async (req, res) => {
  const id = req.params.id;

  const teamTag = await Team_Tag.findOne({
    where: { game_id: id },
  });

  if (teamTag !== null) {
    return res.send({
      result: "fail",
      message: "Game can not be deleted as have tags",
    });
  }

  Game.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          result: "success",
          message: "Game was deleted successfully!",
        });
      } else {
        res.send({
          result: "success",
          message: `Cannot delete Game with id = ${id}. Maybe Game was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Game with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Game.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Games were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Games.",
      });
    });
};

exports.addHideGame = (req, res) => {
  const date = new Date().toDateString();

  Sequelize.query(
    `
      INSERT INTO public."Hide_Games" ("academy_id", "game_id", "team_id", "createdAt", "updatedAt") VALUES(${req.params.academyId}, ${req.params.gameId}, ${req.params.teamId}, '${date}', '${date}')
    `
  )
    .then((data) => {
      res.send("Successfully added");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Games.",
      });
    });
};

exports.deleteHideGame = (req, res) => {
  Sequelize.query(
    `
      DELETE FROM public."Hide_Games" WHERE public."Hide_Games".academy_id = ${req.params.academyId} and public."Hide_Games".game_id = ${req.params.gameId} and public."Hide_Games".team_id = ${req.params.teamId}
    `
  )
    .then((data) => {
      res.send("Successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Games.",
      });
    });
};

exports.getHideGame = (req, res) => {
  Sequelize.query(
    `
      SELECT public."Hide_Games".*
      FROM public."Hide_Games"
      WHERE public."Hide_Games".academy_id = ${req.params.academyId}
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Games.",
      });
    });
};
