const { verifyAccessJWT } = require("../helpers/jwtHelper");
const { getJWT, deleteJWT } = require("../helpers/redisHelper");

const userAuth = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return res.status(403).send({ message: "Forbidded" });
  }
  
  const token = req.header("Authorization").replace("Bearer ", "");

  // Verify if JWT is valid, get user id from redis
  const decoded = await verifyAccessJWT(token.trim());
  if (decoded.email) {
    const userId = await getJWT(token.trim());
    if (!userId) {
      return res.status(403).send({ message: "Forbidded" });
    }
    req.userId = userId;
    return next();
  }

  deleteJWT(token);

  res.status(403).send({ message: "Forbidded" });
};

module.exports = {
  userAuth,
};
