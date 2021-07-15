const { UserSchema } = require("./UserSchema");

const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  insertUser,
};
