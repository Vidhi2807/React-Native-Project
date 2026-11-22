import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { apiService } from '../services/apiService';
import { config } from '../constants/config';

const AppContext = createContext();

const INITIAL_TASKS = [
  { id: '1', title: 'Morning 20-min yoga session', category: 'Health', priority: 'High', completed: true, time: '07:30 AM' },
  { id: '2', title: 'Review React Native architecture doc', category: 'Work', priority: 'Medium', completed: false, time: '11:00 AM' },
  { id: '3', title: 'Read 20 pages of "Atomic Habits"', category: 'Study', priority: 'Low', completed: false, time: '08:30 PM' },
];

const INITIAL_HABITS = [
  { id: '1', title: 'Hydration (2.5L daily)', frequency: 'Daily', streak: 12, completed: true, color: '#06B6D4' },
  { id: '2', title: '10,000 Daily Steps', frequency: 'Daily', streak: 8, completed: false, color: '#6366F1' },
  { id: '3', title: 'Evening Reflection & Journal', frequency: 'Daily', streak: 19, completed: true, color: '#EC4899' },
  { id: '4', title: 'Deep Work (2 Hours)', frequency: 'Weekdays', streak: 5, completed: false, color: '#8B5CF6' },
];

const INITIAL_JOURNALS = [
  {
    id: '1',
    title: 'Grateful for Small Wins ✨',
    content: 'Had a productive coding session this morning. Finished the new mobile app UI design and felt super energized. Grateful for peace and clarity today.',
    date: 'Today, 09:15 AM',
    tag: 'Gratitude',
    mood: 'Great',
  },
  {
    id: '2',
    title: 'Mindful Evening Thoughts',
    content: 'Took a peaceful evening walk around the lake. The sunset was vibrant violet and gold. Setting gentle intentions for tomorrow.',
    date: 'Yesterday, 07:45 PM',
    tag: 'Reflections',
    mood: 'Calm',
  },
];

const INITIAL_ROUTINES = [
  { id: '1', title: 'Drink warm water with lemon', time: '07:00 AM', completed: true, period: 'Morning' },
  { id: '2', title: '10-minute stretch & breathwork', time: '07:20 AM', completed: true, period: 'Morning' },
  { id: '3', title: 'Set Top 3 Priorities for the day', time: '08:00 AM', completed: true, period: 'Morning' },
  { id: '4', title: 'Screen disconnect & chamomile tea', time: '10:00 PM', completed: false, period: 'Evening' },
  { id: '5', title: '15 mins reading before sleep', time: '10:30 PM', completed: false, period: 'Evening' },
];

const INITIAL_PLACES = [
  { id: '1', title: 'Home Sanctuary', latitude: 37.7749, longitude: -122.4194, address: 'San Francisco, CA' },
  { id: '2', title: 'Equinox Fitness Studio', latitude: 37.7833, longitude: -122.4167, address: 'Market St, SF' },
  { id: '3', title: 'Zen Meditation Center', latitude: 37.7891, longitude: -122.4014, address: 'Downtown SF' },
];

const INITIAL_MOODS = [
  { id: '1', date: 'Today, 09:00 AM', mood: 'Great', emoji: '✨', note: 'Feeling grateful, energized, and ready to tackle tasks.' },
  { id: '2', date: 'Yesterday', mood: 'Calm', emoji: '🌿', note: 'Peaceful evening walk by the park after a productive workday.' },
  { id: '3', date: '2 days ago', mood: 'Energized', emoji: '⚡', note: 'Hit a personal record in steps and finished big project milestone.' },
  { id: '4', date: '3 days ago', mood: 'Reflective', emoji: '💭', note: 'Spent some time planning out weekly health and wellness goals.' },
];

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: 'Vidhi',
    email: 'vidhi@example.com',
    avatar: '🌸',
    tagline: 'Wellness & Growth Seeker',
  });
  const [token, setToken] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [habits, setHabits] = useState(INITIAL_HABITS);
  const [journals, setJournals] = useState(INITIAL_JOURNALS);
  const [routines, setRoutines] = useState(INITIAL_ROUTINES);
  const [places, setPlaces] = useState(INITIAL_PLACES);
  const [mood, setMood] = useState('Great');
  const [moodHistory, setMoodHistory] = useState(INITIAL_MOODS);

  const [healthData, setHealthData] = useState({
    water: 1750,
    waterGoal: config.waterDefaultGoal || 2500,
    steps: 7420,
    stepsGoal: config.stepsDefaultGoal || 10000,
    sleep: 7.8,
    sleepGoal: config.sleepDefaultGoal || 8.0,
    calories: 1920,
    activeMinutes: 45,
  });

  // Fetch / Sync all data from backend & local storage
  const syncData = useCallback(async () => {
    try {
      const [
        remoteTasks,
        remoteHabits,
        remoteHealth,
        remoteJournals,
        remoteRoutines,
        remotePlaces,
        remoteMoods,
        remoteProfile,
      ] = await Promise.all([
        apiService.getTasks(),
        apiService.getHabits(),
        apiService.getHealth(),
        apiService.getJournals(),
        apiService.getRoutines(),
        apiService.getPlaces(),
        apiService.getMoods(),
        apiService.getProfile(),
      ]);

      const connected = Boolean(remoteTasks || remoteHabits || remoteHealth || remoteProfile);
      setIsBackendConnected(connected);

      if (Array.isArray(remoteTasks) && remoteTasks.length > 0) {
        setTasks(remoteTasks.map((t) => ({ ...t, id: t._id || t.id })));
      } else {
        const saved = await storageService.getItem(config.storageKeys.tasks);
        if (saved && saved.length > 0) setTasks(saved);
      }

      if (Array.isArray(remoteHabits) && remoteHabits.length > 0) {
        setHabits(remoteHabits.map((h) => ({ ...h, id: h._id || h.id })));
      } else {
        const saved = await storageService.getItem(config.storageKeys.habits);
        if (saved && saved.length > 0) setHabits(saved);
      }

      if (remoteHealth && !remoteHealth.error) {
        setHealthData((prev) => ({ ...prev, ...remoteHealth }));
      } else {
        const saved = await storageService.getItem(config.storageKeys.health);
        if (saved) setHealthData(saved);
      }

      if (Array.isArray(remoteJournals) && remoteJournals.length > 0) {
        setJournals(remoteJournals.map((j) => ({ ...j, id: j._id || j.id })));
      } else {
        const saved = await storageService.getItem(config.storageKeys.journal);
        if (saved && saved.length > 0) setJournals(saved);
      }

      if (Array.isArray(remoteRoutines) && remoteRoutines.length > 0) {
        setRoutines(remoteRoutines.map((r) => ({ ...r, id: r._id || r.id })));
      } else {
        const saved = await storageService.getItem(config.storageKeys.routines);
        if (saved && saved.length > 0) setRoutines(saved);
      }

      if (Array.isArray(remotePlaces) && remotePlaces.length > 0) {
        setPlaces(remotePlaces.map((p) => ({ ...p, id: p._id || p.id })));
      }

      if (Array.isArray(remoteMoods) && remoteMoods.length > 0) {
        setMoodHistory(remoteMoods.map((m) => ({ ...m, id: m._id || m.id })));
        if (remoteMoods[0]?.mood) {
          setMood(remoteMoods[0].mood);
        }
      }

      if (remoteProfile && !remoteProfile.error) {
        setUser(remoteProfile);
      } else {
        const saved = await storageService.getItem(config.storageKeys.user);
        if (saved) setUser(saved);
      }
    } catch (e) {
      console.log('App sync error:', e.message);
    }
  }, []);

  useEffect(() => {
    syncData();
  }, [syncData]);

  // --- AUTHENTICATION ---
  const login = async (email, password) => {
    const res = await apiService.login(email, password);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      await storageService.setItem(config.storageKeys.user, res.user);
      await syncData();
      return { success: true, user: res.user };
    }
    const localUser = { name: email.split('@')[0], email, avatar: '🌸', tagline: 'Wellness & Growth Seeker' };
    setUser(localUser);
    await storageService.setItem(config.storageKeys.user, localUser);
    return { success: true, user: localUser, isOffline: true, message: res?.error };
  };

  const register = async (name, email, password) => {
    const res = await apiService.register(name, email, password);
    if (res && res.user) {
      setUser(res.user);
      setToken(res.token);
      await storageService.setItem(config.storageKeys.user, res.user);
      await syncData();
      return { success: true, user: res.user };
    }
    const localUser = { name, email, avatar: '🌸', tagline: 'Wellness & Growth Seeker' };
    setUser(localUser);
    await storageService.setItem(config.storageKeys.user, localUser);
    return { success: true, user: localUser, isOffline: true, message: res?.error };
  };

  const logout = async () => {
    setUser({ name: 'Vidhi', email: 'vidhi@example.com', avatar: '🌸', tagline: 'Wellness & Growth Seeker' });
    setToken(null);
    await storageService.removeItem(config.storageKeys.user);
  };

  const updateProfile = async (updatedData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...updatedData };
      storageService.setItem(config.storageKeys.user, updatedUser);
      return updatedUser;
    });
    try {
      const res = await apiService.updateProfile(updatedData);
      if (res && !res.error) {
        setUser((prev) => ({ ...prev, ...res }));
      }
    } catch (e) {
      console.log('Profile sync error:', e);
    }
  };

  // --- TASKS (Rock-Solid Dynamic Synchronization) ---
  const addTask = async (task) => {
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newTask = {
      title: task.title,
      category: task.category || 'Personal',
      priority: task.priority || 'Medium',
      time: task.time || '09:00 AM',
      completed: false,
      id: tempId,
      createdAt: new Date().toISOString(),
    };

    // Immediate optimistic state update
    setTasks((prev) => {
      const updated = [newTask, ...prev];
      storageService.setItem(config.storageKeys.tasks, updated);
      return updated;
    });

    try {
      const created = await apiService.createTask({
        title: newTask.title,
        category: newTask.category,
        priority: newTask.priority,
        time: newTask.time,
      });

      if (created && created._id) {
        setTasks((prev) => {
          const synced = prev.map((t) => (t.id === tempId ? { ...t, ...created, id: created._id } : t));
          storageService.setItem(config.storageKeys.tasks, synced);
          return synced;
        });
        return { success: true, task: created };
      }
    } catch (err) {
      console.log('Task create backend error:', err);
    }
    return { success: true, task: newTask };
  };

  const updateTask = async (id, updatedData) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t));
      storageService.setItem(config.storageKeys.tasks, updated);
      return updated;
    });
    apiService.updateTask(id, updatedData).catch(() => {});
  };

  const toggleTask = async (id) => {
    setTasks((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
      storageService.setItem(config.storageKeys.tasks, updated);
      return updated;
    });
    apiService.toggleTask(id).catch(() => {});
  };

  const deleteTask = async (id) => {
    setTasks((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      storageService.setItem(config.storageKeys.tasks, updated);
      return updated;
    });
    apiService.deleteTask(id).catch(() => {});
  };

  // --- HABITS ---
  const addHabit = async (habit) => {
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newHabit = { ...habit, id: tempId, streak: 0, completed: false };
    setHabits((prev) => {
      const updated = [...prev, newHabit];
      storageService.setItem(config.storageKeys.habits, updated);
      return updated;
    });
    try {
      const created = await apiService.createHabit(habit);
      if (created && created._id) {
        setHabits((prev) => {
          const synced = prev.map((h) => (h.id === tempId ? { ...h, ...created, id: created._id } : h));
          storageService.setItem(config.storageKeys.habits, synced);
          return synced;
        });
      }
    } catch (err) {
      console.log('Habit create sync error:', err);
    }
  };

  const updateHabit = async (id, habitData) => {
    setHabits((prev) => {
      const updated = prev.map((h) => (h.id === id ? { ...h, ...habitData } : h));
      storageService.setItem(config.storageKeys.habits, updated);
      return updated;
    });
    apiService.updateHabit(id, habitData).catch(() => {});
  };

  const toggleHabit = async (id) => {
    setHabits((prev) => {
      const updated = prev.map((h) =>
        h.id === id
          ? {
              ...h,
              completed: !h.completed,
              streak: !h.completed ? (h.streak || 0) + 1 : Math.max(0, (h.streak || 1) - 1),
            }
          : h
      );
      storageService.setItem(config.storageKeys.habits, updated);
      return updated;
    });
    apiService.toggleHabit(id).catch(() => {});
  };

  const deleteHabit = async (id) => {
    setHabits((prev) => {
      const updated = prev.filter((h) => h.id !== id);
      storageService.setItem(config.storageKeys.habits, updated);
      return updated;
    });
    apiService.deleteHabit(id).catch(() => {});
  };

  // --- JOURNALS ---
  const addJournal = async (journal) => {
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newEntry = {
      ...journal,
      id: tempId,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setJournals((prev) => {
      const updated = [newEntry, ...prev];
      storageService.setItem(config.storageKeys.journal, updated);
      return updated;
    });
    try {
      const created = await apiService.createJournal(journal);
      if (created && created._id) {
        setJournals((prev) => {
          const synced = prev.map((j) => (j.id === tempId ? { ...j, ...created, id: created._id } : j));
          storageService.setItem(config.storageKeys.journal, synced);
          return synced;
        });
      }
    } catch (err) {
      console.log('Journal create sync error:', err);
    }
  };

  const deleteJournal = async (id) => {
    setJournals((prev) => {
      const updated = prev.filter((j) => j.id !== id);
      storageService.setItem(config.storageKeys.journal, updated);
      return updated;
    });
    apiService.deleteJournal(id).catch(() => {});
  };

  // --- ROUTINES ---
  const addRoutine = async (routine) => {
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newRoutine = { ...routine, id: tempId, completed: false };
    setRoutines((prev) => {
      const updated = [...prev, newRoutine];
      storageService.setItem(config.storageKeys.routines, updated);
      return updated;
    });
    try {
      const created = await apiService.createRoutine(routine);
      if (created && created._id) {
        setRoutines((prev) => {
          const synced = prev.map((r) => (r.id === tempId ? { ...r, ...created, id: created._id } : r));
          storageService.setItem(config.storageKeys.routines, synced);
          return synced;
        });
      }
    } catch (err) {
      console.log('Routine create sync error:', err);
    }
  };

  const toggleRoutine = async (id) => {
    setRoutines((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r));
      storageService.setItem(config.storageKeys.routines, updated);
      return updated;
    });
    apiService.toggleRoutine(id).catch(() => {});
  };

  const deleteRoutine = async (id) => {
    setRoutines((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      storageService.setItem(config.storageKeys.routines, updated);
      return updated;
    });
    apiService.deleteRoutine(id).catch(() => {});
  };

  // --- MOOD ---
  const logMood = async (moodName, emoji = '✨', note = '') => {
    setMood(moodName);
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newLog = {
      id: tempId,
      mood: moodName,
      emoji,
      note: note || `Feeling ${moodName}`,
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    };
    setMoodHistory((prev) => [newLog, ...prev]);
    try {
      const created = await apiService.logMood({ mood: moodName, emoji, note });
      if (created && created._id) {
        setMoodHistory((prev) => prev.map((m) => (m.id === tempId ? { ...m, ...created, id: created._id } : m)));
      }
    } catch (e) {
      console.log('Mood log error:', e);
    }
  };

  // --- PLACES ---
  const savePlace = async (place) => {
    const tempId = 'temp_' + Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5);
    const newPlace = { ...place, id: tempId };
    setPlaces((prev) => [newPlace, ...prev]);
    try {
      const created = await apiService.createPlace(place);
      if (created && created._id) {
        setPlaces((prev) => prev.map((p) => (p.id === tempId ? { ...p, ...created, id: created._id } : p)));
      }
    } catch (err) {
      console.log('Place sync error:', err);
    }
  };

  const deletePlace = async (id) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
    apiService.deletePlace(id).catch(() => {});
  };

  // --- HEALTH & WATER & STEPS ---
  const addWater = async (amount) => {
    setHealthData((prev) => {
      const newWater = Math.max(0, prev.water + amount);
      const updated = { ...prev, water: newWater };
      storageService.setItem(config.storageKeys.health, updated);
      apiService.addWater(amount).catch(() => {});
      return updated;
    });
  };

  const addSteps = async (amount) => {
    setHealthData((prev) => {
      const newSteps = Math.max(0, (prev.steps || 0) + amount);
      const newCalories = Math.round(newSteps * 0.04);
      const updated = { ...prev, steps: newSteps, calories: newCalories };
      storageService.setItem(config.storageKeys.health, updated);
      apiService.addSteps(amount).catch(() => {});
      return updated;
    });
  };

  const setStepsCount = async (count) => {
    setHealthData((prev) => {
      const exactSteps = Math.max(0, count);
      const newCalories = Math.round(exactSteps * 0.04);
      const updated = { ...prev, steps: exactSteps, calories: newCalories };
      storageService.setItem(config.storageKeys.health, updated);
      apiService.updateHealth(updated).catch(() => {});
      return updated;
    });
  };

  const updateHealth = async (newHealth) => {
    setHealthData((prev) => {
      const updated = { ...prev, ...newHealth };
      storageService.setItem(config.storageKeys.health, updated);
      apiService.updateHealth(updated).catch(() => {});
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        updateProfile,
        isBackendConnected,
        syncData,
        tasks,
        setTasks,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        habits,
        setHabits,
        addHabit,
        updateHabit,
        toggleHabit,
        deleteHabit,
        journals,
        setJournals,
        addJournal,
        deleteJournal,
        routines,
        setRoutines,
        addRoutine,
        toggleRoutine,
        deleteRoutine,
        healthData,
        setHealthData,
        updateHealth,
        addWater,
        addSteps,
        setStepsCount,
        mood,
        setMood,
        moodHistory,
        logMood,
        places,
        savePlace,
        deletePlace,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
