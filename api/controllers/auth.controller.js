var randomstring = require("randomstring");
const db = require("../models");
const config = require("../config/auth.config");
const dotenv = require("dotenv");
dotenv.config();

const User = db.user;
const VerificationToken = db.verificationToken;
const User_Config = db.user_config;
const Email_Queue = db.email_queue;
const Sequelize = db.sequelize;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var CryptoJS = require("crypto-js");
const role = require("../models/role");

sendEmail = async (to, subject, html) => {
  const sendgrid = require("@sendgrid/mail");
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: to.email, // Change to your recipient
    from: "scouting4u2010@gmail.com", // Change to your verified sender
    subject: subject,
    html: html,
  };

  const email_queue = await Email_Queue.create({
    user_id: to.id,
    user_email: to.email,
    send_date: new Date(),
    subject: subject,
    content: html,
  });

  sendgrid
    .send(msg)
    .then((resp) => {
      Email_Queue.update({ success: true }, { where: { id: email_queue.id } });
    })
    .catch((error) => {
      console.error(error);
      Email_Queue.update({ success: false }, { where: { id: email_queue.id } });
    });
};

sendSigninSuccessInfo = async (res, user) => {
  var token = jwt.sign({ id: user.id }, config.secret, {
    expiresIn: 86400, // 24 hours
  });

  let authorities = [];
  let validSubs = [];

  const roles = await user.getRoles();
  for (let i = 0; i < roles.length; i++) {
    authorities.push("ROLE_" + roles[i].name.toUpperCase());
  }

  let subscriptions = (
    await Sequelize.query(`
      SELECT public."User_Subscriptions".*, public."Subscriptions".name
      FROM public."User_Subscriptions" 
      JOIN public."Subscriptions" on public."User_Subscriptions".subscription_id = public."Subscriptions".id
      where public."User_Subscriptions".user_id = ${user.id}
     `)
  )[0];

  for (let i = 0; i < subscriptions.length; i++) {
    if (Date.now() < subscriptions[i].end_date)
      validSubs.push("SUB_" + subscriptions[i].name.toUpperCase());
  }

  userConf = await User_Config.findOne({
    where: {
      user_id: user.id,
    },
  });

  res.status(200).send({
    id: user.id,
    email: user.email,
    image: user.user_image,
    first_name: user.first_name,
    last_name: user.last_name,
    country: user.country,
    phone: user.phone_number,
    password: user.password,
    roles: authorities,
    accessToken:
      (validSubs.length > 0 || authorities.includes("ROLE_ADMIN")) && token,
    subscription: validSubs,
    user_config: userConf,
    create_edits: user.create_edits,
  });
};

exports.signup = (req, res) => {
  if (req.body.first_name == null || req.body.first_name === "") {
    return res.status(500).send({ message: "First name is required" });
  } else if (req.body.last_name == null || req.body.last_name === "") {
    return res.status(500).send({ message: "Last name is required" });
  } else if (req.body.phone_number == null || req.body.phone_number === "") {
    return res.status(500).send({ message: "Phone number is required" });
  } else if (req.body.country == null || req.body.country === "") {
    return res.status(500).send({ message: "Country is required" });
  }

  const password = randomstring.generate(8);

  // Save User to Database
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(password, 8),
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    country: req.body.country,
    phone_number: req.body.phone_number,
  })
    .then((user) => {
      // user role = 2//tagger
      // user role = 3//coach
      user.setRoles([3]).then(() => {
        VerificationToken.create({
          user_id: user.id,
          token: randomstring.generate(16),
        })
          .then((result) => {
            const data = {
              token: result.token,
              to: user.email,
            };
            //encrypt data
            const ciphertext = encodeURIComponent(
              CryptoJS.AES.encrypt(
                JSON.stringify(data),
                config.secret
              ).toString()
            );
            const url = `https://soccer.scouting4u.com/verification/${ciphertext}`;

            var html = `<!DOCTYPE html>
            <html>
              <head>
                <meta charset="UTF-8">
              </head>
              <body>
                <h2>Email Verification for Soccer Scouting4u</h2>
                Click on this link to verify your email <a href="${url}"> ${url} </a>
                <br>
                <h4>Your Password: ${password}</h4>
              </body>
            </html>`;

            sendEmail(user, "Verify Your Email", html);
            res
              .status(200)
              .send({
                message: `Registered successfully, Please verify your email.`,
              });
          })
          .catch((error) => {
            res.status(500).json(error);
          });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  if (user.is_verified) {
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    sendSigninSuccessInfo(res, user);
  } else {
    return res.status(401).send({ message: "Please Verify your Eamil" });
  }
};

exports.firstVerify = (req, res) => {
  var bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(req.body.verificationCode),
    config.secret
  );
  var data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  User.findOne({
    where: {
      email: data.to,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (user.is_verified) {
        sendSigninSuccessInfo(res, user);
      } else {
        return VerificationToken.findOne({
          where: {
            [Op.and]: [{ user_id: user.id }, { token: data.token }],
          },
        })
          .then((foundToken) => {
            if (foundToken) {
              VerificationToken.update(
                { token: "" },
                { where: { user_id: user.id } }
              );
              return user
                .update({ is_verified: true })
                .then((updatedUser) => {
                  sendSigninSuccessInfo(res, user);
                })
                .catch((reason) => {
                  return res.status(403).json(`Verification failed`);
                });
            } else {
              return res.status(404).json(`Token expired`);
            }
          })
          .catch((reason) => {
            return res.status(404).json(`Token expired`);
          });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.forgetpassword = async (req, res) => {
  const user = await User.findOne({ where: { email: req.body.email } });

  if (!user) {
    return res.status(401).send({ message: "Unregisterd User" });
  }

  let verificationToken = await VerificationToken.findOrCreate({
    where: { user_id: user.id },
  });

  await VerificationToken.update(
    {
      token: randomstring.generate(16),
    },
    {
      where: { user_id: user.id },
    }
  );
  verificationToken = await VerificationToken.findOne({
    where: { user_id: user.id },
  });

  const data = {
    token: verificationToken.token,
    to: user.email,
  };
  //encrypt data
  const ciphertext = encodeURIComponent(
    CryptoJS.AES.encrypt(JSON.stringify(data), config.forgetpwdkey).toString()
  );
  const url = `${req.get("origin")}/resetPwdVerify/${ciphertext}`;

  var html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h2>Forget Password</h2>
        Click on this link to verify your email <a href="${url}"> ${url} </a>
      </body>
    </html>`;

  sendEmail(user, "Forget Password", html);
  res.status(200).send({ message: `Email sent, Please verify your email.` });
};

exports.resetPwdVerify = (req, res) => {
  var bytes = CryptoJS.AES.decrypt(
    decodeURIComponent(req.body.verificationCode),
    config.forgetpwdkey
  );
  var data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

  User.findOne({
    where: {
      email: data.to,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      VerificationToken.findOne({
        where: {
          [Op.and]: [{ user_id: user.id }, { token: data.token }],
        },
      })
        .then((result) => {
          if (result) {
            res.status(200).send({
              id: user.id,
              email: user.email,
              token: result.token,
            });
          } else {
            return res.status(404).json(`Token expired`);
          }
        })
        .catch((reason) => {
          return res.status(404).json(`Token expired`);
        });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.resetPassword = (req, res) => {
  VerificationToken.findOne({
    where: {
      [Op.and]: [{ user_id: req.body.id }, { token: req.body.token }],
    },
  })
    .then((result) => {
      if (result) {
        User.update(
          { password: bcrypt.hashSync(req.body.password, 8) },
          { where: { id: result.user_id } }
        ).then((num) => {
          VerificationToken.update(
            { token: "" },
            { where: { user_id: result.user_id } }
          );
          return res.status(200).send({ message: `Reset Password Success` });
        });
      } else {
        return res.status(404).json(`Token expired`);
      }
    })
    .catch((reason) => {
      return res.status(404).json(`Token expired`);
    });
};

exports.updatePassword = (req, res) => {
  User.update(
    { password: bcrypt.hashSync(req.body.password, 8) },
    { where: { id: req.body.id } }
  ).then((num) => {
    VerificationToken.update(
      { token: "" },
      { where: { user_id: req.body.id } }
    );
    return res.status(200).send({ message: `Reset Password Success` });
  });
};

exports.updateProfile = async (req, res) => {
  const user = await User.findOne({ where: { id: req.userId } });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  var passwordIsValid = bcrypt.compareSync(
    req.body.old_password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  User.update(
    {
      password: bcrypt.hashSync(req.body.new_password, 8),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      country: req.body.country,
      phone_number: req.body.phone_number,
    },
    { where: { id: req.userId } }
  )
    .then((user) => {
      res.status(200).send({ message: `Profile is updated successfully!` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProfile1 = async (req, res) => {
  const user = await User.findOne({ where: { id: req.userId } });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  var passwordIsValid = bcrypt.compareSync(
    req.body.old_password,
    user.password
  );

  if (!passwordIsValid) {
    return res.status(401).send({
      accessToken: null,
      message: "Invalid Password!",
    });
  }

  User.update(
    {
      password: bcrypt.hashSync(req.body.new_password, 8),
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      country: req.body.country,
      phone_number: req.body.phone_number,
    },
    { where: { id: req.userId } }
  )
    .then((user) => {
      res.status(200).send({ message: `Profile is updated successfully!` });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateProfile2 = async (req, res) => {
  const user = await User.findOne({ where: { id: req.userId } });

  if (!user) {
    return res.status(404).send({ message: "User Not found." });
  }

  Sequelize.query(`
  UPDATE public."Users"
  SET first_name='${req.body.first_name}',
  last_name='${req.body.last_name}',
  country='${req.body.country}',
  phone_number='${req.body.phone_number}',
  user_image='${req.body.logo}'
  WHERE id = ${req.userId}
  `);

  const user1 = await User.findOne({ where: { id: req.userId } });

  sendSigninSuccessInfo(res, user1);
};
