const store = require("./store");
const { config } = require("../../config");

function addProduct(name, description, category, stock, price, image) {
  if (!name) {
    return Promise.reject("Invalid name");
  } else if (!description) {
    return Promise.reject("Invalid description");
  } else if (!category) {
    return Promise.reject("Invalid category");
  } else if (!stock) {
    return Promise.reject("Invalid stock");
  } else if (!price) {
    return Promise.reject("Invalid price");
  } else if (!image) {
    return Promise.reject("Invalid image");
  } else {
    let fileUrl = "";
    if (image) {
      fileUrl = `${config.host}:${
        config.port + config.public_route + config.fileRoute
      }/${image.filename}`;
    }

    const date = new Date();
    const product = {
      name: name,
      description: description,
      category: category,
      stock: stock,
      price: price,
      image: fileUrl,
      date:
        date.getDate() +
        "/" +
        (date.getMonth() + 1) +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds(),
    };

    return store.add(product);
  }
}

function listProduct(id) {
  return store.listID(id);
}

function listProducts() {
  return store.list();
}

function deleteProduct(id) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Id invalido");
      return false;
    }

    store
      .remove(id)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
}

module.exports = {
  addProduct,
  listProduct,
  listProducts,
  deleteProduct,
};
