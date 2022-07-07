const { config } = require("./index");

const ROLES_LIST = {
  Admin: config.roles.Admin,
  Editor: config.roles.Editor,
  User: config.roles.User,
};

module.exports = ROLES_LIST;
