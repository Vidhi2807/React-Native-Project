import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Home" showBack={true} />
      <View style={styles.content}>
        <Text style={[styles.welcome, { color: colors.text }]}>Welcome to Your Daily Hub</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          Navigate to your dashboard, manage tasks, and track your wellness.
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: allColors.primary }]}
          onPress={() => router.push('/')}
        >
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
