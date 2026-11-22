import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const HabitCard = ({ title, streak = 0, frequency = 'Daily', completed, onToggle, onPress }) => {
  const { colors, allColors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.leftInfo}>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <View style={styles.metaRow}>
            <View style={[styles.streakBadge, { backgroundColor: `${allColors.warning}18` }]}>
              <Text style={styles.flame}>🔥</Text>
              <Text style={[styles.streakText, { color: allColors.warning }]}>{streak} day streak</Text>
            </View>
            <Text style={[styles.freqText, { color: colors.textSecondary }]}>• {frequency}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={[
          styles.checkButton,
          {
            borderColor: completed ? allColors.success : colors.border,
            backgroundColor: completed ? allColors.success : `${colors.borderLight}50`,
          },
        ]}
      >
        <Ionicons
          name={completed ? 'checkmark' : 'add'}
          size={18}
          color={completed ? '#FFF' : colors.textSecondary}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
  },
  leftInfo: {
    flex: 1,
    marginRight: 12,
  },
  textWrapper: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 3,
  },
  flame: {
    fontSize: 11,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '700',
  },
  freqText: {
    fontSize: 12,
    fontWeight: '500',
  },
  checkButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HabitCard;
