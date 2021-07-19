const redis = require("redis");
const client = redis.createClient(process.env.REDIS_URL);

client.on("error", function (error) {
  console.error(error);
});

const setJWT = (key, value) => {
  return new Promise((resolve, reject) => {
    try {
      client.set(key, value, (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getJWT = (key) => {
  return new Promise((resolve, reject) => {
    try {
      client.get(key, (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteJWT = (key) => {
  try {
    client.del(key);
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  setJWT,
  getJWT,
  deleteJWT,
};
