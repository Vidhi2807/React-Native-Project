import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function JournalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, allColors } = useTheme();
  const { journals, deleteJournal } = useApp();

  const entry = journals.find((j) => j.id === id) || {
    title: 'Reflection',
    content: '',
    date: '',
    tag: 'Gratitude',
  };

  const handleDelete = () => {
    Alert.alert('Delete Reflection', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteJournal(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Journal Reflection" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.tagPill, { backgroundColor: `${allColors.purple}15` }]}>
            <Text style={[styles.tagText, { color: allColors.purple }]}>{entry.tag || 'Thoughts'}</Text>
          </View>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{entry.date}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{entry.title}</Text>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.entryText, { color: colors.text }]}>{entry.content}</Text>
        </View>

        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: `${allColors.danger}40`, backgroundColor: `${allColors.danger}10` }]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color={allColors.danger} />
          <Text style={[styles.deleteText, { color: allColors.danger }]}>Delete Entry</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '700' },
  date: { fontSize: 13, fontWeight: '500' },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.4, marginBottom: 16 },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 180,
    marginBottom: 24,
  },
  entryText: { fontSize: 16, lineHeight: 26, fontWeight: '400' },
  deleteBtn: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: { fontSize: 15, fontWeight: '700' },
});
