const express = require("express");
const { insertUser, getUserByEmail } = require("../models/user/UserModel");
const {
  getHashedPassword,
  comparePassword,
} = require("../helpers/bcryptHelper");
const { json } = require("express");
const router = express.Router();

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
  console.log(result);

  res.send({ status: "success", message: "Login Successful!" });
});

module.exports = router;
