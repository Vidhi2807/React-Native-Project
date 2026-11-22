import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const ProgressBar = ({ progress = 0, color, height = 8, style }) => {
  const { colors, allColors } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const activeColor = color || allColors.primary;

  return (
    <View style={[styles.track, { backgroundColor: colors.borderLight || colors.border, height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: activeColor,
            width: `${clampedProgress}%`,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default ProgressBar;
