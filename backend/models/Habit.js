const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    frequency: {
      type: String,
      default: 'Daily',
    },
    streak: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: '#6366F1',
    },
    history: [
      {
        date: String,
        completed: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Habit', habitSchema);
