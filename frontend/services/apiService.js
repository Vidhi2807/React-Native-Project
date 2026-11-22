import { config } from '../constants/config';

const BASE_URL = config.apiBaseUrl || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP error! status: ${response.status}`;
      console.log(`API response error [${endpoint}]:`, errorMsg);
      return { error: errorMsg, status: response.status };
    }
    return data;
  } catch (error) {
    // Return null on offline/connection failure so local state falls back seamlessly
    console.log(`Backend API sync [${endpoint}]:`, error.message);
    return null;
  }
}

export const apiService = {
  // Auth & Profile
  async login(email, password) {
    return await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(name, email, password) {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  async getProfile() {
    return await request('/auth/profile');
  },

  async updateProfile(userData) {
    return await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Tasks
  async getTasks() {
    return await request('/tasks');
  },

  async createTask(task) {
    return await request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  async updateTask(id, taskData) {
    return await request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  async toggleTask(id) {
    return await request(`/tasks/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteTask(id) {
    return await request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Habits
  async getHabits() {
    return await request('/habits');
  },

  async createHabit(habit) {
    return await request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  },

  async updateHabit(id, habitData) {
    return await request(`/habits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(habitData),
    });
  },

  async toggleHabit(id) {
    return await request(`/habits/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteHabit(id) {
    return await request(`/habits/${id}`, {
      method: 'DELETE',
    });
  },

  // Health
  async getHealth() {
    return await request('/health');
  },

  async updateHealth(healthData) {
    return await request('/health', {
      method: 'PUT',
      body: JSON.stringify(healthData),
    });
  },

  async addWater(amount) {
    return await request('/health/water', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  async addSteps(steps) {
    return await request('/health/steps', {
      method: 'POST',
      body: JSON.stringify({ steps }),
    });
  },

  // Mood
  async getMoods() {
    return await request('/mood');
  },

  async logMood(moodData) {
    return await request('/mood', {
      method: 'POST',
      body: JSON.stringify(moodData),
    });
  },

  // Journals
  async getJournals() {
    return await request('/journals');
  },

  async createJournal(journal) {
    return await request('/journals', {
      method: 'POST',
      body: JSON.stringify(journal),
    });
  },

  async deleteJournal(id) {
    return await request(`/journals/${id}`, {
      method: 'DELETE',
    });
  },

  // Routines
  async getRoutines() {
    return await request('/routines');
  },

  async createRoutine(routine) {
    return await request('/routines', {
      method: 'POST',
      body: JSON.stringify(routine),
    });
  },

  async toggleRoutine(id) {
    return await request(`/routines/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  async deleteRoutine(id) {
    return await request(`/routines/${id}`, {
      method: 'DELETE',
    });
  },

  // Places
  async getPlaces() {
    return await request('/places');
  },

  async createPlace(place) {
    return await request('/places', {
      method: 'POST',
      body: JSON.stringify(place),
    });
  },

  async deletePlace(id) {
    return await request(`/places/${id}`, {
      method: 'DELETE',
    });
  },

  // Healthcheck
  async checkHealth() {
    return await request('/healthcheck');
  },
};

export default apiService;
