const mongoose = require("mongoose");
const { config } = require("../../config");

const Schema = mongoose.Schema;

const mySchema = new Schema(
  {
    fullName: String,
    email: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    password: String,
    refreshToken: [String],
    roles: {
      user: { type: Number, default: config.roles.User },
      editor: Number,
      admin: Number,
    },
  },
  { versionKey: false, timestamps: true }
);

const model = mongoose.model("User", mySchema);
module.exports = model;
