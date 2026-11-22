const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    mood: {
      type: String,
      required: true,
      default: 'Great',
    },
    emoji: {
      type: String,
      default: '✨',
    },
    note: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Mood', moodSchema);
