const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');

router.get('/', moodController.getMoods);
router.post('/', moodController.logMood);

module.exports = router;
