import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function DailySummaryScreen() {
  const { colors, allColors } = useTheme();
  const { mood, healthData, tasks, habits, user } = useApp();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedHabits = habits.filter((h) => h.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Daily Reflection" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.moon}>🌙</Text>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Rest Well, {user?.name || 'Vidhi'}</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Here is your daily snapshot. You showed up and made great headway today.
          </Text>
        </View>

        <View style={styles.grid}>
          <View style={[styles.statItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="checkbox" size={24} color={allColors.primary} />
            <Text style={[styles.statNum, { color: colors.text }]}>{completedTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Tasks Done</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="flame" size={24} color={allColors.warning} />
            <Text style={[styles.statNum, { color: colors.text }]}>{completedHabits}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Habits Checked</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="water" size={24} color={allColors.accent} />
            <Text style={[styles.statNum, { color: colors.text }]}>{healthData.water} ml</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Water Intake</Text>
          </View>

          <View style={[styles.statItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="sparkles" size={24} color={allColors.secondary} />
            <Text style={[styles.statNum, { color: colors.text }]}>{mood}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Daily Mindset</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  heroCard: {
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  moon: { fontSize: 44, marginBottom: 8 },
  heroTitle: { fontSize: 20, fontWeight: '800' },
  heroSubtitle: { fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statNum: { fontSize: 20, fontWeight: '800', marginTop: 4 },
  statLabel: { fontSize: 12, fontWeight: '600' },
});
