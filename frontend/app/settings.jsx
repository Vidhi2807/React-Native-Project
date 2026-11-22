import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { storageService } from '../services/storageService';
import Header from '../components/Header';

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, allColors, isDarkMode } = useTheme();

  const handleClearData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to reset all stored habits, tasks, and journals?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await storageService.clear();
            Alert.alert('Reset Complete', 'App data has been cleared.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Preferences & Data" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>CUSTOMIZATION</Text>

        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/theme')}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={20} color={allColors.primary} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Appearance</Text>
          </View>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
            {isDarkMode ? 'Dark Mode' : 'Light Mode'} ›
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/notification')}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="notifications-outline" size={20} color={allColors.warning} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Reminders & Alerts</Text>
          </View>
          <Text style={[styles.rowValue, { color: colors.textSecondary }]}>Enabled ›</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: colors.textSecondary, marginTop: 24 }]}>EXPERIENCE & DATA</Text>

        <TouchableOpacity
          style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/onboarding')}
          activeOpacity={0.7}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="sparkles-outline" size={20} color={allColors.purple} />
            <Text style={[styles.rowLabel, { color: colors.text }]}>Replay Onboarding</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.dangerRow, { backgroundColor: `${allColors.danger}10`, borderColor: `${allColors.danger}30` }]}
          onPress={handleClearData}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={allColors.danger} />
          <Text style={[styles.dangerText, { color: allColors.danger }]}>Clear Stored Cache & Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  sectionHeader: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 4 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, fontWeight: '600' },
  rowValue: { fontSize: 13, fontWeight: '500' },
  dangerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
  },
  dangerText: { fontSize: 15, fontWeight: '700' },
});
