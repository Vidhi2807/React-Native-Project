import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function AddRoutineScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { addRoutine } = useApp();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('07:30 AM');
  const [period, setPeriod] = useState('Morning');

  const periods = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const handleSave = () => {
    if (!title.trim()) return;
    addRoutine({
      title: title.trim(),
      time,
      period,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Add Ritual" showBack={true} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>ROUTINE NAME</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 10-minute breathwork & stretch"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>PERIOD</Text>
        <View style={styles.periodRow}>
          {periods.map((p) => {
            const isSelected = period === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPeriod(p)}
                style={[
                  styles.periodChip,
                  {
                    backgroundColor: isSelected ? allColors.teal : colors.card,
                    borderColor: isSelected ? allColors.teal : colors.border,
                  },
                ]}
              >
                <Text style={[styles.periodText, { color: isSelected ? '#FFF' : colors.text }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 20 }]}>SCHEDULED TIME</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 08:00 AM"
          placeholderTextColor={colors.textMuted}
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: allColors.teal }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>Save Routine</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontWeight: '500' },
  periodRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  periodChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1 },
  periodText: { fontSize: 13, fontWeight: '700' },
  btn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
