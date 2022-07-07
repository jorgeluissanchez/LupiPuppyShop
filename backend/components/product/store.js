const Model = require("./model");

function addProduct(Product) {
  const myUser = new Model(Product);
  return myUser.save();
}

async function listProduct(id) {
  const user = await Model.findById(id);
  return user;
}

function listProducts() {
  return Model.find();
}

function removeProduct(id) {
  return Model.deleteOne({
    _id: id,
  });
}

module.exports = {
  add: addProduct,
  list: listProducts,
  listID: listProduct,
  remove: removeProduct,
};
