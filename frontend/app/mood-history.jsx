import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function MoodHistoryScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { moodHistory } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Mood History"
        subtitle={`${moodHistory.length} logs recorded`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/mood')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Log</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <FlatList
          data={moodHistory}
          keyExtractor={(item, index) => item.id || item._id || index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.emojiCircle, { backgroundColor: `${allColors.primary}12` }]}>
                <Text style={styles.emoji}>{item.emoji || '✨'}</Text>
              </View>
              <View style={styles.info}>
                <View style={styles.topRow}>
                  <Text style={[styles.mood, { color: colors.text }]}>{item.mood}</Text>
                  <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date || 'Today'}</Text>
                </View>
                <Text style={[styles.note, { color: colors.textSecondary }]}>
                  {item.note || `Checked in feeling ${item.mood}`}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>✨</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Mood Logs Yet</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Record your daily feelings to understand your emotional cycles.
              </Text>
              <TouchableOpacity
                style={[styles.logBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/mood')}
              >
                <Text style={styles.logBtnText}>+ Log First Mood</Text>
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
  content: { flex: 1, padding: 16 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  emojiCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  mood: { fontSize: 16, fontWeight: '700' },
  date: { fontSize: 12, fontWeight: '500' },
  note: { fontSize: 13, lineHeight: 18 },
  emptyContainer: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center', marginBottom: 18 },
  logBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  logBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
