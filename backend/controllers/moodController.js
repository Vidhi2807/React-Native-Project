const Mood = require('../models/Mood');

exports.getMoods = async (req, res) => {
  try {
    const moods = await Mood.find().sort({ createdAt: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching mood entries', error: error.message });
  }
};

exports.logMood = async (req, res) => {
  try {
    const { mood, emoji, note } = req.body;
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    const newMood = await Mood.create({
      mood,
      emoji: emoji || '✨',
      note: note || '',
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
    res.status(201).json(newMood);
  } catch (error) {
    res.status(500).json({ message: 'Error logging mood', error: error.message });
  }
};
