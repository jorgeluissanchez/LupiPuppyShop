const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mySchema = new Schema(
  {
    name: String,
    description: String,
    category: String,
    isAvailable: {
      type: Boolean,
      default: true,
    },
    price: Number,
    image: String,
  },
  { versionKey: false, timestamps: true }
);

const model = mongoose.model("Product", mySchema);
module.exports = model;
