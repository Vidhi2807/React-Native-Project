import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { cameraService } from '../services/cameraService';
import Header from '../components/Header';

export default function CameraScreen() {
  const { colors, allColors } = useTheme();
  const [photoStatus, setPhotoStatus] = useState(null);

  const handleCapture = async () => {
    await cameraService.requestPermission();
    await cameraService.takePhoto();
    setPhotoStatus('Moment captured & saved to memories! 📸');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Camera & Moments" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.viewfinder, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.camIcon, { backgroundColor: `${allColors.orange}15` }]}>
            <Ionicons name="camera" size={44} color={allColors.orange} />
          </View>
          <Text style={[styles.camText, { color: colors.text }]}>Visual Life Journal</Text>
          <Text style={[styles.camSub, { color: colors.textSecondary }]}>
            Snap photos of your meals, workouts, or peaceful moments.
          </Text>
          {photoStatus && (
            <View style={[styles.statusBadge, { backgroundColor: `${allColors.success}15` }]}>
              <Ionicons name="checkmark-circle" size={16} color={allColors.success} />
              <Text style={[styles.statusText, { color: allColors.success }]}>{photoStatus}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.snapButton, { backgroundColor: allColors.primary }]}
          onPress={handleCapture}
          activeOpacity={0.8}
        >
          <Ionicons name="camera-outline" size={20} color="#FFF" />
          <Text style={styles.snapText}>Take Photo</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, alignItems: 'center' },
  viewfinder: {
    width: '100%',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    marginBottom: 28,
  },
  camIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  camText: { fontSize: 18, fontWeight: '800' },
  camSub: { fontSize: 13, textAlign: 'center', marginTop: 4, lineHeight: 18 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  statusText: { fontSize: 13, fontWeight: '700' },
  snapButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  snapText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
