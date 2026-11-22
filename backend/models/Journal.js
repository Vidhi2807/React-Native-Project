const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema(
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
    content: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      default: 'Reflections',
    },
    mood: {
      type: String,
      default: 'Great',
    },
    date: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Journal', journalSchema);
