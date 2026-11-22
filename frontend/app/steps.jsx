import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Pedometer, Accelerometer } from 'expo-sensors';
import { useTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import Header from '../components/Header';
import ProgressBar from '../components/ProgressBar';

export default function StepsScreen() {
  const { colors, allColors } = useTheme();
  const { healthData, addSteps, updateHealth } = useApp();

  const [customSteps, setCustomSteps] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isLiveWalking, setIsLiveWalking] = useState(false);
  const [walkDuration, setWalkDuration] = useState(0); // in seconds
  const [sessionSteps, setSessionSteps] = useState(0);
  const [sensorType, setSensorType] = useState('Initializing Sensors...'); 
  const [isStationary, setIsStationary] = useState(true);
  const [motionIntensity, setMotionIntensity] = useState(0); // Live G-force delta

  // Animation values
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Sensor state refs to avoid closure stale state & noise
  const isFirstPedometerReadRef = useRef(true);
  const prevPedometerStepsRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const stepStateRef = useRef('IDLE'); // 'IDLE' -> 'PEAK_DETECTED' -> 'VALLEY_DETECTED'
  const smoothedMagRef = useRef(1.0);
  const gravityBaselineRef = useRef(1.0);

  const currentSteps = healthData?.steps || 0;
  const goal = healthData?.stepsGoal || 10000;
  const percentage = Math.min(Math.round((currentSteps / goal) * 100), 100);

  // Dynamic calculations based on current steps
  const distanceKm = (currentSteps * 0.00076).toFixed(2); // Avg stride ~ 0.76m
  const caloriesBurned = Math.round(currentSteps * 0.04); // Avg ~ 0.04 kcal/step
  const activeMinutes = Math.round(currentSteps / 100); // Avg ~ 100 steps/min

  // Pulse animation when live tracking is active and user is moving
  useEffect(() => {
    let animation;
    if (isLiveWalking && !isStationary) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.18,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => animation?.stop();
  }, [isLiveWalking, isStationary]);

  // Session timer (counts elapsed time)
  useEffect(() => {
    let timer = null;
    if (isLiveWalking) {
      timer = setInterval(() => {
        setWalkDuration((prev) => prev + 1);

        // Mark stationary if no step in the last 2.5 seconds
        if (Date.now() - lastStepTimeRef.current > 2500) {
          setIsStationary(true);
        }
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLiveWalking]);

  // Real Hardware Motion Sensor & Pedometer Tracking
  useEffect(() => {
    if (!isLiveWalking) return;

    let pedometerSub = null;
    let accelerometerSub = null;
    let isMounted = true;

    // Reset calibration on starting session
    isFirstPedometerReadRef.current = true;
    prevPedometerStepsRef.current = 0;
    stepStateRef.current = 'IDLE';
    smoothedMagRef.current = 1.0;
    gravityBaselineRef.current = 1.0;

    const startRealMotionTracking = async () => {
      try {
        // 1. Try Hardware Pedometer First
        const isPedometerAvailable = await Pedometer.isAvailableAsync();

        if (isPedometerAvailable && isMounted) {
          const perm = await Pedometer.requestPermissionsAsync();
          if (perm.granted && isMounted) {
            setSensorType('Hardware Pedometer');

            pedometerSub = Pedometer.watchStepCount((result) => {
              if (!isMounted) return;
              const rawSteps = result.steps || 0;

              // Calibrate initial offset (crucial for Android cumulative boot step counter)
              if (isFirstPedometerReadRef.current) {
                prevPedometerStepsRef.current = rawSteps;
                isFirstPedometerReadRef.current = false;
                return;
              }

              const delta = rawSteps - prevPedometerStepsRef.current;
              // Validate delta to filter out negative or corrupt step bursts
              if (delta > 0 && delta < 50) {
                prevPedometerStepsRef.current = rawSteps;
                setSessionSteps((prev) => prev + delta);
                addSteps(delta);
                lastStepTimeRef.current = Date.now();
                setIsStationary(false);
              }
            });
            return;
          }
        }
      } catch (err) {
        console.log('Hardware pedometer not available, using Accelerometer fallback:', err);
      }

      // 2. High-Precision Accelerometer Motion Engine (with Bandpass & Gravity Isolation)
      if (isMounted) {
        setSensorType('Motion Sensor (Accelerometer)');
        Accelerometer.setUpdateInterval(50); // 20 Hz sampling frequency

        accelerometerSub = Accelerometer.addListener(({ x, y, z }) => {
          if (!isMounted) return;

          // Vector Magnitude: sqrt(x^2 + y^2 + z^2)
          const rawMag = Math.sqrt(x * x + y * y + z * z);

          // Low-pass filter to eliminate sensor high-frequency noise & electronic jitter
          smoothedMagRef.current = smoothedMagRef.current * 0.7 + rawMag * 0.3;

          // Slow exponential moving average to isolate steady gravity baseline (1.0g)
          gravityBaselineRef.current = gravityBaselineRef.current * 0.95 + smoothedMagRef.current * 0.05;

          // Pure dynamic acceleration created by body movement / foot strike
          const dynamicDelta = Math.abs(smoothedMagRef.current - gravityBaselineRef.current);
          setMotionIntensity(parseFloat(dynamicDelta.toFixed(2)));

          const now = Date.now();
          const timeSinceLastStep = now - lastStepTimeRef.current;

          // Human walking gait biomechanics:
          // Stationary phone: dynamicDelta is < 0.06g (No steps registered!)
          // Walking footstep: dynamicDelta rises above PEAK (>= 0.28g) and returns below VALLEY (<= 0.09g)
          // Refractory period: Minimum 350ms between steps (~170 steps/min maximum)
          if (stepStateRef.current === 'IDLE') {
            if (dynamicDelta >= 0.28 && timeSinceLastStep > 350) {
              stepStateRef.current = 'PEAK_DETECTED';
            }
          } else if (stepStateRef.current === 'PEAK_DETECTED') {
            if (dynamicDelta <= 0.09) {
              // Full step wave cycle verified!
              stepStateRef.current = 'IDLE';
              lastStepTimeRef.current = now;
              setSessionSteps((prev) => prev + 1);
              addSteps(1);
              setIsStationary(false);
            } else if (timeSinceLastStep > 1500) {
              // Step cycle timed out (e.g. phone was just picked up or shifted position)
              stepStateRef.current = 'IDLE';
            }
          }
        });
      }
    };

    startRealMotionTracking();

    return () => {
      isMounted = false;
      if (pedometerSub) pedometerSub.remove();
      if (accelerometerSub) accelerometerSub.remove();
    };
  }, [isLiveWalking]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleQuickAdd = (amount, label) => {
    addSteps(amount);
    showToast(`+${amount.toLocaleString()} steps added (${label})!`);
  };

  const handleCustomAdd = () => {
    const parsed = parseInt(customSteps, 10);
    if (!isNaN(parsed) && parsed > 0) {
      addSteps(parsed);
      showToast(`+${parsed.toLocaleString()} steps added!`);
      setCustomSteps('');
    }
  };

  const toggleLiveTracking = () => {
    if (isLiveWalking) {
      setIsLiveWalking(false);
      setIsStationary(true);
      showToast(`Walk paused! Logged ${sessionSteps} live steps.`);
    } else {
      setIsLiveWalking(true);
      setSessionSteps(0);
      lastStepTimeRef.current = 0;
      showToast('Live step tracker active! Start walking 🚶‍♂️');
    }
  };

  const handleGoalChange = (newGoal) => {
    updateHealth({ stepsGoal: newGoal });
    showToast(`Daily step goal updated to ${newGoal.toLocaleString()}!`);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Steps & Activity" showBack={true} />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <View style={[styles.toast, { backgroundColor: allColors.primary }]}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sync Status Pill */}
        <View style={[styles.syncBadge, { backgroundColor: `${allColors.success}15`, borderColor: `${allColors.success}40` }]}>
          <View style={[styles.liveDot, { backgroundColor: allColors.success }]} />
          <Text style={[styles.syncText, { color: allColors.success }]}>
            🍃 Real-Time MongoDB Synced
          </Text>
        </View>

        {/* Main Step Counter Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Animated.View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isLiveWalking ? `${allColors.primary}30` : `${allColors.primary}15`,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <Ionicons
              name={isLiveWalking ? 'walk' : 'footsteps'}
              size={40}
              color={allColors.primary}
            />
          </Animated.View>

          <Text style={[styles.value, { color: colors.text }]}>{currentSteps.toLocaleString()}</Text>
          <Text style={[styles.subValue, { color: colors.textSecondary }]}>
            Goal: {goal.toLocaleString()} steps ({percentage}%)
          </Text>

          <ProgressBar progress={percentage} color={allColors.primary} height={12} style={{ marginTop: 18 }} />
        </View>

        {/* Live Step Tracking / Real Sensor Banner */}
        <View
          style={[
            styles.liveSessionCard,
            {
              backgroundColor: isLiveWalking ? `${allColors.primary}12` : colors.card,
              borderColor: isLiveWalking ? allColors.primary : colors.border,
            },
          ]}
        >
          <View style={styles.liveSessionHeader}>
            <View style={styles.liveSessionTitleRow}>
              <View
                style={[
                  styles.liveIndicatorDot,
                  { backgroundColor: isLiveWalking ? (isStationary ? allColors.warning : allColors.success) : colors.textMuted },
                ]}
              />
              <Text style={[styles.liveSessionTitle, { color: colors.text }]}>
                {isLiveWalking
                  ? (isStationary ? 'TRACKER ACTIVE (PHONE STILL)' : 'LIVE WALKING DETECTED')
                  : 'PHYSICAL MOTION STEP TRACKER'}
              </Text>
            </View>
            <Text style={[styles.timerText, { color: allColors.primary }]}>
              {formatTimer(walkDuration)}
            </Text>
          </View>

          {/* Sensor & Motion Status Pills */}
          {isLiveWalking && (
            <View style={styles.sensorStatusRow}>
              <View style={[styles.sensorTag, { backgroundColor: `${allColors.primary}20` }]}>
                <Ionicons name="hardware-chip-outline" size={13} color={allColors.primary} />
                <Text style={[styles.sensorTagText, { color: allColors.primary }]}>{sensorType}</Text>
              </View>

              <View
                style={[
                  styles.sensorTag,
                  {
                    backgroundColor: isStationary ? `${allColors.warning}20` : `${allColors.success}20`,
                  },
                ]}
              >
                <Ionicons
                  name={isStationary ? 'pause-circle' : 'walk'}
                  size={13}
                  color={isStationary ? allColors.warning : allColors.success}
                />
                <Text
                  style={[
                    styles.sensorTagText,
                    { color: isStationary ? allColors.warning : allColors.success },
                  ]}
                >
                  {isStationary ? 'Stable (0 spm)' : 'In Motion (Walking)'}
                </Text>
              </View>

              <View style={[styles.sensorTag, { backgroundColor: colors.border }]}>
                <Ionicons name="pulse-outline" size={13} color={colors.textSecondary} />
                <Text style={[styles.sensorTagText, { color: colors.textSecondary }]}>
                  Force: {motionIntensity.toFixed(2)}g
                </Text>
              </View>
            </View>
          )}

          <Text style={[styles.liveSessionSubtitle, { color: colors.textSecondary }]}>
            {isLiveWalking
              ? `Real device sensors active. Logged +${sessionSteps} physical steps this session. (0 steps when phone is still)`
              : 'Uses real phone hardware sensors. Steps will ONLY increment when you physically move or walk with your device.'}
          </Text>

          <TouchableOpacity
            style={[
              styles.liveTrackerBtn,
              { backgroundColor: isLiveWalking ? allColors.warning : allColors.primary },
            ]}
            onPress={toggleLiveTracking}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isLiveWalking ? 'stop-circle-outline' : 'play-circle-outline'}
              size={22}
              color="#FFF"
            />
            <Text style={styles.liveTrackerBtnText}>
              {isLiveWalking ? 'Stop Live Sensor Tracking' : 'Start Physical Step Tracking'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Activity Metrics Grid */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="map-outline" size={22} color={allColors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{distanceKm} km</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Distance</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="flame-outline" size={22} color={allColors.orange} />
            <Text style={[styles.statValue, { color: colors.text }]}>{caloriesBurned} kcal</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calories</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="time-outline" size={22} color={allColors.teal} />
            <Text style={[styles.statValue, { color: colors.text }]}>{activeMinutes} min</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Time</Text>
          </View>
        </View>

        {/* Quick Step Logging */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>QUICK ADD STEPS</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          Tap to instantly increment steps and sync directly to MongoDB:
        </Text>

        <View style={styles.quickBtnGrid}>
          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickAdd(250, 'Mini Walk')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickBtnCount, { color: allColors.primary }]}>+250</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.textSecondary }]}>Mini Walk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickAdd(500, 'Short Stroll')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickBtnCount, { color: allColors.teal }]}>+500</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.textSecondary }]}>Stroll</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickAdd(1000, 'Brisk Walk')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickBtnCount, { color: allColors.purple }]}>+1,000</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.textSecondary }]}>Brisk Walk</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => handleQuickAdd(2500, 'Jog / Run')}
            activeOpacity={0.7}
          >
            <Text style={[styles.quickBtnCount, { color: allColors.orange }]}>+2,500</Text>
            <Text style={[styles.quickBtnLabel, { color: colors.textSecondary }]}>Jog / Run</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Step Input */}
        <View style={[styles.customInputRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Enter custom steps (e.g. 1500)"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={customSteps}
            onChangeText={setCustomSteps}
            onSubmitEditing={handleCustomAdd}
          />
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: allColors.primary }]}
            onPress={handleCustomAdd}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Goal Target Selector */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>DAILY STEP GOAL</Text>
        <View style={styles.goalChipsRow}>
          {[6000, 8000, 10000, 12000, 15000].map((val) => {
            const isSelected = goal === val;
            return (
              <TouchableOpacity
                key={val}
                style={[
                  styles.goalChip,
                  {
                    backgroundColor: isSelected ? allColors.primary : colors.card,
                    borderColor: isSelected ? allColors.primary : colors.border,
                  },
                ]}
                onPress={() => handleGoalChange(val)}
              >
                <Text style={[styles.goalChipText, { color: isSelected ? '#FFF' : colors.text }]}>
                  {val / 1000}k
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  toast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  toastText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  syncBadge: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    marginBottom: 12,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  syncText: { fontSize: 12, fontWeight: '700' },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: { fontSize: 38, fontWeight: '800', letterSpacing: -0.5 },
  subValue: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  liveSessionCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 18,
  },
  liveSessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  liveSessionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveIndicatorDot: { width: 10, height: 10, borderRadius: 5 },
  liveSessionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  timerText: { fontSize: 16, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  liveSessionSubtitle: { fontSize: 12.5, lineHeight: 17, marginBottom: 14 },
  sensorStatusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    marginBottom: 12,
  },
  sensorTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 5,
  },
  sensorTagText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  liveTrackerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 14,
  },
  liveTrackerBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22 },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 15, fontWeight: '800', marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { fontSize: 12.5, fontWeight: '800', letterSpacing: 0.6, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12.5, marginBottom: 12 },
  quickBtnGrid: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  quickBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickBtnCount: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  quickBtnLabel: { fontSize: 10.5, fontWeight: '600' },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 10,
  },
  input: { flex: 1, height: 44, fontSize: 14, paddingHorizontal: 6 },
  addBtn: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontSize: 14, fontWeight: '700' },
  goalChipsRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  goalChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalChipText: { fontSize: 13, fontWeight: '700' },
});
