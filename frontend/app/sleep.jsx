import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

export default function SleepScreen() {
  const { colors, allColors } = useTheme();
  const { healthData, updateHealth } = useApp();
  const [customHours, setCustomHours] = useState('');

  const currentSleep = healthData?.sleep || 7.8;
  const targetSleep = healthData?.sleepGoal || 8.0;
  const percentage = Math.min(Math.round((currentSleep / targetSleep) * 100), 100);

  const handleQuickSetSleep = (hrs) => {
    updateHealth({ sleep: hrs });
  };

  const handleCustomSleep = () => {
    const val = parseFloat(customHours);
    if (!isNaN(val) && val > 0 && val <= 24) {
      updateHealth({ sleep: parseFloat(val.toFixed(1)) });
      setCustomHours('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Sleep Quality" showBack={true} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${allColors.secondary}15` }]}>
            <Ionicons name="moon" size={36} color={allColors.secondary} />
          </View>
          <Text style={[styles.title, { color: colors.textSecondary }]}>Last Night's Rest</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentSleep} hrs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Target: {targetSleep} hrs ({percentage}%)
          </Text>
          <ProgressBar progress={percentage} color={allColors.secondary} height={10} style={{ marginTop: 16 }} />
        </View>

        {/* Quick Log Sleep Buttons */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>LOG SLEEP DURATION</Text>
        <View style={styles.quickRow}>
          {[6.5, 7.0, 7.5, 8.0, 8.5].map((hrs) => {
            const isSelected = currentSleep === hrs;
            return (
              <TouchableOpacity
                key={hrs}
                style={[
                  styles.quickChip,
                  {
                    backgroundColor: isSelected ? allColors.secondary : colors.card,
                    borderColor: isSelected ? allColors.secondary : colors.border,
                  },
                ]}
                onPress={() => handleQuickSetSleep(hrs)}
              >
                <Text style={[styles.quickChipText, { color: isSelected ? '#FFF' : colors.text }]}>{hrs}h</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Custom Sleep Input */}
        <View style={[styles.inputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Custom hours (e.g. 7.2)"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            value={customHours}
            onChangeText={setCustomHours}
          />
          <TouchableOpacity
            style={[styles.setBtn, { backgroundColor: allColors.secondary }]}
            onPress={handleCustomSleep}
          >
            <Text style={styles.setBtnText}>Set</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Sleep Architecture</Text>
        
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.stageDot, { backgroundColor: allColors.primary }]} />
            <Text style={[styles.itemTitle, { color: colors.text }]}>Deep Sleep</Text>
          </View>
          <Text style={[styles.itemSub, { color: colors.text }]}>
            {((currentSleep * 0.25)).toFixed(1)} hrs (25%)
          </Text>
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.stageDot, { backgroundColor: allColors.secondary }]} />
            <Text style={[styles.itemTitle, { color: colors.text }]}>REM Sleep</Text>
          </View>
          <Text style={[styles.itemSub, { color: colors.text }]}>
            {((currentSleep * 0.28)).toFixed(1)} hrs (28%)
          </Text>
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.itemLeft}>
            <View style={[styles.stageDot, { backgroundColor: allColors.accent }]} />
            <Text style={[styles.itemTitle, { color: colors.text }]}>Light Sleep</Text>
          </View>
          <Text style={[styles.itemSub, { color: colors.text }]}>
            {((currentSleep * 0.47)).toFixed(1)} hrs (47%)
          </Text>
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
  quickRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  quickChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickChipText: { fontSize: 13, fontWeight: '700' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 8,
  },
  input: { flex: 1, height: 44, fontSize: 14 },
  setBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  setBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  item: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stageDot: { width: 10, height: 10, borderRadius: 5 },
  itemTitle: { fontSize: 15, fontWeight: '600' },
  itemSub: { fontSize: 14, fontWeight: '700' },
});
