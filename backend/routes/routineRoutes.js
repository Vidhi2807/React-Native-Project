const express = require('express');
const router = express.Router();
const routineController = require('../controllers/routineController');

router.get('/', routineController.getRoutines);
router.post('/', routineController.createRoutine);
router.patch('/:id/toggle', routineController.toggleRoutine);
router.delete('/:id', routineController.deleteRoutine);

module.exports = router;
