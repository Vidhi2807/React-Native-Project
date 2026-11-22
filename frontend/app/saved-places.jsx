import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function SavedPlacesScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { places, deletePlace } = useApp();

  const icons = ['home', 'fitness', 'leaf', 'cafe', 'briefcase', 'heart'];

  const handleDeletePlace = (id, title) => {
    Alert.alert('Delete Spot', `Remove "${title}" from your saved wellness spots?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deletePlace(id);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Saved Places"
        subtitle={`${places.length} favorite spots`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/location')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <FlatList
          data={places}
          keyExtractor={(item, idx) => item.id || item._id || idx.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.iconCircle, { backgroundColor: `${allColors.primary}15` }]}>
                <Ionicons name={icons[index % icons.length]} size={22} color={allColors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.coords, { color: colors.textSecondary }]}>
                  {item.address || `${item.latitude?.toFixed(4) || '37.7749'}, ${item.longitude?.toFixed(4) || '-122.4194'}`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleDeletePlace(item.id || item._id, item.title)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={18} color={allColors.danger} />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📍</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Places Yet</Text>
              <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
                Pin your favorite meditation parks, gyms, and quiet spots.
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/location')}
              >
                <Text style={styles.emptyBtnText}>+ Pin Current Location</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: '700' },
  coords: { fontSize: 12, marginTop: 2, fontWeight: '500' },
  deleteBtn: { padding: 8 },
  emptyContainer: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 20 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center', marginBottom: 18 },
  emptyBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  emptyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
