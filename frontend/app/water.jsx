import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

export default function WaterScreen() {
  const { colors, allColors } = useTheme();
  const { healthData, addWater } = useApp();

  const percentage = Math.min(Math.round((healthData.water / healthData.waterGoal) * 100), 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Water Tracker" subtitle="Daily Hydration Goal" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Hydration Circle Card */}
        <View style={[styles.circleCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.dropCircle, { backgroundColor: `${allColors.accent}15` }]}>
            <Ionicons name="water" size={44} color={allColors.accent} />
          </View>
          <Text style={[styles.mainValue, { color: colors.text }]}>{healthData.water}</Text>
          <Text style={[styles.subValue, { color: colors.textSecondary }]}>
            of {healthData.waterGoal} ml target ({percentage}%)
          </Text>
          <ProgressBar progress={percentage} color={allColors.accent} height={10} style={{ marginTop: 20 }} />
        </View>

        {/* Quick Add Buttons */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Log Water</Text>
        <View style={styles.buttonRow}>
          {[200, 250, 500].map((amt) => (
            <TouchableOpacity
              key={amt}
              activeOpacity={0.7}
              style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => addWater(amt)}
            >
              <Ionicons name="add" size={18} color={allColors.accent} />
              <Text style={[styles.btnText, { color: colors.text }]}>{amt} ml</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Hydration Tips */}
        <View style={[styles.tipCard, { backgroundColor: `${allColors.accent}10`, borderColor: `${allColors.accent}30` }]}>
          <Ionicons name="information-circle-outline" size={20} color={allColors.accent} />
          <Text style={[styles.tipText, { color: colors.text }]}>
            Drinking water consistently improves cognitive focus and sustains high energy throughout the day.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.resetBtn, { borderColor: colors.border }]}
          onPress={() => addWater(-healthData.water)}
          activeOpacity={0.7}
        >
          <Text style={[styles.resetText, { color: colors.textSecondary }]}>Reset Daily Water</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  circleCard: {
    width: '100%',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  dropCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mainValue: { fontSize: 40, fontWeight: '800', letterSpacing: -0.5 },
  subValue: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 10, width: '100%' },
  quickBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  btnText: { fontSize: 14, fontWeight: '700' },
  tipCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: '500' },
  resetBtn: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetText: { fontSize: 13, fontWeight: '600' },
});
