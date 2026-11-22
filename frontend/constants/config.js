import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }

  // Detect Expo dev server IP dynamically for physical devices & Expo Go
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:5000/api`;
    }
  }

  // Android emulator fallback or LAN IP fallback
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://192.168.1.76:5000/api';
};

export const config = {
  appName: 'Daily Life & Wellness Tracker',
  version: '1.0.0',
  apiBaseUrl: getApiBaseUrl(),
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
