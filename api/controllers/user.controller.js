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
      SELECT 
        public."Users".*,
        public."User_Roles"."roleId" as user_role
      FROM public."User_Roles"
      JOIN public."Users" on public."Users".id = public."User_Roles"."userId"
      WHERE public."User_Roles"."roleId" = 7
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
  const date = new Date().toDateString();

  Sequelize.query(
    `
      INSERT INTO public."User_Roles" ("createdAt", "updatedAt", "roleId", "userId") VALUES('${date}', '${date}', 7, ${req.params.userId})
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
      DELETE FROM public."User_Roles" WHERE public."User_Roles"."roleId" = ${req.params.roleId} and public."User_Roles"."userId" = ${req.params.userId}
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
  const date = new Date().toDateString();

  Sequelize.query(
    `
      INSERT INTO public."Academies" ("name", "createdAt", "updatedAt", "Country") VALUES('${req.params.name}', '${date}', '${date}', '${req.params.country}')
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
      DELETE FROM public."Academies" WHERE public."Academies"."id" = ${req.params.id}
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
  const date = new Date().toDateString();

  Sequelize.query(
    `
      INSERT INTO public."Representative_Academies" ("user_id", "academy_id", "createdAt", "updatedAt") VALUES(${req.params.userId}, ${req.params.academyId}, '${date}', '${date}')
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
      SELECT
        public."Academies".*
      FROM public."Representative_Academies"
      JOIN public."Academies" on public."Academies".id = public."Representative_Academies".academy_id
      WHERE public."Representative_Academies".user_id = ${req.params.userId}
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
