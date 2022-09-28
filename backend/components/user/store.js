const Model = require("./model");

const register = (user) => {
  const myToken = new Model(user);
  return myToken.save();
};

const login = (token) => {
  return token;
};

const list = () => {
  return Model.find();
};

const remove = (id) => {
  return Model.deleteOne({
    _id: id,
  });
};
const listID = async (id) => {
  const data = await Model.findById(id);
  return data;
};
const update = async (id, body) => {
  const product = await Model.findByIdAndUpdate(id, body);
  return product;
};

module.exports = {
  register: register,
  login: login,
  listID: listID,
  list: list,
  remove: remove,
  update: update,
};
