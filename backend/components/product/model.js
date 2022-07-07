const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mySchema = new Schema(
  {
    name: String,
    description: String,
    category: String,
    stock: Number,
    price: Number,
    image: String,
    date: String,
  },
  { versionKey: false }
);

const model = mongoose.model("Product", mySchema);
module.exports = model;
