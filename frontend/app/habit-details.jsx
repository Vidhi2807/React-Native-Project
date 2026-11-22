import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { getStreakBadge } from '../utils/streakUtils';
import Header from '../components/Header';

export default function HabitDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, allColors } = useTheme();
  const { habits, deleteHabit, toggleHabit } = useApp();

  const habit = habits.find((h) => h.id === id) || { title: 'Habit', streak: 0, frequency: 'Daily' };

  const handleDelete = () => {
    Alert.alert('Delete Habit', 'Are you sure you want to delete this habit streak?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteHabit(id);
          router.back();
        },
      },
    ]);
  };

  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Habit Details" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Badge Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.badgePill, { backgroundColor: `${allColors.warning}20` }]}>
            <Text style={[styles.badgeText, { color: allColors.warning }]}>{getStreakBadge(habit.streak)}</Text>
          </View>
          <Text style={[styles.title, { color: colors.text }]}>{habit.title}</Text>
          <Text style={[styles.streakCount, { color: allColors.warning }]}>{habit.streak} Days</Text>
          <Text style={[styles.sub, { color: colors.textSecondary }]}>Current Active Streak</Text>
        </View>

        {/* 7-Day Consistency Representation */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>This Week's Activity</Text>
        <View style={[styles.weekRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {daysOfWeek.map((day, idx) => (
            <View key={idx} style={styles.dayCol}>
              <View
                style={[
                  styles.dayDot,
                  {
                    backgroundColor: idx < 5 ? allColors.success : `${colors.borderLight}80`,
                  },
                ]}
              >
                {idx < 5 && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </View>
              <Text style={[styles.dayText, { color: colors.textSecondary }]}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Info Box */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Frequency</Text>
            <Text style={[styles.infoVal, { color: colors.text }]}>{habit.frequency || 'Daily'}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Status</Text>
            <Text style={[styles.infoVal, { color: habit.completed ? allColors.success : allColors.warning }]}>
              {habit.completed ? 'Completed Today ✓' : 'Pending Today'}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Reward Level</Text>
            <Text style={[styles.infoVal, { color: allColors.primary }]}>Level {Math.max(1, Math.floor(habit.streak / 5))}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: habit.completed ? colors.card : allColors.primary, borderColor: allColors.primary }]}
          onPress={() => toggleHabit(id)}
          activeOpacity={0.8}
        >
          <Ionicons name={habit.completed ? 'checkbox' : 'checkbox-outline'} size={18} color={habit.completed ? allColors.primary : '#FFF'} />
          <Text style={[styles.toggleBtnText, { color: habit.completed ? allColors.primary : '#FFF' }]}>
            {habit.completed ? 'Mark As Incomplete' : 'Mark Completed for Today'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: `${allColors.danger}40`, backgroundColor: `${allColors.danger}10` }]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color={allColors.danger} />
          <Text style={[styles.deleteText, { color: allColors.danger }]}>Delete Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  card: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  badgePill: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  badgeText: { fontSize: 13, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  streakCount: { fontSize: 40, fontWeight: '800', marginVertical: 6 },
  sub: { fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  dayCol: { alignItems: 'center', gap: 6 },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 12, fontWeight: '600' },
  infoCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  divider: { height: 1, marginVertical: 10 },
  infoLabel: { fontSize: 14, fontWeight: '500' },
  infoVal: { fontSize: 14, fontWeight: '700' },
  toggleBtn: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  toggleBtnText: { fontSize: 15, fontWeight: '700' },
  deleteBtn: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: { fontSize: 15, fontWeight: '700' },
});
