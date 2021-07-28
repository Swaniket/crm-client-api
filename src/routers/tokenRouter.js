const express = require("express");
const router = express.Router();
const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwtHelper");
const { getUserByEmail } = require("../models/user/UserModel");

// Return refreshed access JWT
router.get("/", async (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "").trim();

  // 1. Make sure that the token is valid
  const decoded = await verifyRefreshJWT(token);
  if (decoded.email) {
    // 2. Check if the JWT exist in database
    const userProfile = await getUserByEmail(decoded.email);
    if (userProfile._id) {
      // Check if it's not expired
      let tokenWillExpire = userProfile.refreshJWT.addedAt;
      const dBrefreshToken = userProfile.refreshJWT.token;

      tokenWillExpire = tokenWillExpire.setDate(
        tokenWillExpire.getDate() +
          parseInt(process.env.JWT_REFRESH_SECRET_EXP_DAY)
      );
      const today = new Date();

      // Expired
      if (dBrefreshToken !== token && tokenWillExpire < today) {
        return res.status(403).send({ message: "Forbidden" });
      }

      const accessJWT = await createAccessJWT(
        decoded.email.toString(),
        userProfile._id.toString()
      );

      // Delete old token from Redis db

      return res.send({ status: "success", accessJWT });
    }
  }

  res.status(403).send({ message: "Forbidden" });
});

module.exports = router;
