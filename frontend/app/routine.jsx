import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function RoutineScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { routines, toggleRoutine } = useApp();

  const completedCount = routines.filter((r) => r.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Daily Rituals"
        subtitle={`${completedCount} of ${routines.length} completed`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/add-routine')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.content}>
        <FlatList
          data={routines}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleRoutine(item.id)}
              style={[
                styles.item,
                {
                  backgroundColor: colors.card,
                  borderColor: item.completed ? colors.borderLight : colors.border,
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => toggleRoutine(item.id)}
                style={[
                  styles.checkCircle,
                  {
                    borderColor: item.completed ? allColors.teal : colors.border,
                    backgroundColor: item.completed ? allColors.teal : 'transparent',
                  },
                ]}
              >
                {item.completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
              </TouchableOpacity>

              <View style={styles.info}>
                <Text
                  style={[
                    styles.title,
                    { color: colors.text },
                    item.completed && [styles.completedTitle, { color: colors.textMuted }],
                  ]}
                >
                  {item.title}
                </Text>
                <View style={styles.metaRow}>
                  <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                  <Text style={[styles.time, { color: colors.textSecondary }]}>{item.time}</Text>
                  {item.period && (
                    <Text style={[styles.period, { color: allColors.teal }]}>• {item.period}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: `${allColors.teal}15` }]}>
                <Ionicons name="alarm-outline" size={38} color={allColors.teal} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Rituals Yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Structure your morning energy and evening decompression rituals.
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/add-routine')}
              >
                <Text style={styles.emptyBtnText}>+ Add Routine</Text>
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
  content: { flex: 1, padding: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700' },
  completedTitle: { textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  time: { fontSize: 12, fontWeight: '500' },
  period: { fontSize: 12, fontWeight: '700' },
  emptyContainer: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 24 },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  emptyBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  emptyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
