const express = require("express");
const app = express();

const cors = require("cors");
const corsOptions = require("./config/corsOptions");

const bodyParser = require("body-parser");
const db = require("./config/db");
const router = require("./network/routes");
const { config } = require("./config");
const cookieParser = require("cookie-parser");
const credentials = require("./network/middleware/credentials");

db();

app.use(cors(corsOptions));
app.use(credentials);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

router(app);
app.use(config.public_route, express.static("public"));

app.listen(5000, () => {
  console.log(`Server running on port ${config.port}`);
});
