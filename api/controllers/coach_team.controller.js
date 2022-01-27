const db = require("../models");
const Coach_Team = db.coach_team;
const Op = db.Sequelize.Op;
const Sequelize = db.sequelize;

exports.create = (req, res) => {
  // Validate request
  const coach_team = {
    user_id: req.body.user_id,
    season_id: req.body.season_id,
    league_id: req.body.league_id,
    team_id: req.body.team_id,
  };

  Coach_Team.create(coach_team)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Coach_Team."
      });
    });

};

exports.findAll = (req, res) => {

  Sequelize.query(`
    SELECT 
      public."Coach_Teams".*,
      CONCAT (public."Users".first_name,' ', public."Users".last_name) as coach_name,
      public."Seasons".name as season_name,
      public."Leagues".name as league_name,
      public."Teams".name as team_name
    FROM public."Coach_Teams" 
    JOIN public."Users" on public."Users".id = public."Coach_Teams".user_id
    JOIN public."Teams" on public."Teams".id = public."Coach_Teams".team_id
    JOIN public."Seasons" on public."Seasons".id = public."Coach_Teams".season_id
    JOIN public."Leagues" on public."Leagues".id = public."Coach_Teams".league_id
  `)
    .then(data => {
      res.send(data[0]);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving games."
      });
    });

};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Coach_Team.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Coach_Team with id=" + id
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Coach_Team.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Coach_Team was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Coach_Team with id=${id}. Maybe Coach_Team was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Coach_Team with id=" + id
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Coach_Team.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Coach_Team was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Coach_Team with id=${id}. Maybe Coach_Team was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Coach_Team with id=" + id
      });
    });
};

exports.deleteAll = (req, res) => {
  Coach_Team.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Seasons were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Seasons."
      });
    });
};

