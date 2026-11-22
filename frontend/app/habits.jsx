import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import HabitCard from '../components/HabitCard';

export default function HabitsScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { habits, toggleHabit } = useApp();

  const totalStreak = habits.reduce((acc, h) => acc + (h.streak || 0), 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Habits & Streaks"
        subtitle={`${habits.length} habits tracked`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/add-habit')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        }
      />

      {/* Streak Showcase Banner */}
      <View style={[styles.banner, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.flameCircle}>
          <Text style={styles.flameEmoji}>🔥</Text>
        </View>
        <View style={styles.bannerInfo}>
          <Text style={[styles.bannerStreak, { color: colors.text }]}>{totalStreak} Total Days</Text>
          <Text style={[styles.bannerSub, { color: colors.textSecondary }]}>
            Combined streak across all active habits. Incredible work, Vidhi!
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <FlatList
          data={habits}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <HabitCard
              title={item.title}
              streak={item.streak}
              frequency={item.frequency}
              completed={item.completed}
              onToggle={() => toggleHabit(item.id)}
              onPress={() => router.push({ pathname: '/habit-details', params: { id: item.id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Start a New Routine</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Small daily improvements over time lead to stunning results.
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/add-habit')}
              >
                <Text style={styles.emptyBtnText}>+ Create First Habit</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  banner: {
    margin: 16,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flameCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  flameEmoji: { fontSize: 26 },
  bannerInfo: { flex: 1 },
  bannerStreak: { fontSize: 18, fontWeight: '800' },
  bannerSub: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  content: { flex: 1, paddingHorizontal: 16 },
  emptyContainer: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 24 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  emptyBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  emptyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
