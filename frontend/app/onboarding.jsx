import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function OnboardingScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.logoCircle, { backgroundColor: `${allColors.primary}15` }]}>
          <Text style={styles.logo}>✨</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Welcome to Your Life & Wellness Space</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Organize daily tasks, build unshakable habits, track hydration & sleep, and reflect on your growth.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle" size={20} color={allColors.success} />
            <Text style={[styles.featureText, { color: colors.text }]}>Smart Task Management & Priorities</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="flame" size={20} color={allColors.warning} />
            <Text style={[styles.featureText, { color: colors.text }]}>Habit Consistency & Streak Tracking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="heart" size={20} color={allColors.secondary} />
            <Text style={[styles.featureText, { color: colors.text }]}>Health & Wellness Dashboard</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: allColors.primary }]}
          onPress={() => router.replace('/')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started ›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    padding: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: { fontSize: 44 },
  title: { fontSize: 26, fontWeight: '800', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  features: {
    width: '100%',
    gap: 14,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
