import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function AddHabitScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { habits, addHabit } = useApp();

  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');

  const emojis = ['🎯', '💧', '🏃‍♀️', '🧘‍♀️', '📖', '🥗', '🌙', '💻'];
  const frequencies = ['Daily', 'Weekdays', 'Weekends', '3x / week'];

  const handleSave = () => {
    if (!title.trim()) return;
    addHabit({
      title: `${selectedEmoji} ${title.trim()}`,
      frequency,
      color: '#6366F1',
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Create New Habit" showBack={true} />
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Emoji Selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>CHOOSE ICON</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.emojiRow}>
          {emojis.map((emoji) => {
            const isSelected = selectedEmoji === emoji;
            return (
              <TouchableOpacity
                key={emoji}
                onPress={() => setSelectedEmoji(emoji)}
                style={[
                  styles.emojiBox,
                  {
                    backgroundColor: isSelected ? `${allColors.primary}20` : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Habit Name */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 22 }]}>HABIT NAME</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 20 min morning reading"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        {/* Frequency */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 22 }]}>FREQUENCY</Text>
        <View style={styles.freqRow}>
          {frequencies.map((freq) => {
            const isSelected = frequency === freq;
            return (
              <TouchableOpacity
                key={freq}
                onPress={() => setFrequency(freq)}
                style={[
                  styles.freqChip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.freqText, { color: isSelected ? '#FFF' : colors.text }]}>{freq}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: allColors.primary }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.submitText}>Start Building Habit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  emojiRow: { marginBottom: 6 },
  emojiBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emojiText: { fontSize: 22 },
  input: { height: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, fontWeight: '500' },
  freqRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  freqChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1 },
  freqText: { fontSize: 13, fontWeight: '700' },
  submitButton: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
  },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
