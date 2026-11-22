import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import HealthCard from '../components/HealthCard';
import WaterProgress from '../components/WaterProgress';

export default function HealthDashboard() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { healthData } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Health & Vitality" subtitle="Live Daily Telemetry" showBack={true} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hydration Widget */}
        <WaterProgress
          current={healthData.water}
          target={healthData.waterGoal}
          onCardPress={() => router.push('/water')}
        />

        {/* Vitality Metric Cards */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Body & Activity Metrics</Text>
        
        <HealthCard
          iconName="water-outline"
          title="Hydration Intake"
          value={healthData.water}
          unit="ml"
          subtitle="Tap to view hydration breakdown"
          color={allColors.accent}
          onPress={() => router.push('/water')}
        />

        <HealthCard
          iconName="footsteps-outline"
          title="Daily Steps"
          value={(healthData?.steps || 0).toLocaleString()}
          unit="steps"
          subtitle={`Goal: ${(healthData.stepsGoal || 10000).toLocaleString()} steps (${Math.min(Math.round(((healthData.steps || 0) / (healthData.stepsGoal || 10000)) * 100), 100)}% achieved)`}
          color={allColors.primary}
          onPress={() => router.push('/steps')}
        />

        <HealthCard
          iconName="moon-outline"
          title="Sleep Tracker"
          value={healthData.sleep}
          unit="hours"
          subtitle="8.0 hrs target • 92% Sleep score"
          color={allColors.secondary}
          onPress={() => router.push('/sleep')}
        />

        <HealthCard
          iconName="flame-outline"
          title="Exercise & Workouts"
          value={healthData.activeMinutes}
          unit="mins"
          subtitle="Active energy burned: 340 kcal"
          color={allColors.warning}
          onPress={() => router.push('/exercise')}
        />

        <HealthCard
          iconName="restaurant-outline"
          title="Nutrition & Meals"
          value={healthData.calories}
          unit="kcal"
          subtitle="3 meals logged • Balanced macros"
          color={allColors.success}
          onPress={() => router.push('/meals')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginTop: 18,
    marginBottom: 8,
  },
});
