const Health = require('../models/Health');

const getTodayDateString = () => new Date().toISOString().split('T')[0];

exports.getHealthData = async (req, res) => {
  try {
    const today = getTodayDateString();
    let health = await Health.findOne({ date: today });
    if (!health) {
      health = await Health.create({
        date: today,
        water: 1750,
        waterGoal: 2500,
        steps: 7420,
        stepsGoal: 10000,
        sleep: 7.8,
        sleepGoal: 8.0,
        calories: 1920,
        activeMinutes: 45,
      });
    }
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching health data', error: error.message });
  }
};

exports.updateHealth = async (req, res) => {
  try {
    const today = getTodayDateString();
    let health = await Health.findOne({ date: today });
    if (!health) {
      health = new Health({ date: today, ...req.body });
    } else {
      Object.assign(health, req.body);
    }
    await health.save();
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: 'Error updating health data', error: error.message });
  }
};

exports.addSteps = async (req, res) => {
  try {
    const { steps } = req.body;
    const today = getTodayDateString();
    let health = await Health.findOne({ date: today });
    const stepCount = parseInt(steps, 10) || 500;
    if (!health) {
      health = new Health({
        date: today,
        steps: Math.max(0, stepCount),
        calories: Math.round(stepCount * 0.04),
      });
    } else {
      health.steps = Math.max(0, (health.steps || 0) + stepCount);
      health.calories = Math.round((health.steps || 0) * 0.04);
    }
    await health.save();
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: 'Error logging steps', error: error.message });
  }
};

exports.addWater = async (req, res) => {
  try {
    const { amount } = req.body;
    const today = getTodayDateString();
    let health = await Health.findOne({ date: today });
    if (!health) {
      health = new Health({ date: today, water: Math.max(0, amount || 250) });
    } else {
      health.water = Math.max(0, health.water + (amount || 250));
    }
    await health.save();
    res.json(health);
  } catch (error) {
    res.status(500).json({ message: 'Error logging water', error: error.message });
  }
};
