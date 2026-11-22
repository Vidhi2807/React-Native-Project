const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

router.get('/', placeController.getPlaces);
router.post('/', placeController.createPlace);
router.delete('/:id', placeController.deletePlace);

module.exports = router;

