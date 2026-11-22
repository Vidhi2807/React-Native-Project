const Routine = require('../models/Routine');

exports.getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find().sort({ createdAt: 1 });
    res.json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching daily rituals', error: error.message });
  }
};

exports.createRoutine = async (req, res) => {
  try {
    const { title, time, period } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const newRoutine = await Routine.create({
      title,
      time: time || '07:30 AM',
      period: period || 'Morning',
      completed: false,
    });
    res.status(201).json(newRoutine);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ritual', error: error.message });
  }
};

exports.toggleRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const routine = await Routine.findById(id);
    if (!routine) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    routine.completed = !routine.completed;
    await routine.save();
    res.json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling ritual', error: error.message });
  }
};

exports.deleteRoutine = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Routine.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Routine not found' });
    }
    res.json({ message: 'Routine deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting routine', error: error.message });
  }
};
