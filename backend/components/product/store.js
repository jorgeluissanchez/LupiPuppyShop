const Model = require("./model");

const addProduct = (Product) => {
  const data = new Model(Product);
  return data.save();
};

const listProduct = async (id) => {
  const data = await Model.findById(id);
  return data;
};

const listProducts = () => {
  return Model.find();
};

const removeProduct = (id) => {
  return Model.deleteOne({
    _id: id,
  });
};
const updateProduct = async (id, body) => {
  const product = await Model.findByIdAndUpdate(id, body);
  return product;
};

module.exports = {
  add: addProduct,
  list: listProducts,
  listID: listProduct,
  remove: removeProduct,
  update: updateProduct,
};
