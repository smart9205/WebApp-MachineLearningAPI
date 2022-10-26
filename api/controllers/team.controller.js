const db = require("../models");
const Team = db.team;
const Op = db.Sequelize.Op;
const Sequelize = db.Sequelize;

exports.create = async (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }

  const team = {
    name: req.body.name,
    image: req.body.image,
    team_color: req.body.team_color,
    second_color: req.body.second_color,
    sponsor_logo: req.body.sponsor_logo,
    sponsor_url: req.body.sponsor_url,
    create_highlights: req.body.create_highlights,
    show_sponsor: req.body.show_sponsor,
    team_language: req.body.team_language,
    filter_by_position: req.body.filter_by_position,
  };

  const checkTeam = await Team.findOne({
    where: {
      name: req.body.name,
    },
  });

  if (checkTeam !== null) {
    return res.send({
      status: "error",
      data: "Same Name of Team already exist",
    });
  }

  Team.create(team)
    .then((data) => {
      res.send({ status: "success", data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Team.",
      });
    });
};

exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Team.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Team.findByPk(id)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Team with id=" + id,
      });
    });
};

exports.getTeamsStatsAdvanced = (req, res) => {
  const game_time =
    req.body.gameTime === null ? null : `'${req.body.gameTime}'`;
  const court =
    req.body.courtAreaId === null ? null : `'${req.body.courtAreaId}'`;
  const game_id = req.body.gameId === null ? null : `'${req.body.gameId}'`;
  const league_id =
    req.body.leagueId === null ? null : `'${req.body.leagueId}'`;
  const team_id = req.body.teamId === null ? null : `'${req.body.teamId}'`;

  Sequelize.query(
    `
    SELECT * from public.fnc_get_team_stats_advance(
      ${req.body.seasonId},
      ${league_id},
      ${game_id},
      ${team_id},
      ${req.userId},
      ${game_time},
      ${court},
      ${req.body.insidePaint},
      ${req.body.homeAway},
      ${req.body.gameResult}
    )
  `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((e) => {
      res.status(500).send({
        message: e.message || "Some error occurred while retrieving games.",
      });
    });
};

exports.getTeamsStatsGamebyGame = (req, res) => {
    const game_time =
        req.body.gameTime === null ? null : `'${req.body.gameTime}'`;
    const court =
        req.body.courtAreaId === null ? null : `'${req.body.courtAreaId}'`;
    const game_id = req.body.gameId === null ? null : `'${req.body.gameId}'`;
    const league_id =
        req.body.leagueId === null ? null : `'${req.body.leagueId}'`;

    Sequelize.query(
        `
    SELECT * from public.fnc_get_teams_stats_game_by_game(
      ${req.body.seasonId},
      ${league_id},
      ${game_id},
      ${req.body.teamId},
      ${req.body.playerId},
      ${req.userId},
      ${game_time},
      ${court},
      ${req.body.insidePaint},
      ${req.body.homeAway},
      ${req.body.gameResult}
    )
  `
    )
        .then((data) => {
            res.send(data[0]);
        })
        .catch((e) => {
            res.status(500).send({
                message:
                    e.message || "Some error occurred while retrieving games.",
            });
        });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Team.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Team was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Team with id=${id}. Maybe Team was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Team with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Team.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Team was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Team with id=${id}. Maybe Team was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Team with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Team.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Seasons were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Seasons.",
      });
    });
};
