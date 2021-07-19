const jwt = require("jsonwebtoken");
const { setJWT, getJWT } = require("./redisHelper");
const { storeUserRefreshJWT } = require("../models/user/UserModel");

const createAccessJWT = async (email, _id) => {
  try {
    const accessJWT = await jwt.sign({ email }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1m",
    });
    await setJWT(accessJWT, _id);
    return Promise.resolve(accessJWT);
  } catch (e) {
    return Promise.reject(e);
  }
};

const createRefreshJWT = async (email, _id) => {
  try {
    const refreshJWT = jwt.sign({ email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });
    await storeUserRefreshJWT(_id, refreshJWT);
    return Promise.resolve(refreshJWT);
  } catch (e) {
    return Promise.resolve(e);
  }
};

const verifyAccessJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_ACCESS_SECRET));
  } catch (e) {
    return Promise.resolve(e);
  }
};

const verifyRefreshJWT = (userJWT) => {
  try {
    return Promise.resolve(jwt.verify(userJWT, process.env.JWT_REFRESH_SECRET));
  } catch (e) {
    return Promise.resolve(e);
  }
};

module.exports = {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
  verifyRefreshJWT,
};
