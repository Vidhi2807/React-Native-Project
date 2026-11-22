import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import ProgressBar from './ProgressBar';

export const WaterProgress = ({ current = 0, target = 2500, onCardPress }) => {
  const { colors, allColors } = useTheme();
  const { addWater } = useApp();
  const percentage = Math.min(Math.round((current / target) * 100), 100);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onCardPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={[styles.iconWrapper, { backgroundColor: `${allColors.accent}15` }]}>
            <Ionicons name="water" size={20} color={allColors.accent} />
          </View>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Daily Hydration</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              {current} <Text style={styles.unit}>/ {target} ml</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.quickAddBtn, { backgroundColor: allColors.accent }]}
          onPress={() => addWater(250)}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={16} color="#FFF" />
          <Text style={styles.quickAddText}>250ml</Text>
        </TouchableOpacity>
      </View>

      <ProgressBar progress={percentage} color={allColors.accent} height={8} style={styles.bar} />

      <View style={styles.bottomRow}>
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {percentage >= 100 ? '🎉 Goal Reached!' : `${Math.max(0, target - current)} ml left`}
        </Text>
        <Text style={[styles.percentBadge, { color: allColors.accent }]}>{percentage}%</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginVertical: 8,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  unit: {
    fontSize: 12,
    fontWeight: '400',
  },
  quickAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  quickAddText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bar: {
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  percentBadge: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default WaterProgress;
