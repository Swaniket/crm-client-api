const { ResetPinSchema } = require("./ResetPinSchema");
const { randomPin } = require("../../utils/randomPinGenerator");

const setPasswordResetPin = async (email) => {
  // Generate 6 digit PIN
  const pinLength = 6;
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

const getPasswordResetPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }
        resolve(data);
      });
    } catch (e) {
      reject(e);
      console.log(e);
    }
  });
};

const deletePin = (email, pin) => {
  try {
    ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.log(error);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setPasswordResetPin,
  getPasswordResetPin,
  deletePin,
};
