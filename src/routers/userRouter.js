const express = require("express");
const { insertUser } = require("../models/user/UserModel");
const { getHashedPassword } = require("../helpers/bcryptHelper");
const router = express.Router();

// router.all('/', (req, res, next) => {
//     res.json({ message: "Return from user router"})
// })

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

module.exports = router;
