const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

router.get('/', healthController.getHealthData);
router.put('/', healthController.updateHealth);
router.post('/water', healthController.addWater);
router.post('/steps', healthController.addSteps);

module.exports = router;
