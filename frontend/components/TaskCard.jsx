import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const TaskCard = ({ title, category, priority, time, completed, onToggle, onPress }) => {
  const { colors, allColors } = useTheme();

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Work':
        return allColors.primary;
      case 'Health':
        return allColors.success;
      case 'Study':
        return allColors.purple;
      default:
        return allColors.orange;
    }
  };

  const catColor = getCategoryColor(category);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: completed ? colors.borderLight : colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={[
          styles.checkbox,
          {
            borderColor: completed ? allColors.success : colors.border,
            backgroundColor: completed ? allColors.success : 'transparent',
          },
        ]}
      >
        {completed && <Ionicons name="checkmark" size={14} color="#FFF" />}
      </TouchableOpacity>

      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: colors.text },
            completed && [styles.completedTitle, { color: colors.textMuted }],
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <View style={styles.metaRow}>
          {category && (
            <View style={[styles.badge, { backgroundColor: `${catColor}15` }]}>
              <Text style={[styles.badgeText, { color: catColor }]}>{category}</Text>
            </View>
          )}

          {priority && (
            <View style={[styles.badge, { backgroundColor: priority === 'High' ? `${allColors.danger}15` : `${colors.textSecondary}15` }]}>
              <Text style={[styles.badgeText, { color: priority === 'High' ? allColors.danger : colors.textSecondary }]}>
                {priority}
              </Text>
            </View>
          )}

          {time && (
            <View style={styles.timeWrapper}>
              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles.timeText, { color: colors.textSecondary }]}>{time}</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={styles.chevron} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 5,
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '500',
  },
  chevron: {
    marginLeft: 6,
  },
});

export default TaskCard;
