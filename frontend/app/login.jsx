import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { login } = useApp();

  const [email, setEmail] = useState('vidhi@example.com');
  const [password, setPassword] = useState('wellness_password_2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await login(email.trim(), password);
      setIsLoading(false);
      if (result.success) {
        router.replace('/');
      } else {
        setErrorMsg(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Error connecting to server');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Welcome Back" showBack={true} />
      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: `${allColors.primary}15` }]}>
          <Ionicons name="sparkles" size={32} color={allColors.primary} />
        </View>

        <Text style={[styles.heading, { color: colors.text }]}>Sign In</Text>
        <Text style={[styles.subheading, { color: colors.textSecondary }]}>
          Access your synchronized wellness & daily growth dashboard.
        </Text>

        {errorMsg && (
          <View style={[styles.errorBanner, { backgroundColor: `${allColors.danger}15`, borderColor: `${allColors.danger}40` }]}>
            <Ionicons name="alert-circle" size={18} color={allColors.danger} />
            <Text style={[styles.errorText, { color: allColors.danger }]}>{errorMsg}</Text>
          </View>
        )}

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 24 }]}>EMAIL ADDRESS</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="your@email.com"
          placeholderTextColor={colors.textMuted}
          value={email}
          onChangeText={(val) => {
            setEmail(val);
            setErrorMsg(null);
          }}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: colors.textSecondary, marginTop: 16 }]}>PASSWORD</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="••••••••"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            setErrorMsg(null);
          }}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: allColors.primary }]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Log In to Dashboard</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')} style={styles.link}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]}>
            Don't have an account? <Text style={{ color: allColors.primary, fontWeight: '700' }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 24 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heading: { fontSize: 26, fontWeight: '800', letterSpacing: -0.4 },
  subheading: { fontSize: 14, marginTop: 4, lineHeight: 20 },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  errorText: { fontSize: 13, fontWeight: '600', flex: 1 },
  label: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, fontSize: 16 },
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { fontSize: 14 },
});
