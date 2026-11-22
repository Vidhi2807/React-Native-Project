import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function AddTaskScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { addTask } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [priority, setPriority] = useState('Medium');
  const [time, setTime] = useState('09:00 AM');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { name: 'Personal', icon: 'person-outline', color: allColors.orange },
    { name: 'Work', icon: 'briefcase-outline', color: allColors.primary },
    { name: 'Health', icon: 'heart-outline', color: allColors.success },
    { name: 'Study', icon: 'book-outline', color: allColors.purple },
  ];

  const priorities = ['Low', 'Medium', 'High'];

  const quickTimes = ['07:30 AM', '09:00 AM', '11:00 AM', '02:30 PM', '06:00 PM', '08:30 PM'];

  const templates = [
    { label: '🏃 Morning Jog', category: 'Health', priority: 'High', time: '07:00 AM' },
    { label: '🧘 15-min Meditation', category: 'Health', priority: 'Medium', time: '07:30 AM' },
    { label: '💻 Deep Focus Sprint', category: 'Work', priority: 'High', time: '10:00 AM' },
    { label: '📖 Read 20 Pages', category: 'Study', priority: 'Low', time: '08:30 PM' },
    { label: '💧 Hydration Check', category: 'Personal', priority: 'Medium', time: '02:00 PM' },
  ];

  const handleApplyTemplate = (tpl) => {
    setTitle(tpl.label);
    setCategory(tpl.category);
    setPriority(tpl.priority);
    setTime(tpl.time);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required Field', 'Please enter a title for your task.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addTask({
        title: title.trim(),
        category,
        priority,
        time: time.trim() || '09:00 AM',
      });
      setIsSubmitting(false);
      router.back();
    } catch (err) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Unable to create task. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Create New Task" showBack={true} />
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        {/* Quick Templates Banner */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>QUICK SUGGESTIONS</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.templateRow}>
          {templates.map((tpl) => (
            <TouchableOpacity
              key={tpl.label}
              style={[styles.templateChip, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleApplyTemplate(tpl)}
              activeOpacity={0.7}
            >
              <Text style={[styles.templateText, { color: colors.text }]}>{tpl.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Task Name */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>WHAT ARE YOU PLANNING?</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="e.g. Finish client presentation"
          placeholderTextColor={colors.textMuted}
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        {/* Category Selection */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 22 }]}>CATEGORY</Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const isSelected = category === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                activeOpacity={0.7}
                onPress={() => setCategory(cat.name)}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? `${cat.color}20` : colors.card,
                    borderColor: isSelected ? cat.color : colors.border,
                  },
                ]}
              >
                <Ionicons name={cat.icon} size={20} color={isSelected ? cat.color : colors.textSecondary} />
                <Text style={[styles.categoryText, { color: isSelected ? cat.color : colors.text }]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Priority Selection */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 22 }]}>PRIORITY</Text>
        <View style={styles.priorityRow}>
          {priorities.map((p) => {
            const isSelected = priority === p;
            return (
              <TouchableOpacity
                key={p}
                onPress={() => setPriority(p)}
                style={[
                  styles.priorityChip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.priorityText, { color: isSelected ? '#FFF' : colors.text }]}>{p}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scheduled Time */}
        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 22 }]}>SCHEDULED TIME</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              color: colors.text,
            },
          ]}
          placeholder="e.g. 10:30 AM"
          placeholderTextColor={colors.textMuted}
          value={time}
          onChangeText={setTime}
        />

        {/* Quick Time Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeChipsRow}>
          {quickTimes.map((qt) => {
            const isSelected = time === qt;
            return (
              <TouchableOpacity
                key={qt}
                style={[
                  styles.timeChip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
                onPress={() => setTime(qt)}
              >
                <Text style={[styles.timeChipText, { color: isSelected ? '#FFF' : colors.textSecondary }]}>
                  {qt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: allColors.primary }]}
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Save Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 20,
    paddingBottom: 40,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  templateRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  templateChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  templateText: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  categoryGrid: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  categoryCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '700',
  },
  timeChipsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  timeChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 6,
  },
  timeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  submitButton: {
    height: 54,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 36,
    elevation: 3,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
