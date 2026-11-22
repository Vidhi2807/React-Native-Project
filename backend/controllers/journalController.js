const Journal = require('../models/Journal');

exports.getJournals = async (req, res) => {
  try {
    const entries = await Journal.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching journal reflections', error: error.message });
  }
};

exports.createJournal = async (req, res) => {
  try {
    const { title, content, tag, mood } = req.body;
    if (!title && !content) {
      return res.status(400).json({ message: 'Title or content required' });
    }
    const newEntry = await Journal.create({
      title: title || 'Untitled Reflection',
      content: content || '',
      tag: tag || 'Gratitude',
      mood: mood || 'Great',
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    });
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: 'Error creating journal reflection', error: error.message });
  }
};

exports.deleteJournal = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Journal.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }
    res.json({ message: 'Journal deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting journal entry', error: error.message });
  }
};
