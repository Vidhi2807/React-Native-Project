export const cameraService = {
  async requestPermission() {
    console.log('Requesting camera permission...');
    return true;
  },

  async takePhoto() {
    return {
      uri: 'https://via.placeholder.com/300',
      width: 300,
      height: 300,
    };
  },

  async pickImageFromGallery() {
    return {
      uri: 'https://via.placeholder.com/300',
      width: 300,
      height: 300,
    };
  },
};

export default cameraService;
