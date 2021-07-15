const bcrypt = require("bcrypt");
const saltRounds = 10;

const getHashedPassword = (plainPassword) => {
  return new Promise((resolve) => {
    resolve(bcrypt.hashSync(plainPassword, saltRounds));
  });
};

const comparePassword = (plainPassword, passFromDb) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainPassword, passFromDb, function (err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = {
  getHashedPassword,
  comparePassword,
};
