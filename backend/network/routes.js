const user = require("../components/user/network");

const verifyJWT = require("./middleware/verifyJWT");
const product = require("../components/product/network");
const notFound = require("../components/notFound/network");

const routes = (app) => {
  app.use("/api/user", user);
  app.use("/api/product", verifyJWT, product);
  app.all("/api/*", notFound);
};

module.exports = routes;
