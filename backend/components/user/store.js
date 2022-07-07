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

module.exports = {
  register: register,
  login: login,
  list: list,
  remove: remove,
};
