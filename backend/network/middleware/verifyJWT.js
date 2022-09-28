const jwt = require("jsonwebtoken");
const { error } = require("../response");
const { config } = require("../../config");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer "))
    return error(req, res, "Unauthorized", 401, "authHeader is invalid");
  const token = authHeader.split(" ")[1];
  jwt.verify(token, config.authJwtSecret, (err, decoded) => {
    if (err) return error(req, res, "Internal error", 403, err);
    req.roles = decoded.roles;
    next();
  });
};

module.exports = auth;
