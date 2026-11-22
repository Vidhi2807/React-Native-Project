import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MOODS = [
  { emoji: '⚡', label: 'Energized', color: '#F59E0B' },
  { emoji: '✨', label: 'Great', color: '#10B981' },
  { emoji: '🌿', label: 'Calm', color: '#06B6D4' },
  { emoji: '💭', label: 'Reflective', color: '#6366F1' },
  { emoji: '🌧️', label: 'Low', color: '#64748B' },
];

export const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const { colors, allColors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.text }]}>Today's Mindset</Text>
        <Text style={[styles.activeMoodText, { color: allColors.primary }]}>
          {selectedMood ? `Feeling ${selectedMood}` : 'Check in'}
        </Text>
      </View>

      <View style={styles.moodRow}>
        {MOODS.map((item) => {
          const isSelected = selectedMood === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              onPress={() => onSelectMood?.(item.label)}
              style={[
                styles.moodItem,
                {
                  backgroundColor: isSelected ? `${item.color}20` : colors.cardAlt || `${colors.border}40`,
                  borderColor: isSelected ? item.color : 'transparent',
                },
              ]}
            >
              <Text style={styles.emoji}>{item.emoji}</Text>
              <Text
                style={[
                  styles.label,
                  { color: isSelected ? item.color : colors.textSecondary },
                  isSelected && styles.selectedLabel,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginVertical: 8,
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  activeMoodText: {
    fontSize: 13,
    fontWeight: '600',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  selectedLabel: {
    fontWeight: '700',
  },
});

export default MoodSelector;
