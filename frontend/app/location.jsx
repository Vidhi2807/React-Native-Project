import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { locationService } from '../services/locationService';
import Header from '../components/Header';

export default function LocationScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { savePlace, places } = useApp();

  const [location, setLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLocating(true);
      await locationService.requestPermission();
      const loc = await locationService.getCurrentLocation();
      setLocation(loc);
      setIsLocating(false);
    };
    fetchLocation();
  }, []);

  const handleSaveCurrentPlace = async () => {
    if (!location) return;
    const title = placeName.trim() || 'My Favorite Spot';
    setIsSaving(true);
    await savePlace({
      title,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || 'San Francisco, CA',
    });
    setIsSaving(false);
    setPlaceName('');
    Alert.alert('Saved!', `"${title}" has been saved to your wellness spots.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Location & Places"
        subtitle="Track your wellness spots"
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/saved-places')}
            style={[styles.placesBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="bookmark-outline" size={16} color={allColors.primary} />
            <Text style={[styles.placesBtnText, { color: allColors.primary }]}>Saved ({places.length})</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.pinCircle, { backgroundColor: `${allColors.success}15` }]}>
            <Ionicons name="location" size={40} color={allColors.success} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Current Location</Text>
          {isLocating ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <ActivityIndicator color={allColors.primary} size="small" />
              <Text style={[styles.coords, { color: colors.textSecondary }]}>Locating GPS coordinates...</Text>
            </View>
          ) : location ? (
            <>
              <Text style={[styles.address, { color: allColors.primary }]}>{location.address}</Text>
              <Text style={[styles.coords, { color: colors.textSecondary }]}>
                {location.latitude.toFixed(4)}° N, {Math.abs(location.longitude).toFixed(4)}° W
              </Text>
            </>
          ) : (
            <Text style={[styles.coords, { color: colors.textSecondary }]}>Location unavailable</Text>
          )}
        </View>

        {/* Save Place Input Box */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>SAVE THIS LOCATION</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. Zen Meditation Park"
          placeholderTextColor={colors.textMuted}
          value={placeName}
          onChangeText={setPlaceName}
        />

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: allColors.primary }]}
          onPress={handleSaveCurrentPlace}
          disabled={isSaving || !location}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="#FFF" />
              <Text style={styles.saveBtnText}>Save to Wellness Spots</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.savedBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => router.push('/saved-places')}
          activeOpacity={0.8}
        >
          <Ionicons name="bookmarks-outline" size={18} color={allColors.primary} />
          <Text style={[styles.savedBtnText, { color: colors.text }]}>View All Saved Spots ({places.length})</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  placesBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  placesBtnText: { fontSize: 13, fontWeight: '700' },
  card: {
    padding: 26,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  pinCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '800' },
  address: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  coords: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 8 },
  input: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 12,
  },
  saveBtn: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 12,
  },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  savedBtn: {
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  savedBtnText: { fontSize: 14, fontWeight: '700' },
});
