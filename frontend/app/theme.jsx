import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';

export default function ThemeScreen() {
  const { isDarkMode, toggleTheme, colors, allColors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Appearance" subtitle="Theme & visual comfort" showBack={true} />
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={styles.left}>
              <View style={[styles.iconCircle, { backgroundColor: `${allColors.primary}15` }]}>
                <Ionicons name={isDarkMode ? 'moon' : 'sunny'} size={24} color={allColors.primary} />
              </View>
              <View>
                <Text style={[styles.title, { color: colors.text }]}>Dark Theme</Text>
                <Text style={[styles.sub, { color: colors.textSecondary }]}>
                  {isDarkMode ? 'Deep OLED dark active' : 'Bright daylight theme active'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: allColors.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  left: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '700' },
  sub: { fontSize: 12, marginTop: 2 },
});
