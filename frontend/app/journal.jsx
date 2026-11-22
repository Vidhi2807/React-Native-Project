import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function JournalScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { journals } = useApp();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Mindful Journal"
        subtitle={`${journals.length} reflections saved`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/add-journal')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color="#FFF" />
            <Text style={styles.addBtnText}>Write</Text>
          </TouchableOpacity>
        }
      />
      <View style={styles.content}>
        <FlatList
          data={journals}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push({ pathname: '/journal-details', params: { id: item.id } })}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.tagBadge, { backgroundColor: `${allColors.purple}15` }]}>
                  <Text style={[styles.tagText, { color: allColors.purple }]}>{item.tag || 'Reflections'}</Text>
                </View>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
              </View>

              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.preview, { color: colors.textSecondary }]} numberOfLines={2}>
                {item.content}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: `${allColors.purple}15` }]}>
                <Ionicons name="book-outline" size={38} color={allColors.purple} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Start Your Reflection</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Journaling clears the mind and captures the moments that matter most.
              </Text>
              <TouchableOpacity
                style={[styles.emptyBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/add-journal')}
              >
                <Text style={styles.emptyBtnText}>+ Write First Entry</Text>
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
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  content: { flex: 1, padding: 16 },
  card: {
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: { fontSize: 11, fontWeight: '700' },
  date: { fontSize: 12, fontWeight: '500' },
  title: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  preview: { fontSize: 14, lineHeight: 20 },
  emptyContainer: { paddingTop: 60, alignItems: 'center', paddingHorizontal: 24 },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  emptyBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 14 },
  emptyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
});
