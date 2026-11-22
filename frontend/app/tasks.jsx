import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';

export default function TasksScreen() {
  const router = useRouter();
  const { colors, allColors } = useTheme();
  const { tasks, toggleTask } = useApp();
  const [filter, setFilter] = useState('All'); // All, Pending, Completed

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Tasks & Goals"
        subtitle={`${completedCount} of ${tasks.length} done`}
        showBack={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/add-task')}
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFF" />
            <Text style={styles.addBtnText}>New</Text>
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={[styles.filterBar, { borderBottomColor: colors.borderLight }]}>
        {['All', 'Pending', 'Completed'].map((tab) => {
          const isSelected = filter === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setFilter(tab)}
              style={[
                styles.filterTab,
                isSelected && [styles.filterTabActive, { borderBottomColor: allColors.primary }],
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: isSelected ? allColors.primary : colors.textSecondary },
                  isSelected && styles.filterTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.content}>
        <FlatList
          data={filteredTasks}
          keyExtractor={(item, idx) => item.id || item._id || `task_${idx}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TaskCard
              title={item.title}
              category={item.category}
              priority={item.priority}
              time={item.time}
              completed={item.completed}
              onToggle={() => toggleTask(item.id || item._id)}
              onPress={() => router.push({ pathname: '/edit-task', params: { id: item.id || item._id } })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: `${allColors.primary}15` }]}>
                <Ionicons name="checkbox-outline" size={40} color={allColors.primary} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {filter === 'Completed' ? 'No Completed Tasks Yet' : 'All Clear!'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {filter === 'Completed'
                  ? 'Complete some of your daily goals to see them here.'
                  : 'You have no pending tasks. Take a breath or add a new goal!'}
              </Text>
              <TouchableOpacity
                style={[styles.emptyAddBtn, { backgroundColor: allColors.primary }]}
                onPress={() => router.push('/add-task')}
              >
                <Text style={styles.emptyAddBtnText}>+ Add Task</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 2,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {
    borderBottomWidth: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterTextActive: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyContainer: {
    paddingTop: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  emptyAddBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyAddBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
