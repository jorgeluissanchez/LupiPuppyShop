const { error } = require("../response");

const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) return error(req, res, "Unauthorized", 401);
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);
    if (!result) return error(req, res, "Unauthorized", 401);
    next();
  };
};

module.exports = verifyRoles;
