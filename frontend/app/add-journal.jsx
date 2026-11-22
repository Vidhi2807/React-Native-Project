import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/dateUtils';
import Header from '../components/Header';

export default function AddJournalScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { addJournal, mood } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Gratitude');

  const tags = ['Gratitude', 'Daily Life', 'Work & Goals', 'Ideas', 'Reflections'];

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    addJournal({
      title: title.trim() || 'Untitled Reflection',
      content: content.trim(),
      tag,
      mood,
    });
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Write Reflection" showBack={true} />
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Tag Selector */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>SELECT TOPIC</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagRow}>
          {tags.map((t) => {
            const isSelected = tag === t;
            return (
              <TouchableOpacity
                key={t}
                onPress={() => setTag(t)}
                style={[
                  styles.tagChip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.tagText, { color: isSelected ? '#FFF' : colors.text }]}>{t}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>ENTRY TITLE</Text>
        <TextInput
          style={[styles.titleInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="Title of your reflection"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>YOUR THOUGHTS</Text>
        <TextInput
          style={[styles.contentInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="What made today special? What are you grateful for?"
          placeholderTextColor={colors.textMuted}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: allColors.primary }]}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Text style={styles.saveText}>Save Journal Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 20 },
  label: { fontSize: 12, fontWeight: '800', letterSpacing: 0.6, marginBottom: 8 },
  tagRow: { marginBottom: 6 },
  tagChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  tagText: { fontSize: 13, fontWeight: '700' },
  titleInput: {
    height: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  contentInput: {
    minHeight: 200,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    lineHeight: 22,
  },
  saveBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  saveText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
