const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');
const Habit = require('./models/Habit');
const Routine = require('./models/Routine');
const Journal = require('./models/Journal');
const Health = require('./models/Health');
const Place = require('./models/Place');
const Mood = require('./models/Mood');

const initialTasks = [
  { title: 'Morning 20-min yoga session', category: 'Health', priority: 'High', completed: true, time: '07:30 AM' },
  { title: 'Review React Native architecture doc', category: 'Work', priority: 'Medium', completed: false, time: '11:00 AM' },
  { title: 'Read 20 pages of "Atomic Habits"', category: 'Study', priority: 'Low', completed: false, time: '08:30 PM' },
];

const initialHabits = [
  { title: 'Hydration (2.5L daily)', frequency: 'Daily', streak: 12, completed: true, color: '#06B6D4' },
  { title: '10,000 Daily Steps', frequency: 'Daily', streak: 8, completed: false, color: '#6366F1' },
  { title: 'Evening Reflection & Journal', frequency: 'Daily', streak: 19, completed: true, color: '#EC4899' },
  { title: 'Deep Work (2 Hours)', frequency: 'Weekdays', streak: 5, completed: false, color: '#8B5CF6' },
];

const initialRoutines = [
  { title: 'Drink warm water with lemon', time: '07:00 AM', completed: true, period: 'Morning' },
  { title: '10-minute stretch & breathwork', time: '07:20 AM', completed: true, period: 'Morning' },
  { title: 'Set Top 3 Priorities for the day', time: '08:00 AM', completed: true, period: 'Morning' },
  { title: 'Screen disconnect & chamomile tea', time: '10:00 PM', completed: false, period: 'Evening' },
  { title: '15 mins reading before sleep', time: '10:30 PM', completed: false, period: 'Evening' },
];

const initialJournals = [
  {
    title: 'Grateful for Small Wins ✨',
    content: 'Had a productive coding session this morning. Finished the new mobile app UI design and felt super energized. Grateful for peace and clarity today.',
    tag: 'Gratitude',
    mood: 'Great',
    date: 'Today, 09:15 AM',
  },
  {
    title: 'Mindful Evening Thoughts',
    content: 'Took a peaceful evening walk around the lake. The sunset was vibrant violet and gold. Setting gentle intentions for tomorrow.',
    tag: 'Reflections',
    mood: 'Calm',
    date: 'Yesterday, 07:45 PM',
  },
];

const initialPlaces = [
  { title: 'Home Sanctuary', latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' },
  { title: 'Equinox Fitness Studio', latitude: 37.7833, longitude: -122.4167, address: 'Market St, SF' },
  { title: 'Zen Meditation Center', latitude: 37.7891, longitude: -122.4014, address: 'Downtown SF' },
];

async function seedDatabase() {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Seed User
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({
        name: 'Vidhi',
        email: 'vidhi@example.com',
        password: 'wellness_password_2026',
        tagline: 'Wellness & Growth Seeker',
        avatar: '🌸',
      });
      console.log('✅ Seeded User profile');
    }

    // Seed Tasks
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      await Task.insertMany(initialTasks);
      console.log('✅ Seeded initial tasks');
    }

    // Seed Habits
    const habitCount = await Habit.countDocuments();
    if (habitCount === 0) {
      await Habit.insertMany(initialHabits);
      console.log('✅ Seeded initial habits');
    }

    // Seed Routines
    const routineCount = await Routine.countDocuments();
    if (routineCount === 0) {
      await Routine.insertMany(initialRoutines);
      console.log('✅ Seeded initial rituals/routines');
    }

    // Seed Journals
    const journalCount = await Journal.countDocuments();
    if (journalCount === 0) {
      await Journal.insertMany(initialJournals);
      console.log('✅ Seeded initial journals');
    }

    // Seed Places
    const placeCount = await Place.countDocuments();
    if (placeCount === 0) {
      await Place.insertMany(initialPlaces);
      console.log('✅ Seeded initial places');
    }

    // Seed Health
    let healthRecord = await Health.findOne({ date: today });
    if (!healthRecord) {
      await Health.create({
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
      console.log('✅ Seeded initial health metrics');
    }

    // Seed Mood
    const moodCount = await Mood.countDocuments();
    if (moodCount === 0) {
      await Mood.create({
        mood: 'Great',
        emoji: '✨',
        note: 'Feeling energised and ready to achieve goals!',
        date: new Date().toISOString(),
      });
      console.log('✅ Seeded initial mood entry');
    }

    console.log('🌱 MongoDB Database is fully synced & ready!');
  } catch (error) {
    console.error('⚠️ Seeding error:', error.message);
  }
}

// Allow direct execution
if (require.main === module) {
  require('dotenv').config();
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wellness_hub_db';
  mongoose
    .connect(MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB for seeding...');
      await seedDatabase();
      process.exit(0);
    })
    .catch((err) => {
      console.error('MongoDB connection error during seeding:', err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
