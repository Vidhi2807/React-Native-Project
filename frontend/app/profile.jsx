import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { user, updateProfile, tasks, habits, isBackendConnected, syncData, logout } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Vidhi');
  const [tagline, setTagline] = useState(user?.tagline || 'Wellness & Growth Seeker');
  const [avatar, setAvatar] = useState(user?.avatar || '🌸');
  const [isSaving, setIsSaving] = useState(false);

  const avatarOptions = ['🌸', '✨', '🌿', '🧘‍♀️', '🚀', '🌟', '🦄', '💪'];

  const handleSave = async () => {
    setIsSaving(true);
    await updateProfile({ name, tagline, avatar });
    setIsSaving(false);
    setIsEditing(false);
    Alert.alert('Saved', 'Profile updated and synced with backend!');
  };

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const totalStreak = habits.reduce((acc, h) => acc + (h.streak || 0), 0);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="My Profile"
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            style={[styles.editBtn, { backgroundColor: allColors.primary }]}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit'}</Text>
            )}
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Backend Connectivity Status Pill */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: isBackendConnected ? `${allColors.success}15` : `${allColors.warning}15`,
              borderColor: isBackendConnected ? `${allColors.success}40` : `${allColors.warning}40`,
            },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isBackendConnected ? allColors.success : allColors.warning },
            ]}
          />
          <Text
            style={[
              styles.statusText,
              { color: isBackendConnected ? allColors.success : allColors.warning },
            ]}
          >
            {isBackendConnected ? '🍃 MongoDB Backend Connected & Active' : '⚡ Local Offline Mode (Syncing)'}
          </Text>
          <TouchableOpacity onPress={syncData} style={{ marginLeft: 4 }}>
            <Ionicons name="refresh" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={[styles.avatarCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarCircle, { backgroundColor: `${allColors.primary}20` }]}>
            <Text style={styles.avatarEmoji}>{avatar}</Text>
          </View>

          {isEditing ? (
            <View style={styles.editInputs}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CHOOSE AVATAR</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarScroll}>
                {avatarOptions.map((av) => (
                  <TouchableOpacity
                    key={av}
                    onPress={() => setAvatar(av)}
                    style={[
                      styles.avatarPick,
                      {
                        backgroundColor: avatar === av ? `${allColors.primary}30` : colors.cardAlt,
                        borderColor: avatar === av ? allColors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.avatarPickEmoji}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 12 }]}>FULL NAME</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Your Name"
                placeholderTextColor={colors.textMuted}
              />

              <Text style={[styles.inputLabel, { color: colors.textSecondary, marginTop: 12 }]}>PERSONAL TAGLINE</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.cardAlt, borderColor: colors.border, color: colors.text }]}
                value={tagline}
                onChangeText={setTagline}
                placeholder="Personal Tagline"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          ) : (
            <>
              <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Vidhi'}</Text>
              <Text style={[styles.tagline, { color: allColors.primary }]}>{user?.tagline || 'Wellness & Growth Seeker'}</Text>
              <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || 'vidhi@example.com'}</Text>
            </>
          )}

          {/* Mini Stats Banner */}
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.text }]}>{totalStreak}</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>Total Streaks</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: colors.text }]}>
                {completedTasks}/{totalTasks}
              </Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>Tasks Done</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
            <View style={styles.statCol}>
              <Text style={[styles.statVal, { color: allColors.primary }]}>Master</Text>
              <Text style={[styles.statLbl, { color: colors.textSecondary }]}>Level 5</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Settings & Customization</Text>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/theme')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: `${allColors.primary}15` }]}>
              <Ionicons name="color-palette-outline" size={20} color={allColors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Appearance & Dark Mode</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/notification')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: `${allColors.warning}15` }]}>
              <Ionicons name="notifications-outline" size={20} color={allColors.warning} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Reminders & Alerts</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/settings')}
          activeOpacity={0.7}
        >
          <View style={styles.menuLeft}>
            <View style={[styles.menuIcon, { backgroundColor: `${allColors.teal}15` }]}>
              <Ionicons name="settings-outline" size={20} color={allColors.teal} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.text }]}>Data & Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutBtn, { borderColor: `${allColors.danger}40`, backgroundColor: `${allColors.danger}10` }]}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color={allColors.danger} />
          <Text style={[styles.logoutBtnText, { color: allColors.danger }]}>Log Out of Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  editBtn: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, minWidth: 60, alignItems: 'center' },
  editBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    marginBottom: 14,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 11.5, fontWeight: '700' },
  avatarCard: {
    padding: 22,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarEmoji: { fontSize: 42 },
  name: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  tagline: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  email: { fontSize: 13, marginTop: 4 },
  editInputs: { width: '100%', marginVertical: 8 },
  inputLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 0.6, marginBottom: 6 },
  avatarScroll: { flexDirection: 'row', marginBottom: 6 },
  avatarPick: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarPickEmoji: { fontSize: 22 },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statCol: { alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '800' },
  statLbl: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, height: '70%', alignSelf: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3, marginBottom: 12 },
  menuItem: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600' },
  logoutBtn: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  logoutBtnText: { fontSize: 14, fontWeight: '700' },
});
