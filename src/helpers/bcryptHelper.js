const bcrypt = require("bcrypt");
const saltRounds = 10;

const getHashedPassword = (plainPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPassword, saltRounds));
  });
};

module.exports = {
  getHashedPassword,
};
