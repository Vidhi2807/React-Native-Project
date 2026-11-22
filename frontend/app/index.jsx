import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { getGreeting } from '../utils/greetingUtils';
import { formatDate } from '../utils/dateUtils';
import WaterProgress from '../components/WaterProgress';
import MoodSelector from '../components/MoodSelector';
import HealthCard from '../components/HealthCard';
import TaskCard from '../components/TaskCard';
import HabitCard from '../components/HabitCard';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const {
    user,
    healthData,
    mood,
    logMood,
    tasks,
    toggleTask,
    habits,
    toggleHabit,
    isBackendConnected,
    syncData,
  } = useApp();

  const navCards = [
    { title: 'Tasks', route: '/tasks', icon: 'checkbox-outline', color: allColors.primary },
    { title: 'Habits', route: '/habits', icon: 'flame-outline', color: allColors.warning },
    { title: 'Health', route: '/health', icon: 'heart-outline', color: allColors.secondary },
    { title: 'Journal', route: '/journal', icon: 'book-outline', color: allColors.purple },
    { title: 'Routine', route: '/routine', icon: 'alarm-outline', color: allColors.teal },
    { title: 'Progress', route: '/progress', icon: 'stats-chart-outline', color: allColors.accent },
    { title: 'Camera', route: '/camera', icon: 'camera-outline', color: allColors.orange },
    { title: 'Places', route: '/location', icon: 'location-outline', color: allColors.success },
  ];

  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header section with User Profile */}
        <View style={styles.header}>
          <View>
            <View style={styles.dateBadgeRow}>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate()}</Text>
              {isBackendConnected && (
                <View style={[styles.syncDotBadge, { backgroundColor: `${allColors.success}20` }]}>
                  <View style={[styles.dot, { backgroundColor: allColors.success }]} />
                  <Text style={[styles.syncDotText, { color: allColors.success }]}>Live</Text>
                </View>
              )}
            </View>
            <Text style={[styles.greetingText, { color: colors.text }]}>
              {getGreeting()}, {user?.name || 'Vidhi'} ✨
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.profileEmoji}>{user?.avatar || '🌸'}</Text>
          </TouchableOpacity>
        </View>

        {/* Motivational Banner */}
        <View style={[styles.bannerCard, { backgroundColor: allColors.primary }]}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerBadge}>TODAY'S MOMENTUM</Text>
            <Text style={styles.bannerTitle}>
              {completedTasksCount}/{tasks.length} tasks completed today!
            </Text>
            <Text style={styles.bannerSubtitle}>Consistency is the secret ingredient. Keep shining, {user?.name || 'Vidhi'}!</Text>
          </View>
          <Ionicons name="sparkles" size={32} color="#FFF" style={styles.bannerIcon} />
        </View>

        {/* Quick Nav Carousel */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Access</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navRow}>
          {navCards.map((item) => (
            <TouchableOpacity
              key={item.route}
              activeOpacity={0.7}
              style={[styles.navCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push(item.route)}
            >
              <View style={[styles.navIconBg, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={[styles.navTitle, { color: colors.text }]}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mood Check-In Widget */}
        <MoodSelector selectedMood={mood} onSelectMood={(m) => logMood(m)} />

        {/* Hydration Widget */}
        <WaterProgress
          current={healthData.water}
          target={healthData.waterGoal}
          onCardPress={() => router.push('/water')}
        />

        {/* Health & Vitality Overview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Health & Wellness</Text>
          <TouchableOpacity onPress={() => router.push('/health')}>
            <Text style={[styles.seeAll, { color: allColors.primary }]}>View All ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.grid}>
          <HealthCard
            iconName="footsteps-outline"
            title="Daily Steps"
            value={(healthData?.steps || 0).toLocaleString()}
            unit="steps"
            subtitle={`Goal: ${(healthData?.stepsGoal || 10000).toLocaleString()} steps (${Math.min(
              Math.round(((healthData?.steps || 0) / (healthData?.stepsGoal || 10000)) * 100),
              100
            )}%)`}
            color={allColors.primary}
            onPress={() => router.push('/steps')}
          />
          <HealthCard
            iconName="moon-outline"
            title="Sleep Quality"
            value={healthData.sleep}
            unit="hours"
            subtitle="Optimal restorative rest"
            color={allColors.secondary}
            onPress={() => router.push('/sleep')}
          />
        </View>

        {/* Habit Streaks Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Habits</Text>
          <TouchableOpacity onPress={() => router.push('/habits')}>
            <Text style={[styles.seeAll, { color: allColors.primary }]}>Manage ›</Text>
          </TouchableOpacity>
        </View>
        {habits.slice(0, 3).map((habit) => (
          <HabitCard
            key={habit.id}
            title={habit.title}
            streak={habit.streak}
            frequency={habit.frequency}
            completed={habit.completed}
            onToggle={() => toggleHabit(habit.id)}
            onPress={() => router.push({ pathname: '/habit-details', params: { id: habit.id } })}
          />
        ))}

        {/* Today's Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Focus</Text>
          <TouchableOpacity onPress={() => router.push('/add-task')}>
            <Text style={[styles.seeAll, { color: allColors.primary }]}>+ Add Task</Text>
          </TouchableOpacity>
        </View>
        {tasks.length === 0 ? (
          <TouchableOpacity
            style={[styles.emptyBox, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/add-task')}
          >
            <Ionicons name="add-circle-outline" size={28} color={allColors.primary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>Add your primary goal for today</Text>
          </TouchableOpacity>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              category={task.category}
              priority={task.priority}
              time={task.time}
              completed={task.completed}
              onToggle={() => toggleTask(task.id)}
              onPress={() => router.push({ pathname: '/edit-task', params: { id: task.id } })}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  syncDotBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  syncDotText: { fontSize: 10, fontWeight: '800' },
  greetingText: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginTop: 2,
  },
  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileEmoji: {
    fontSize: 22,
  },
  bannerCard: {
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  bannerContent: {
    flex: 1,
    paddingRight: 10,
  },
  bannerBadge: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    lineHeight: 16,
  },
  bannerIcon: {
    opacity: 0.9,
  },
  navRow: {
    marginBottom: 12,
    paddingVertical: 4,
  },
  navCard: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 80,
  },
  navIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '700',
  },
  grid: {
    gap: 4,
  },
  emptyBox: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
    gap: 6,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
