const { register, login, list, remove } = require("./store");
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
        const date = new Date();
        const salt = await bcrypt.genSalt(10);
        const passw = await bcrypt.hash(password, salt);
        user = {
          fullName: fullName,
          email: email,
          password: passw,
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
              UserInfo: {
                fullName: findUser.fullName,
                roles: roles,
              },
            },
            config.authJwtSecret,
            { expiresIn: "1h" }
          );
          const newRefreshToken = jwt.sign(
            {
              fullName: findUser.fullName,
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

          findUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          const response = await findUser.save();
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });
          resolve({ access_token, roles });
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

const refreshToken = (cookies, res) => {
  return new Promise(async (resolve, reject) => {
    const refreshToken = cookies.jwt;

    if (!refreshToken) return reject("No hay un token de refresh");
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    const foundToken = await Model.findOne({
      refreshToken: refreshToken,
    });

    if (!foundToken) {
      jwt.verify(
        refreshToken,
        config.refreshJwtSecret,
        async (err, decoded) => {
          if (err) return reject("Token de refresh invalido");
          const findUser = await Model.findOne({
            fullName: decoded.fullName,
          });
          findUser.refreshToken = [];
          const result = await findUser.save();
        }
      );
      return reject("Token de refresh invalido");
    }
    const newRefreshTokenArray = foundToken.refreshToken.filter(
      (token) => token !== refreshToken
    );

    jwt.verify(refreshToken, config.refreshJwtSecret, async (err, decoded) => {
      if (err) {
        foundToken.refreshToken = [...newRefreshTokenArray, refreshToken];
        const result = await foundToken.save();
      }
      const roles = Object.values(foundToken.roles).filter(Boolean);
      const access_token = jwt.sign(
        {
          UserInfo: {
            fullName: foundToken.fullName,
            roles: roles,
          },
        },
        config.authJwtSecret,
        { expiresIn: "1h" }
      );
      const newRefreshToken = jwt.sign(
        {
          fullName: foundToken.fullName,
        },
        config.refreshJwtSecret,
        { expiresIn: "2h" }
      );
      foundToken.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundToken.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      resolve({ access_token });
    });
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

module.exports = {
  resgisterUser,
  logout,
  loginUser,
  listUser,
  deleteUser,
  refreshToken,
};
