import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';

export default function MealsScreen() {
  const { colors, allColors } = useTheme();
  const { healthData, updateHealth } = useApp();
  const [customCal, setCustomCal] = useState('');

  const currentCalories = healthData?.calories || 1920;

  const handleAddCalories = (amount) => {
    const newCal = Math.max(0, currentCalories + amount);
    updateHealth({ calories: newCal });
  };

  const handleCustomAdd = () => {
    const val = parseInt(customCal, 10);
    if (!isNaN(val) && val > 0) {
      handleAddCalories(val);
      setCustomCal('');
      Alert.alert('Meal Logged', `+${val} kcal recorded for today.`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Nutrition & Meals" showBack={true} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.iconCircle, { backgroundColor: `${allColors.success}15` }]}>
            <Ionicons name="restaurant" size={36} color={allColors.success} />
          </View>
          <Text style={[styles.title, { color: colors.textSecondary }]}>Total Intake Today</Text>
          <Text style={[styles.value, { color: colors.text }]}>{currentCalories} kcal</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Daily balance target: 2,100 kcal</Text>
        </View>

        {/* Quick Log Meals */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>QUICK ADD MEAL CALORIES</Text>
        <View style={styles.quickGrid}>
          {[
            { label: 'Snack / Fruit', cal: 150, emoji: '🍎' },
            { label: 'Light Breakfast', cal: 350, emoji: '🥑' },
            { label: 'Balanced Lunch', cal: 550, emoji: '🥗' },
            { label: 'Dinner', cal: 650, emoji: '🍲' },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.quickCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleAddCalories(item.cal)}
              activeOpacity={0.7}
            >
              <Text style={styles.quickEmoji}>{item.emoji}</Text>
              <Text style={[styles.quickLabel, { color: colors.text }]}>{item.label}</Text>
              <Text style={[styles.quickCal, { color: allColors.success }]}>+{item.cal} kcal</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Calorie Input */}
        <View style={[styles.customRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Custom calories (e.g. 420)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={customCal}
            onChangeText={setCustomCal}
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: allColors.success }]}
            onPress={handleCustomAdd}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Meal Ideas & Examples</Text>
        
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.mealEmoji}>🥑</Text>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>Power Breakfast</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Avocado sourdough toast & boiled eggs • 480 kcal</Text>
          </View>
        </View>

        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={styles.mealEmoji}>🥗</Text>
          <View style={styles.itemInfo}>
            <Text style={[styles.itemTitle, { color: colors.text }]}>Mediterranean Salad</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Grilled paneer, quinoa, olives & greens • 680 kcal</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: { fontSize: 14, fontWeight: '600' },
  value: { fontSize: 36, fontWeight: '800', marginVertical: 4 },
  subtitle: { fontSize: 13, fontWeight: '500' },
  sectionTitle: { fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: 10 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  quickCard: {
    width: '48%',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  quickEmoji: { fontSize: 24 },
  quickLabel: { fontSize: 13, fontWeight: '700' },
  quickCal: { fontSize: 12, fontWeight: '700' },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 10,
  },
  input: { flex: 1, height: 44, fontSize: 14 },
  addBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  addBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  item: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealEmoji: { fontSize: 28, marginRight: 14 },
  itemInfo: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: '700' },
  itemSub: { fontSize: 12, marginTop: 2 },
});
