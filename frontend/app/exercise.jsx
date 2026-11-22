import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ExerciseScreen() {
  const { colors, allColors } = useTheme();
  const { healthData, updateHealth } = useApp();
  const [customMin, setCustomMin] = useState('');

  const activeMinutes = healthData?.activeMinutes || 45;

  const handleAddMinutes = (min) => {
    const updated = Math.max(0, activeMinutes + min);
    updateHealth({ activeMinutes: updated });
  };

  const handleCustomAdd = () => {
    const val = parseInt(customMin, 10);
    if (!isNaN(val) && val > 0) {
      handleAddMinutes(val);
      setCustomMin('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Workouts & Energy" showBack={true} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${allColors.warning}15` }]}>
            <Ionicons name="fitness" size={36} color={allColors.warning} />
          </View>
          <Text style={[styles.title, { color: colors.textSecondary }]}>Active Workout Time</Text>
          <Text style={[styles.value, { color: allColors.warning }]}>{activeMinutes} mins</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            ~{Math.round(activeMinutes * 7.5)} kcal estimated • Daily stamina
          </Text>
        </View>

        {/* Quick Log Exercise Minutes */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>LOG WORKOUT SESSION</Text>
        <View style={styles.quickGrid}>
          {[
            { label: '15m Stretch', min: 15, icon: 'body-outline', color: allColors.success },
            { label: '30m Cardio', min: 30, icon: 'bicycle-outline', color: allColors.primary },
            { label: '45m Gym/HIIT', min: 45, icon: 'barbell-outline', color: allColors.warning },
            { label: '60m Long Run', min: 60, icon: 'walk-outline', color: allColors.orange },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleAddMinutes(item.min)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={22} color={item.color} />
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.quickMin, { color: item.color }]}>+{item.min} min</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Minutes Input */}
        <View style={[styles.customRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Custom workout minutes (e.g. 25)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={customMin}
            onChangeText={setCustomMin}
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: allColors.warning }]}
            onPress={handleCustomAdd}
          >
            <Text style={styles.addBtnText}>+ Log</Text>
          </TouchableOpacity>
        </View>

        

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Workout Inspiration</Text>
        
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.itemIcon, { backgroundColor: `${allColors.primary}15` }]}>
            <Ionicons name="bicycle-outline" size={22} color={allColors.primary} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>Cycling & Cardio</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>30 mins • 240 kcal • Heart rate: 135 bpm</Text>
          </View>
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.itemIcon, { backgroundColor: `${allColors.success}15` }]}>
            <Ionicons name="body-outline" size={22} color={allColors.success} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>Core & Flexibility</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>15 mins • 100 kcal • Mat session</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 14, fontWeight: '600' },
  value: { fontSize: 36, fontWeight: '800', marginVertical: 4 },
  subtitle: { fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  quickCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 6,
  },
  quickLabel: { fontSize: 13, fontWeight: '700' },
  quickMin: { fontSize: 12, fontWeight: '800' },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  input: { flex: 1, height: 44, fontSize: 14 },
  addBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  item: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemSub: { fontSize: 12, marginTop: 2 },
});
