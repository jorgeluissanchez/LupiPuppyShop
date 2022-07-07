const mongoose = require("mongoose");
const { config } = require("../../config");

const Schema = mongoose.Schema;

const mySchema = new Schema(
  {
    fullName: String,
    email: String,
    roles: {
      user: { type: Number, default: config.roles.User },
      editor: Number,
      admin: Number,
    },
    password: String,
    refreshToken: [String],
    date: String,
  },
  { versionKey: false }
);

const model = mongoose.model("User", mySchema);
module.exports = model;
