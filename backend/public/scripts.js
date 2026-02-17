var crypto = require("crypto");
const queries = require("../database/queries");
const jwt = require("jsonwebtoken");

exports.validPassword = (password, dbValue) => {
  const [dbHash, salt] = dbValue.split(":");
  var hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return dbHash === hash;
};

exports.genPassword = (password) => {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  const passwordhash = `${genHash}:${salt}`;
  return passwordhash;
};

exports.verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};
