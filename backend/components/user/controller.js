const { register, login, list, listID, remove, update } = require("./store");
const { config } = require("../../config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const Model = require("./model");

const schemaResgister = Joi.object({
  fullName: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});
const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const resgisterUser = (fullName, email, password) => {
  return new Promise(async (resolve, reject) => {
    const { error } = schemaResgister.validate({
      fullName: fullName,
      email: email,
      password: password,
    });
    if (!error) {
      const findUser = await Model.findOne({ email: email }).exec();
      if (findUser == null) {
        const salt = await bcrypt.genSalt(10);
        const passw = await bcrypt.hash(password, salt);
        user = {
          fullName: fullName,
          email: email,
          password: passw,
        };
        return resolve(register(user));
      } else {
        reject("El email ya existe");
      }
    } else {
      reject(error.details);
    }
  });
};

const loginUser = (email, password, cookies, res) => {
  return new Promise(async (resolve, reject) => {
    const { error } = schemaLogin.validate({
      email: email,
      password: password,
    });

    if (!error) {
      const findUser = await Model.findOne({ email: email });
      if (!findUser) {
        return reject("email is not exist");
      } else {
        const validPassword = await bcrypt.compare(password, findUser.password);
        if (!validPassword) {
          return reject("password is not valid");
        } else {
          const roles = Object.values(findUser.roles).filter(Boolean);
          const access_token = jwt.sign(
            {
              roles: roles,
              id: findUser._id,
            },
            config.authJwtSecret,
            { expiresIn: "1h" }
          );
          const newRefreshToken = jwt.sign(
            {
              roles: roles,
              id: findUser._id,
            },
            config.refreshJwtSecret,
            { expiresIn: "2h" }
          );

          let newRefreshTokenArray = !cookies.jwt
            ? findUser.refreshToken
            : findUser.refreshToken.filter((token) => token !== cookies.jwt);

          if (cookies.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await Model.findOne({
              refreshToken: refreshToken,
            });
            if (!foundToken) {
              newRefreshTokenArray.push(newRefreshToken);
            }
            res.clearCookie("jwt", {
              httpOnly: true,
              sameSite: "None",
              secure: true,
            });
          }

          findUser.refreshToken = [newRefreshToken];
          const response = await findUser.save();
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });
          resolve({ access_token });
        }
      }
    }
  });
};

const listUser = (access_token) => {
  return new Promise((resolve, reject) => {
    if (access_token) {
      const decoded = jwt.verify(access_token, config.authJwtSecret);
      return resolve(list(decoded));
    } else {
      return resolve(list());
    }
  });
};

const logout = async (cookies, res) => {
  return new Promise(async (resolve, reject) => {
    const refreshToken = cookies.jwt;
    if (!refreshToken) return reject("No hay un token de refresh");

    // Is refreshToken in db?
    const foundUser = await Model.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
      return reject("Token de refresh invalido");
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(
      (token) => token !== refreshToken
    );
    const result = await foundUser.save();

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return resolve("Logout correcto");
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject("Id invalido");
      return false;
    }

    remove(id)
      .then(() => {
        resolve();
      })
      .catch((e) => {
        reject(e);
      });
  });
};
async function updateUser(_id, body) {
  let { fullName, email, password, isAvailable, roles } = body;
  await listID(_id)
    .then((user) => {
      if (fullName === undefined) {
        fullName = user.fullName;
      }
      if (email === undefined) {
        email = user.email;
      }
      if (password === undefined) {
        password = user.password;
      }
      if (isAvailable === undefined) {
        isAvailable = user.isAvailable;
      }
      if (roles === undefined) {
        roles = user.roles;
      }
      const userUpdate = {
        fullName,
        email,
        password,
        isAvailable,
        roles,
      };
      return update(_id, userUpdate);
    })
    .catch((err) => {
      return err;
    });
}

module.exports = {
  resgisterUser,
  logout,
  loginUser,
  updateUser,
  listUser,
  deleteUser,
};
