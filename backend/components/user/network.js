const express = require("express");
const { success, error } = require("../../network/response");
const ROLES = require("../../config/roles_list");
const verifyRoles = require("../../network/middleware/verifyRoles");
const verifyJWT = require("../../network/middleware/verifyJWT");

const router = express.Router();
const {
  resgisterUser,
  loginUser,
  listUser,
  logout,
  updateUser,
  deleteUser,
} = require("./controller");

router.post("/register", (req, res) => {
  const { fullName, email, password } = req.body;

  resgisterUser(fullName, email, password)
    .then((data) => {
      success(req, res, data, 201);
    })
    .catch((err) => {
      error(req, res, "Internal error", 500, err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const cookies = req.cookies;
  loginUser(email, password, cookies, res)
    .then((data) => {
      success(req, res, data, 201);
    })
    .catch((err) => {
      error(req, res, "Internal error", 500, err);
    });
});
router.get("/logout", (req, res) => {
  const authHeader = req.cookies;
  console.log(authHeader);

  logout(authHeader, res)
    .then((data) => {
      success(req, res, data, 201);
    })
    .catch((err) => {
      error(req, res, "Internal error", 500, err);
    });
});

router.get("/", verifyJWT, verifyRoles(ROLES.Admin), (req, res) => {
  listUser()
    .then((data) => {
      success(req, res, data, 200);
    })
    .catch((err) => {
      error(req, res, "Internal error", 500, err);
    });
});
router.delete("/:id", verifyJWT, verifyRoles(ROLES.Admin), (req, res) => {
  const { id } = req.params;

  deleteUser(id)
    .then(() => {
      success(req, res, `User ${req.params.id} has been deleted`, 200);
    })
    .catch((err) => {
      success(req, res, "Internal error", 500, err);
    });
});

router.put("/:id", verifyJWT, verifyRoles(ROLES.Admin), (req, res) => {
  updateUser(req.params.id, req.body)
    .then(() => {
      success(req, res, `User ${req.params.id} has been update`, 200);
    })
    .catch((err) => {
      error(req, res, "Internal error", 500, err);
    });
});
module.exports = router;
