import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';
import { useUser } from './config/UserContext';

const BMI = 10.1;
const steps = 92;
const km = 1.2;
const stepsGoal = 5971;
const stepsPercent = steps / stepsGoal;

const workouts = [
  { type: 'Run', calories: 200, duration: 30, progress: 0.7 },
  { type: 'Run', calories: 180, duration: 20, progress: 0.4 },
  { type: 'Run', calories: 180, duration: 20, progress: 0.2 },
];

export default function Home() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { user, refreshUser } = useUser();

  const colors = darkMode
    ? {
        background: '#181A20',
        card: '#23262F',
        text: '#fff',
        subtext: '#BDBDBD',
        inputBg: '#23262F',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#23262F',
        white: '#fff',
      }
    : {
        background: '#fff',
        card: '#F6F6F6',
        text: '#222',
        subtext: '#888',
        inputBg: '#F6F6F6',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#E0E0E0',
        white: '#fff',
      };

  // Calculate BMI from user context
  let bmi: string | number = '--';
  if (user && user.height && user.weight && user.height > 0) {
    const heightM = user.height / 100;
    bmi = (user.weight / (heightM * heightM)).toFixed(1);
  }

  // Fetch workouts from backend
  const [savedWorkouts, setSavedWorkouts] = React.useState<any[]>([]);
  const [loadingWorkouts, setLoadingWorkouts] = React.useState(false);
  React.useEffect(() => {
    const fetchWorkouts = async () => {
      setLoadingWorkouts(true);
      try {
        const token = await AsyncStorage.getItem('firebaseToken');
        const res = await fetch(`${API_URL}/tracking/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch workouts');
        const data = await res.json();
        setSavedWorkouts(Array.isArray(data) ? data : []);
      } catch (e) {
        setSavedWorkouts([]);
      }
      setLoadingWorkouts(false);
    };
    fetchWorkouts();
  }, []);

  // Calculate today's steps from activities
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  let todayDistanceKm = 0;
  if (Array.isArray(savedWorkouts)) {
    todayDistanceKm = savedWorkouts
      .filter(w => {
        // Try to get date string from startTime (Firestore or Date)
        let dateStr = '';
        if (w.startTime?._seconds) {
          const d = new Date(w.startTime._seconds * 1000);
          dateStr = d.toISOString().slice(0, 10);
        } else if (w.startTime) {
          const d = new Date(w.startTime);
          dateStr = d.toISOString().slice(0, 10);
        }
        return dateStr === todayStr;
      })
      .reduce((sum, w) => sum + (w.distance || 0), 0);
  }
  const todaySteps = Math.round((todayDistanceKm * 1000) / 0.78);
  const stepsGoal = user?.daily_steps_goal || 5971;
  const stepsPercent = todaySteps / stepsGoal;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.container, { backgroundColor: colors.background }] }>
          {/* Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.welcome, { color: colors.subtext }]}>Welcome Back,</Text>
              <Text style={[styles.name, { color: colors.text }]}>
                {user?.first_name || ''} {user?.last_name || ''}
              </Text>
            </View>
            <TouchableOpacity style={[styles.profileIcon, { backgroundColor: colors.card }] } onPress={() => router.push('/profile')}>
              <MaterialIcons name="person" size={22} color={colors.blue} />
            </TouchableOpacity>
          </View>

          {/* BMI Card */}
          <View style={[styles.bmiCard, { backgroundColor: '#1A1A2E' }] }>
            <View style={{ flex: 1 }}>
              <Text style={styles.bmiLabel}>BMI</Text>
              <Text style={styles.bmiStatus}>You have a normal weight</Text>
            </View>
            <View style={styles.bmiChartContainer}>
              <Svg width={60} height={60}>
                <Circle cx={30} cy={30} r={28} stroke={colors.divider} strokeWidth={6} fill="none" />
                <Circle
                  cx={30}
                  cy={30}
                  r={28}
                  stroke={colors.blue}
                  strokeWidth={6}
                  fill="none"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={(1 - 0.7) * 2 * Math.PI * 28}
                  strokeLinecap="round"
                />
              </Svg>
              <Text style={styles.bmiValue}>{bmi}</Text>
            </View>
          </View>

          {/* Start Activity Card */}
          <View style={[styles.activityCard, { backgroundColor: colors.card }] }>
            <Text style={[styles.activityLabel, { color: colors.text }]}>Start activity</Text>
            <TouchableOpacity onPress={() => router.push({ pathname: '/activity', params: { autoStart: 'true' } })}>
              <LinearGradient
                colors={[colors.blue, '#1A1A2E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Today Progress */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Today Progress</Text>
          <View style={[styles.progressCard, { backgroundColor: colors.card }] }>
            <View style={styles.progressChartContainer}>
              <Svg width={160} height={160}>
                <Circle cx={80} cy={80} r={70} stroke={colors.divider} strokeWidth={16} fill="none" />
                <Circle
                  cx={80}
                  cy={80}
                  r={70}
                  stroke={colors.blue}
                  strokeWidth={16}
                  fill="none"
                  strokeDasharray={2 * Math.PI * 70}
                  strokeDashoffset={(1 - stepsPercent) * 2 * Math.PI * 70}
                  strokeLinecap="round"
                />
              </Svg>
              <View style={styles.progressTextContainer}>
                <Text style={[styles.progressSteps, { color: colors.text }]}>{todaySteps} Steps</Text>
                <Text style={[styles.progressKm, { color: colors.subtext }]}> {todayDistanceKm.toFixed(2)} KM</Text>
              </View>
            </View>
            <Text style={[styles.progressSubtext, { color: colors.subtext }] }>
              {stepsGoal - todaySteps} more steps to complete your daily task
            </Text>
          </View>

          {/* Latest Workout */}
          <View style={styles.latestWorkoutHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest Workout</Text>
            <TouchableOpacity>
              <Text style={[styles.seeMore, { color: colors.blue }]}>See more</Text>
            </TouchableOpacity>
          </View>
          {workouts.map((w, i) => (
            <View key={i} style={[styles.workoutCard, { backgroundColor: colors.white }] }>
              <View style={[styles.workoutIcon, { backgroundColor: colors.card }] }>
                <MaterialCommunityIcons name="run" size={28} color={colors.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.workoutType, { color: colors.text }]}>{w.type}</Text>
                <Text style={[styles.workoutMeta, { color: colors.subtext }]}>{w.calories} Calories Burn | {w.duration}minutes</Text>
                <View style={[styles.workoutProgressBarBg, { backgroundColor: colors.divider }] }>
                  <View style={[styles.workoutProgressBar, { width: `${w.progress * 100}%`, backgroundColor: colors.blue }]} />
                </View>
              </View>
              <TouchableOpacity>
                <MaterialIcons name="more-horiz" size={22} color={colors.icon} />
              </TouchableOpacity>
            </View>
          ))}

          {/* All Saved Workouts from Firestore */}
          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>All Saved Workouts</Text>
          {loadingWorkouts ? (
            <Text style={{ color: colors.text, marginVertical: 8 }}>Loading...</Text>
          ) : savedWorkouts.length === 0 ? (
            <Text style={{ color: colors.subtext, marginVertical: 8 }}>No workouts found.</Text>
          ) : (
            savedWorkouts.map((w, i) => (
              <View key={w.id || i} style={[styles.workoutCard, { backgroundColor: colors.white }] }>
                <View style={[styles.workoutIcon, { backgroundColor: colors.card }] }>
                  <MaterialCommunityIcons name="run" size={28} color={colors.blue} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.workoutType, { color: colors.text }]}>Run</Text>
                  <Text style={[styles.workoutMeta, { color: colors.subtext }]}>Distance: {w.distance?.toFixed(2) || 0} km | Duration: {formatDuration(w.duration)} | Kcal: {(w.distance * 49.5).toFixed(0)} kcal</Text>
                  <Text style={[styles.workoutMeta, { color: colors.subtext }]}>Date: {w.startTime ? new Date(w.startTime._seconds ? w.startTime._seconds * 1000 : w.startTime).toLocaleString() : ''}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
          <MaterialCommunityIcons name="chart-box-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.activeIconBg}>
            <MaterialCommunityIcons name="home-variant" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialCommunityIcons name="account-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  welcome: {
    fontSize: 14,
    fontWeight: '400',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  profileIcon: {
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
  bmiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  bmiLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  bmiStatus: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
  },
  bmiChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  bmiValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    position: 'absolute',
    top: 18,
    left: 20,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  activityLabel: {
    color: '#222',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  sectionTitle: {
    color: '#222',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  progressCard: {
    backgroundColor: '#F6F6F6',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  progressChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressTextContainer: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  progressSteps: {
    color: '#222',
    fontWeight: '700',
    fontSize: 18,
  },
  progressKm: {
    color: '#888',
    fontWeight: '400',
    fontSize: 14,
  },
  progressSubtext: {
    color: '#888',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  latestWorkoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeMore: {
    color: '#008CFF',
    fontWeight: '600',
    fontSize: 13,
  },
  workoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F6F6F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  workoutType: {
    color: '#222',
    fontWeight: '700',
    fontSize: 15,
  },
  workoutMeta: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  workoutProgressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginTop: 2,
    marginBottom: 2,
  },
  workoutProgressBar: {
    height: 6,
    backgroundColor: '#08C8F6',
    borderRadius: 3,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
    paddingBottom: 18,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A6DD1',
    marginTop: 2,
    alignSelf: 'center',
  },
});

// Helper for formatting duration
function formatDuration(seconds: number) {
  if (!seconds) return '00:00:00';
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
}