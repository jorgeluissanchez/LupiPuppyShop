const store = require("./store");
const { config } = require("../../config");

function addProduct(name, description, category, price, image) {
  if (!name) {
    return Promise.reject("Invalid name");
  } else if (!description) {
    return Promise.reject("Invalid description");
  } else if (!category) {
    return Promise.reject("Invalid category");
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
    const product = {
      name: name,
      description: description,
      category: category,
      price: price,
      image: fileUrl,
    };

    return store.add(product);
  }
}

function listProduct(id) {
  return store.listID(id);
}
async function updateProduct(_id, body) {
  let { name, description, category, price, image, isAvailable } = body;
  await store
    .listID(_id)
    .then((product) => {
      if (name === undefined) {
        name = product.name;
      }
      if (description === undefined) {
        description = product.description;
      }
      if (category === undefined) {
        category = product.category;
      }
      if (price === undefined) {
        price = product.price;
      }
      if (isAvailable === undefined) {
        isAvailable = product.isAvailable;
      }
      let fileUrl = "";
      if (image === undefined) {
        fileUrl = product.image;
      }
      if (image !== undefined) {
        fileUrl = `${config.host}:${
          config.port + config.public_route + config.fileRoute
        }/${image.filename}`;
      }
      const productUpdate = {
        name: name,
        description: description,
        category: category,
        price: price,
        image: fileUrl,
        isAvailable: isAvailable,
      };
      return store.update(_id, productUpdate);
    })
    .catch((err) => {
      return err;
    });
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
  updateProduct,
  listProducts,
  deleteProduct,
};
