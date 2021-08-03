const Joi = require("joi");

// Constrains
const email = Joi.string().email({
  minDomainSegments: 2,
  tlds: { allow: ["com", "net", "in", "email"] },
});
const pin = Joi.string().min(6).max(6).required();
const newPassword = Joi.string().min(3).max(30).required();

const shortStr = Joi.string().min(2).max(100);
const longStr = Joi.string().min(2).max(1000);
const dt = Joi.date();

// Validation Functions
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

const createNewTicketValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortStr.required(),
    issueDate: dt.required(),
    message: longStr.required(),
    sender: shortStr.required(),
  });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

const replyMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    message: longStr.required(),
    sender: shortStr.required(),
  });

  const value = schema.validate(req.body);
  if (value.error) {
    return res.json({ status: "error", message: value.error.message });
  }
  next();
};

module.exports = {
  resetPassReqValidation,
  updatePassReqValidation,
  createNewTicketValidation,
  replyMessageValidation,
};
