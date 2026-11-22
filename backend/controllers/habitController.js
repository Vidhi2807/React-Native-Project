const Habit = require('../models/Habit');

exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching habits', error: error.message });
  }
};

exports.createHabit = async (req, res) => {
  try {
    const { title, frequency, color } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }
    const newHabit = await Habit.create({
      title,
      frequency: frequency || 'Daily',
      streak: 0,
      completed: false,
      color: color || '#6366F1',
    });
    res.status(201).json(newHabit);
  } catch (error) {
    res.status(500).json({ message: 'Error creating habit', error: error.message });
  }
};

exports.toggleHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findById(id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    habit.completed = !habit.completed;
    if (habit.completed) {
      habit.streak = (habit.streak || 0) + 1;
    } else {
      habit.streak = Math.max(0, (habit.streak || 1) - 1);
    }
    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling habit', error: error.message });
  }
};

exports.updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating habit', error: error.message });
  }
};

exports.deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Habit.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    res.json({ message: 'Habit deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting habit', error: error.message });
  }
};

