const bodyParser = require("body-parser");
const express = require("express");
const Users = require("../data/users");
const cookieParser = require('cookie-parser');
const VerifyToken = require('../middleware/token');

function AuthRouter() {
  let router = express.Router(); 
  router.use(require('cookie-parser')());
  router.use(bodyParser.json({ limit: "100mb" }));
  router.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  router.route("/register").post(function (req, res, next) {
    const body = req.body;
    const { role } = body;

    if (!role || !Array.isArray(role.scope) || role.scope.length === 0) {
      return res.status(400).send({ auth: false, message: 'Invalid role or scope' });
    }

    Users.create(body)
      .then((result) => {
        const userObj = result.user.toObject();
        return Users.createToken(userObj);
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((err) => {
        res.status(500).send(err);
        next();
      });
  });

  router.route("/login").post(function (req, res, next) {
    let body = req.body;

    return Users.findUser(body)
      .then((user) => {
        return Users.createToken(user);
      })
      .then((response) => {
        // The httpOnly: true setting means that the cookie can't be read using JavaScript but can still be sent back to the server in HTTP requests
        res.cookie("token", response.token, { httpOnly: true, secure: 'true', sameSite: 'none' });
        res.status(200);
        res.send(response);
      })
      .catch((err) => {
        console.log(err);
        res.status(500);
        res.send(err);
      });
  });

  router.use(cookieParser());
  router.use(VerifyToken);

  router.route("/logout").get(function (req, res, next) {
    res.cookie("token", response.token, { httpOnly: true, secure: 'true', sameSite: 'none' });
    res.status(200);
    res.send({ logout: true });
    next();
  });

  router.route("/me").get(function (req, res, next) {
    try {
      res.status(202).send({ auth: true, decoded: req.roleUser });
    } catch (err) {
      res.status(500).send(err);
      next();
    }
  });

  return router;
}

module.exports = AuthRouter;