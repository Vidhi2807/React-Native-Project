const Place = require('../models/Place');

exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    if (places.length === 0) {
      return res.json([
        { id: '1', title: 'Home Sanctuary', latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' },
        { id: '2', title: 'Equinox Fitness Studio', latitude: 37.7833, longitude: -122.4167, address: 'Market St, SF' },
        { id: '3', title: 'Zen Meditation Center', latitude: 37.7891, longitude: -122.4014, address: 'Downtown SF' },
      ]);
    }
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching saved places', error: error.message });
  }
};

exports.createPlace = async (req, res) => {
  try {
    const { title, latitude, longitude, address } = req.body;
    if (!title || latitude == null || longitude == null) {
      return res.status(400).json({ message: 'Title and coordinates are required' });
    }
    const newPlace = await Place.create({
      title,
      latitude,
      longitude,
      address: address || '',
    });
    res.status(201).json(newPlace);
  } catch (error) {
    res.status(500).json({ message: 'Error saving place', error: error.message });
  }
};

exports.deletePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Place.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json({ message: 'Place deleted successfully', id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting place', error: error.message });
  }
};


