import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { colors, allColors } = useTheme();
  const { tasks, updateTask, deleteTask } = useApp();

  const task = tasks.find((t) => t.id === id) || { title: '', category: 'Personal', priority: 'Medium', time: '09:00 AM' };
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState(task.category || 'Personal');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [time, setTime] = useState(task.time || '09:00 AM');

  const categories = ['Personal', 'Work', 'Health', 'Study'];
  const priorities = ['Low', 'Medium', 'High'];

  const handleUpdate = async () => {
    if (!title.trim()) return;
    await updateTask(id, { title: title.trim(), category, priority, time });
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTask(id);
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Edit Task" showBack={true} />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>TASK TITLE</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>CATEGORY</Text>
        <View style={styles.chipRow}>
          {categories.map((c) => {
            const isSelected = category === c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>PRIORITY</Text>
        <View style={styles.chipRow}>
          {priorities.map((p) => {
            const isSelected = priority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 18 }]}>TIME</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          value={time}
          onChangeText={setTime}
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: allColors.primary }]}
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.deleteBtn, { borderColor: `${allColors.danger}40`, backgroundColor: `${allColors.danger}10` }]}
          onPress={handleDelete}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color={allColors.danger} />
          <Text style={[styles.deleteBtnText, { color: allColors.danger }]}>Delete Task</Text>
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
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '700' },
  saveBtn: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
  },
  saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  deleteBtn: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  deleteBtnText: { fontSize: 15, fontWeight: '700' },
});
