const express = require("express");
const multer = require("multer");

const response = require("../../network/response");
const controller = require("./controller");
const { config } = require("../../config");
const router = express.Router();
const roles = require("../../config/roles_list");
const verifyRoles = require("../../network/middleware/verifyRoles");

const upload = multer({
  dest: `public${config.fileRoute}`,
});

router.post(
  "/",
  verifyRoles(roles.Editor, roles.Admin),
  upload.single("image"),
  (req, res) => {
    controller
      .addProduct(
        req.body.name,
        req.body.description,
        req.body.category,
        req.body.price,
        req.file
      )
      .then((data) => {
        response.success(req, res, data, 201);
      })
      .catch((err) => {
        response.error(req, res, "Internal error", 500, err);
      });
  }
);

router.get("/", verifyRoles(roles.User), (req, res) => {
  controller
    .listProducts()
    .then((product) => {
      response.success(req, res, product, 200);
    })
    .catch((err) => {
      response.error(req, res, "Internal error", 500, err);
    });
});

router.get("/:id", verifyRoles(roles.User), (req, res) => {
  controller
    .listProduct(req.params.id)
    .then((product) => {
      response.success(req, res, product, 200);
    })
    .catch((err) => {
      response.error(req, res, "Internal error", 500, err);
    });
});
router.put("/:id", verifyRoles(roles.User), (req, res) => {
  controller
    .updateProduct(req.params.id, req.body)
    .then(() => {
      response.success(
        req,
        res,
        `Product ${req.params.id} has been update`,
        200
      );
    })
    .catch((err) => {
      response.error(req, res, "Internal error", 500, err);
    });
});
router.delete("/:id", verifyRoles(roles.Admin, roles.Editor), (req, res) => {
  controller
    .deleteProduct(req.params.id)
    .then(() => {
      response.success(
        req,
        res,
        `Product ${req.params.id} has been deleted`,
        200
      );
    })
    .catch((err) => {
      response.success(req, res, "Internal error", 500, err);
    });
});

module.exports = router;
