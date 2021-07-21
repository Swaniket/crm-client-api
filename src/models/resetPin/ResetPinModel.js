const { ResetPinSchema } = require("./ResetPinSchema");
const {randomPin} = require("../../utils/randomPinGenerator")

const setPasswordResetPin = async (email) => {
  // Generate 6 digit PIN
  const pinLength = 6
  const randPin = await randomPin(pinLength);

  const resetObj = {
    email,
    pin: randPin,
  };

  return new Promise((resolve, reject) => {
    ResetPinSchema(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
};

module.exports = {
  setPasswordResetPin,
};
