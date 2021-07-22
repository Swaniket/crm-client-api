const Joi = require("joi");

const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net", "in", "email"] },
});

const pin = Joi.string().min(6).max(6).required();

const newPassword = Joi.string().min(3).max(30).required();

const resetPassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.send({ status: "error", message: value.error.message });
  }

  next();
};

const updatePassReqValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

module.exports = { resetPassReqValidation, updatePassReqValidation };
