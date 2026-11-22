export const notificationService = {
  async requestPermission() {
    console.log('Requesting notification permissions...');
    return true;
  },

  async scheduleNotification({ title, body, triggerTime }) {
    console.log('Scheduling notification:', { title, body, triggerTime });
    return { id: String(Date.now()), title, body };
  },

  async cancelNotification(id) {
    console.log('Canceling notification:', id);
    return true;
  },
};

export default notificationService;
