const express = require("express");
const {
  insertUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  storeUserRefreshJWT,
} = require("../models/user/UserModel");
const {
  setPasswordResetPin,
  getPasswordResetPin,
  deletePin,
} = require("../models/resetPin/ResetPinModel");
const {
  getHashedPassword,
  comparePassword,
} = require("../helpers/bcryptHelper");
const { emailProcessor } = require("../helpers/emailHelper");
const { deleteJWT } = require("../helpers/redisHelper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwtHelper");
const { userAuth } = require("../middlewares/auth");
const {
  resetPassReqValidation,
  updatePassReqValidation,
  newUserValidation,
} = require("../middlewares/validation");

const router = express.Router();
const verificationURL = "http://localhost:3000/verification/";

// Get user profile
router.get("/", userAuth, async (req, res) => {
  const _id = req.userId;
  const userProfile = await getUserById(_id);

  const { name, email } = userProfile;
  res.send({
    user: {
      _id,
      name,
      email,
    },
  });
});

// Create user account
router.post("/", newUserValidation, async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    const hashedPassword = await getHashedPassword(password);

    const user = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPassword,
    };

    const result = await insertUser(user);

    // Send Confirmation Email
    await emailProcessor({
      email,
      type: "new-user-confirmation",
      verificationLink: verificationURL + result._id,
    });

    res.json({ status: "success", message: "New User Created!", result });
  } catch (error) {
    let message =
      "Unable to create new user at this moment. Please try again or contact Admin!";
    if (error.message.includes("duplicate key error collection")) {
      message = "This email is already registered";
    }
    res.json({ status: "error", message });
  }
});

// User Sign in
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({ status: "error", message: "Invalid form submission!" });
  }

  // Get the user details from db
  const user = await getUserByEmail(email);
  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.send({ status: "error", message: "Invalid credentials" });

  const result = await comparePassword(password, passFromDb);

  if (!result) {
    return res.send({ status: "error", message: "Invalid credentials" });
  }

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

  res.send({
    status: "success",
    message: "Login Successful!",
    accessJWT,
    refreshJWT,
  });
});

// Reset Password-1: Email verify & PIN generation
router.post("/reset-password", resetPassReqValidation, async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setPasswordResetPin(email);
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password",
    });

    return res.send({
      status: "success",
      message: "If user exist, an email will be send with password rest PIN",
    });
  }

  res.send({
    status: "error",
    message: "If user exist, an email will be send with password rest PIN",
  });
});

// Reset Password-2: PIN Validate & Update in DB
router.patch("/reset-password", updatePassReqValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body;
  const getPin = await getPasswordResetPin(email, pin);

  // Validate Pin
  if (getPin._id) {
    const dbDate = getPin.addedAt;
    const expiresIn = 1;

    let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
    const today = new Date();

    if (today > expDate) {
      return res.send({ status: "error", message: "Invalid or Expired PIN" });
    }

    // Encrypt the new password
    const hashedPassword = await getHashedPassword(newPassword);
    const user = await updatePassword(email, hashedPassword);

    if (user._id) {
      // Send email notification
      await emailProcessor({ email, type: "password-update-success" });

      // Delete the PIN from the DB
      deletePin(email, pin);

      return res.send({
        status: "success",
        message: "Password has been updated!",
      });
    }
  }
  res.send({
    status: "error",
    message: "Unable to update the password, please try again later",
  });
});

// User Logout via invalidate JWTs
router.delete("/logout", userAuth, async (req, res) => {
  const authToken = req.header("Authorization").replace("Bearer ", "").trim();

  // Getting the userID from auth middleware
  const _id = req.userId;
  // Delete the accessJWT from redis DB
  deleteJWT(authToken);
  // Delete refreshJWT from mongoDB
  const result = await storeUserRefreshJWT(_id, "");

  if (result._id) {
    return res.send({
      status: "success",
      message: "User Successfully Logged Out!",
    });
  }

  res.send({
    status: "error",
    message: "Unable to logout at this moment, please try again later",
  });
});

module.exports = router;
