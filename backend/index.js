const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Route Imports
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const habitRoutes = require('./routes/habitRoutes');
const healthRoutes = require('./routes/healthRoutes');
const moodRoutes = require('./routes/moodRoutes');
const journalRoutes = require('./routes/journalRoutes');
const routineRoutes = require('./routes/routineRoutes');
const placeRoutes = require('./routes/placeRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection & Seeder
const seedDatabase = require('./seeder');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wellness_hub_db';
mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(async () => {
    console.log('🍃 MongoDB connected successfully at:', MONGO_URI);
    await seedDatabase();
  })
  .catch((err) => console.log('⚠️ MongoDB connection issue:', err.message));

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/places', placeRoutes);

// Health Check Route
app.get('/api/healthcheck', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    message: 'Wellness Life API is up and running!',
  });
});

app.get('/', (req, res) => {
  res.send('Wellness Hub API is active. Connect with /api endpoints.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Wellness Hub Server running on http://localhost:${PORT}`);
});
