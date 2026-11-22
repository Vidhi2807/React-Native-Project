export const locationService = {
  async requestPermission() {
    console.log('Requesting location permission...');
    return true;
  },

  async getCurrentLocation() {
    return {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 5,
      timestamp: Date.now(),
      address: 'San Francisco, CA',
    };
  },

  async getSavedPlaces() {
    return [
      { id: '1', title: 'Home', latitude: 37.7749, longitude: -122.4194 },
      { id: '2', title: 'Gym', latitude: 37.7833, longitude: -122.4167 },
      { id: '3', title: 'Office', latitude: 37.7891, longitude: -122.4014 },
    ];
  },
};

export default locationService;
