import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';

export default function NotificationScreen() {
  const { colors, allColors } = useTheme();
  const [reminders, setReminders] = useState(true);
  const [waterAlerts, setWaterAlerts] = useState(true);
  const [streakAlerts, setStreakAlerts] = useState(true);
  const [morningSummary, setMorningSummary] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Notification Alerts" subtitle="Gentle reminders & nudges" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="checkbox-outline" size={18} color={allColors.primary} />
              <Text style={[styles.title, { color: colors.text }]}>Daily Task Reminders</Text>
            </View>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>Nudge for high-priority items</Text>
          </View>
          <Switch
            value={reminders}
            onValueChange={setReminders}
            trackColor={{ false: colors.border, true: allColors.primary }}
          />
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="water-outline" size={18} color={allColors.accent} />
              <Text style={[styles.title, { color: colors.text }]}>Hydration Reminders</Text>
            </View>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>Hourly drink water alerts</Text>
          </View>
          <Switch
            value={waterAlerts}
            onValueChange={setWaterAlerts}
            trackColor={{ false: colors.border, true: allColors.accent }}
          />
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="flame-outline" size={18} color={allColors.warning} />
              <Text style={[styles.title, { color: colors.text }]}>Streak Protection</Text>
            </View>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>Evening reminder if habit pending</Text>
          </View>
          <Switch
            value={streakAlerts}
            onValueChange={setStreakAlerts}
            trackColor={{ false: colors.border, true: allColors.warning }}
          />
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Ionicons name="sunny-outline" size={18} color={allColors.orange} />
              <Text style={[styles.title, { color: colors.text }]}>Morning Inspiration</Text>
            </View>
            <Text style={[styles.sub, { color: colors.textSecondary }]}>Daily positive affirmations</Text>
          </View>
          <Switch
            value={morningSummary}
            onValueChange={setMorningSummary}
            trackColor={{ false: colors.border, true: allColors.orange }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  textContainer: { flex: 1, marginRight: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 15, fontWeight: '700' },
  sub: { fontSize: 12, marginTop: 4, paddingLeft: 26 },
});
