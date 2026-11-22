const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'Vidhi',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tagline: {
      type: String,
      default: 'Wellness & Growth Seeker',
    },
    avatar: {
      type: String,
      default: '🌸',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
