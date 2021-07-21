const express = require("express");
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../models/user/UserModel");
const { setPasswordResetPin } = require("../models/resetPin/ResetPinModel");
const {
  getHashedPassword,
  comparePassword,
} = require("../helpers/bcryptHelper");
const { json } = require("express");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwtHelper");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

// Get user profile
router.get("/", userAuth, async (req, res) => {
  const _id = req.userId;
  const userProfile = await getUserById(_id);
  res.send({ user: userProfile });
});

// Create user account
router.post("/", async (req, res) => {
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
    console.log(result);
    res.json({ message: "New User Created!", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
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
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);

  if (user && user._id) {
    const setPin = await setPasswordResetPin(email);
    return res.send(setPin);
  }

  res.send({
    status: "error",
    message: "If user exist, an email will be send with password rest PIN",
  });
});

module.exports = router;
