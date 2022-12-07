const db = require("../models");
const User = db.user;
const Sequelize = db.sequelize;

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.loggerBoard = (req, res) => {
  res.status(200).send("Logger Content.");
};

exports.getAllCoach = (req, res) => {
  User.findAll({
    include: [{ model: db.role, where: { id: 3 } }],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.getAllRepresentatives = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_get_representative()
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.addRepresentative = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_add_representative(${req.params.userId})
    `
  )
    .then((data) => {
      res.send("Successfully added");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.deleteRepresentative = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_delete_representative(${req.params.userId})
    `
  )
    .then((data) => {
      res.send("Successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.getAllUsers = (req, res) => {
  Sequelize.query(
    `
      SELECT * FROM public."Users"
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.addAcademy = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_new_academy('${req.params.name}','${req.params.country}')
    `
  )
    .then((data) => {
      res.send("Successfully added");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.deleteAcademy = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_delete_academy(${req.params.id})
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.editAcademy = (req, res) => {
  Sequelize.query(
    `
      UPDATE public."Academies" SET "name" = '${req.params.name}', "Country" = '${req.params.country}' WHERE public."Academies"."id" = ${req.params.id}
    `
  )
    .then((data) => {
      res.send("Successfully updated");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.addAcademyToRepresentative = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_add_academy_to_representative(${req.params.academyId},${req.params.userId})
    `
  )
    .then((data) => {
      res.send("Successfully added");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.getAcademiesForRepresentative = (req, res) => {
  Sequelize.query(
    `
      select * from public.fnc_get_representative_academies(${req.params.userId})
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.deleteAcademyFromRepresentative = (req, res) => {
  Sequelize.query(
    `
      DELETE FROM public."Representative_Academies" WHERE public."Representative_Academies"."user_id" = ${req.params.userId} and public."Representative_Academies"."academy_id" = ${req.params.academyId}
    `
  )
    .then((data) => {
      res.send("Successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.getAllAcademies = (req, res) => {
  Sequelize.query(
    `
      SELECT * FROM public."Academies"
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.getTeamsByAcademy = (req, res) => {
  Sequelize.query(
    `
      SELECT public."Teams".*, public."Academy_Teams".*
      FROM public."Academy_Teams"
      JOIN public."Teams" on public."Teams"."id" = public."Academy_Teams"."team_id"
      WHERE public."Academy_Teams"."user_id" = ${req.params.userId} and public."Academy_Teams"."academy_id" = ${req.params.academyId} and public."Academy_Teams"."season_id" = ${req.params.seasonId}
    `
  )
    .then((data) => {
      res.send(data[0]);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.addTeamToAcademy = (req, res) => {
  const date = new Date().toDateString();

  Sequelize.query(
    `
      INSERT INTO public."Academy_Teams" ("user_id", "season_id", "team_id", "createdAt", "updatedAt", "academy_id") VALUES(${req.params.userId}, ${req.params.seasonId}, ${req.params.teamId}, '${date}', '${date}', ${req.params.academyId})
    `
  )
    .then((data) => {
      res.send("Successfully added");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};

exports.deleteTeamsFromAcademy = (req, res) => {
  Sequelize.query(
    `
      DELETE FROM public."Academy_Teams"
      WHERE public."Academy_Teams"."user_id" = ${req.params.userId} and
        public."Academy_Teams"."academy_id" = ${req.params.academyId} and
        public."Academy_Teams"."season_id" = ${req.params.seasonId} and
        public."Academy_Teams"."team_id" = ${req.params.teamId}
    `
  )
    .then((data) => {
      res.send("Successfully deleted");
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving seasons.",
      });
    });
};
