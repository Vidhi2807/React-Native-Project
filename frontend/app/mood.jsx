import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import MoodSelector from '../components/MoodSelector';

export default function MoodScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { mood, logMood, user } = useApp();

  const [customNote, setCustomNote] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const moodEmojis = {
    Great: '✨',
    Good: '🌿',
    Okay: '☁️',
    Low: '🌧️',
    Stressed: '⚡',
  };

  const handleSelectMood = (newMood) => {
    logMood(newMood, moodEmojis[newMood] || '✨', customNote);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSaveNote = () => {
    if (!customNote.trim()) return;
    logMood(mood, moodEmojis[mood] || '✨', customNote.trim());
    setCustomNote('');
    Alert.alert('Mood Logged', 'Your emotional mindset check-in is saved!');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Mood & Mindset"
        subtitle="Emotional Health Check-in"
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/mood-history')}
            style={[styles.histBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="time-outline" size={16} color={colors.text} />
            <Text style={[styles.histBtnText, { color: colors.text }]}>History</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <MoodSelector selectedMood={mood} onSelectMood={handleSelectMood} />

        {isSaved && (
          <View style={[styles.savedToast, { backgroundColor: allColors.primary }]}>
            <Ionicons name="checkmark-circle" size={16} color="#FFF" />
            <Text style={styles.savedToastText}>Mindset synced to database!</Text>
          </View>
        )}

        {/* Selected State Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>CURRENT FOCUS</Text>
          <Text style={[styles.moodLabel, { color: allColors.primary }]}>
            {moodEmojis[mood] || '✨'} Feeling {mood}
          </Text>
          <Text style={[styles.quote, { color: colors.text }]}>
            "Every day is a clean page, {user?.name || 'Vidhi'}. Honor your feelings, breathe deeply, and keep growing."
          </Text>
        </View>

        {/* Add Note to Log */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Mood Note</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="What is influencing your mood right now?"
          placeholderTextColor={colors.textMuted}
          value={customNote}
          onChangeText={setCustomNote}
        />
        {customNote.length > 0 && (
          <TouchableOpacity
            style={[styles.noteBtn, { backgroundColor: allColors.primary }]}
            onPress={handleSaveNote}
          >
            <Text style={styles.noteBtnText}>Save Reflection Note</Text>
          </TouchableOpacity>
        )}

        {/* Action Prompt */}
        <TouchableOpacity
          style={[styles.journalBtn, { backgroundColor: allColors.primary }]}
          onPress={() => router.push('/add-journal')}
          activeOpacity={0.8}
        >
          <Ionicons name="create-outline" size={20} color="#FFF" />
          <Text style={styles.journalBtnText}>Write In Daily Journal</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  histBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  histBtnText: { fontSize: 13, fontWeight: '700' },
  savedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 8,
  },
  savedToastText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  card: {
    padding: 24,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 14,
  },
  cardTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  moodLabel: { fontSize: 24, fontWeight: '800', marginVertical: 8 },
  quote: { fontSize: 13.5, fontStyle: 'italic', textAlign: 'center', marginTop: 4, lineHeight: 20 },
  sectionTitle: { fontSize: 14, fontWeight: '800', letterSpacing: 0.4, marginBottom: 8, marginTop: 10 },
  input: {
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 8,
  },
  noteBtn: {
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  noteBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  journalBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  journalBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
