const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://react-native-project-sbop.onrender.com/api';

export const config = {
  appName: 'Daily Life & Wellness Tracker',
  version: '1.0.0',
  apiBaseUrl: API_BASE_URL,
  storageKeys: {
    theme: '@theme_mode',
    tasks: '@tasks_data',
    habits: '@habits_data',
    health: '@health_data',
    mood: '@mood_data',
    journal: '@journal_data',
    routines: '@routines_data',
    user: '@user_profile',
    onboarding: '@has_onboarded',
  },
  waterDefaultGoal: 2500, // in ml
  stepsDefaultGoal: 10000,
  sleepDefaultGoal: 8, // in hours
};

export default config;
