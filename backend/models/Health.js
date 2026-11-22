const mongoose = require('mongoose');

const healthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    water: {
      type: Number,
      default: 0,
    },
    waterGoal: {
      type: Number,
      default: 2500,
    },
    steps: {
      type: Number,
      default: 0,
    },
    stepsGoal: {
      type: Number,
      default: 10000,
    },
    sleep: {
      type: Number,
      default: 0,
    },
    sleepGoal: {
      type: Number,
      default: 8.0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    activeMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Health', healthSchema);
