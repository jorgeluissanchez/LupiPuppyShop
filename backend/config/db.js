const db = require("mongoose");
const { config } = require("./index");

db.Promise = global.Promise;

async function connect() {
  await db.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("[db] Conectada con éxito");
}

module.exports = connect;
