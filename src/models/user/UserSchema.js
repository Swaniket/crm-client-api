const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlegth: 60,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    maxlegth: 100,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    maxlegth: 100,
  },
  phone: {
    type: Number,
    maxlegth: 100,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    maxlegth: 100,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    maxlegth: 50,
  },
  refreshJWT: {
    token: {
      type: String,
      maxlegth: 500,
      default: "",
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  }
});

module.exports = {
  UserSchema: mongoose.model("User", UserSchema),
};
