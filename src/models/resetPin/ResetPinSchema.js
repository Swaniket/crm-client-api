const mongoose = require("mongoose");

const ResetPinSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    maxlegth: 100,
    lowercase: true,
  },
  pin: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlegth: 6,
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

module.exports = {
  ResetPinSchema: mongoose.model("Reset_pin", ResetPinSchema),
};
