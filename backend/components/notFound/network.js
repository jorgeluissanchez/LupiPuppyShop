const path = require("path");
const { error } = require("../../network/response");

const notFound = (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "../../public", "NoFound.html"));
  } else if (req.accepts("json")) {
    error(req, res, "Not found", 404, "Not found");
  } else {
    res.type("txt").send("404 Not Found");
  }
};

module.exports = notFound;
