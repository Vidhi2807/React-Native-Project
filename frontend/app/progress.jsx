import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

export default function ProgressScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { tasks, habits, healthData, user } = useApp();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPct = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const completedHabits = habits.filter((h) => h.completed).length;
  const habitPct = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0;

  const waterPct = Math.min(100, Math.round((healthData.water / healthData.waterGoal) * 100));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Weekly Growth"
        subtitle="Performance & Consistency"
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/daily-summary')}
            style={[styles.sumBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="moon-outline" size={16} color={allColors.primary} />
            <Text style={[styles.sumBtnText, { color: allColors.primary }]}>Night Summary</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Productivity Score Ring / Card */}
        <View style={[styles.heroCard, { backgroundColor: allColors.primary }]}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>89%</Text>
            <Text style={styles.scoreLabel}>WEEK SCORE</Text>
          </View>
          <Text style={styles.heroTitle}>Outstanding Progress, {user?.name || 'Vidhi'}!</Text>
          <Text style={styles.heroSubtitle}>
            You're performing 14% higher in habit consistency compared to last week.
          </Text>
        </View>

        {/* Category Breakdown Progress */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Category Breakdown</Text>
        
        <View style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Ionicons name="checkbox" size={18} color={allColors.primary} />
              <Text style={[styles.itemLabel, { color: colors.text }]}>Tasks Completed</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
              {completedTasks}/{tasks.length} ({taskPct}%)
            </Text>
          </View>
          <ProgressBar progress={taskPct} color={allColors.primary} height={8} />
        </View>

        <View style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Ionicons name="flame" size={18} color={allColors.warning} />
              <Text style={[styles.itemLabel, { color: colors.text }]}>Habits Maintained</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
              {completedHabits}/{habits.length} ({habitPct}%)
            </Text>
          </View>
          <ProgressBar progress={habitPct} color={allColors.warning} height={8} />
        </View>

        <View style={[styles.itemCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemHeader}>
            <View style={styles.itemTitleRow}>
              <Ionicons name="water" size={18} color={allColors.accent} />
              <Text style={[styles.itemLabel, { color: colors.text }]}>Hydration Discipline</Text>
            </View>
            <Text style={[styles.itemValue, { color: colors.textSecondary }]}>
              {healthData.water} ml ({waterPct}%)
            </Text>
          </View>
          <ProgressBar progress={waterPct} color={allColors.accent} height={8} />
        </View>

        {/* Night Summary Prompt */}
        <TouchableOpacity
          style={[styles.summaryButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/daily-summary')}
          activeOpacity={0.8}
        >
          <Ionicons name="sparkles" size={20} color={allColors.primary} />
          <Text style={[styles.summaryText, { color: colors.text }]}>Review Night Reflection</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sumBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  sumBtnText: { fontSize: 12, fontWeight: '700' },
  heroCard: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  scoreCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  scoreNumber: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  scoreLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  heroTitle: { color: '#FFF', fontSize: 18, fontWeight: '700', textAlign: 'center' },
  heroSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
  sectionTitle: { fontSize: 17, fontWeight: '800', letterSpacing: -0.3, marginBottom: 12 },
  itemCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemLabel: { fontSize: 15, fontWeight: '700' },
  itemValue: { fontSize: 13, fontWeight: '600' },
  summaryButton: {
    marginTop: 16,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryText: { fontSize: 15, fontWeight: '700', flex: 1, marginLeft: 10 },
});
