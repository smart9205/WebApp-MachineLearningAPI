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
