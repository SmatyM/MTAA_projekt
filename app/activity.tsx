import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from './config/ThemeContext';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';
import MapView, { Marker, Polyline } from 'react-native-maps';

export default function Activity() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const autoStart = params?.autoStart === 'true';
  const hasAutoStarted = React.useRef(false);
  const { darkMode } = useTheme();

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
        background: '#F6F6F6',
        card: '#fff',
        text: '#222',
        subtext: '#888',
        inputBg: '#F6F6F6',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#E0E0E0',
        white: '#fff',
      };

  // Tracking state
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locations, setLocations] = useState<{ latitude: number; longitude: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const [workoutResult, setWorkoutResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Placeholder stats
  const runningTime = tracking
    ? formatDuration(elapsed)
    : workoutResult
      ? formatDuration(workoutResult.duration)
      : '00:00:00';
  const distance = workoutResult ? `${workoutResult.distance.toFixed(2)} km` : `${(locations.length > 1 ? calcDistance(locations).toFixed(2) : '0.00')} km`;
  const kcal = workoutResult ? `${(workoutResult.distance * 49.5).toFixed(0)} kcal` : `${(calcDistance(locations) * 49.5).toFixed(0)} kcal`;
  const speed = workoutResult ? `${workoutResult.speed.toFixed(2)} km/h` : (locations.length > 1 ? `${(calcSpeed(locations)).toFixed(2)} km/h` : '0.00 km/h');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
    return () => {
      if (locationSubscription.current) locationSubscription.current.remove();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (autoStart && !tracking && !hasAutoStarted.current) {
      hasAutoStarted.current = true;
      handleStart();
    }
  }, [autoStart, tracking]);

  // Start tracking
  const handleStart = async () => {
    setLoading(true);
    setWorkoutResult(null);
    try {
      const token = await AsyncStorage.getItem('firebaseToken');
      const res = await fetch(`${API_URL}/tracking/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to start tracking');
      setLocations([]);
      setStartTime(Date.now());
      setTracking(true);
      // Start location updates
      locationSubscription.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 1 },
        async (loc) => {
          setLocation(loc);
          setLocations((prev) => [...prev, { latitude: loc.coords.latitude, longitude: loc.coords.longitude }]);
          // Send to backend
          const token = await AsyncStorage.getItem('firebaseToken');
          await fetch(`${API_URL}/tracking/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ latitude: loc.coords.latitude, longitude: loc.coords.longitude }),
          });
        }
      );
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
    setLoading(false);
  };

  // Timer effect
  useEffect(() => {
    if (tracking && startTime) {
      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setElapsed(0);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [tracking, startTime]);

  // Stop tracking
  const handleStop = async () => {
    setLoading(true);
    try {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      const token = await AsyncStorage.getItem('firebaseToken');
      const res = await fetch(`${API_URL}/tracking/stop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Failed to stop tracking: ' + errText);
      }
      const data = await res.json();
      setWorkoutResult(data);
      setTracking(false);
      setStartTime(null);
      setElapsed(0);
    } catch (e) {
      Alert.alert('Error', (e as Error).message);
    }
    setLoading(false);
  };

  // Helper: format duration
  function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  // Helper: calculate distance in km
  function calcDistance(coords: { latitude: number; longitude: number }[]) {
    let d = 0;
    for (let i = 1; i < coords.length; i++) {
      d += getDistanceFromLatLonInKm(coords[i-1].latitude, coords[i-1].longitude, coords[i].latitude, coords[i].longitude);
    }
    return d;
  }
  // Helper: calculate speed in km/h
  function calcSpeed(coords: { latitude: number; longitude: number }[]) {
    if (coords.length < 2) return 0;
    // Assume 2s interval
    const totalSeconds = (coords.length - 1) * 2;
    const dist = calcDistance(coords);
    return (dist / (totalSeconds / 3600));
  }
  // Haversine formula
  function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  }
  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Map background */}
      <View style={{ flex: 1 }}>
        {location && (
          <MapView
            style={StyleSheet.absoluteFill}
            region={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="You"
            />
            {locations.length > 1 && (
              <Polyline
                coordinates={locations}
                strokeColor="#08C8F6"
                strokeWidth={4}
              />
            )}
          </MapView>
        )}
        {/* Overlay UI */}
        <View style={[styles.topBar, { position: 'absolute', top: 24, left: 0, right: 0, zIndex: 10 }] }>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Current running</Text>
          <View style={[styles.gpsStatus, { backgroundColor: darkMode ? '#1B5E20' : '#E8F5E9' }] }>
            <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#4CAF50" />
            <Text style={styles.gpsText}>GPS</Text>
          </View>
        </View>
        <View style={[styles.bottomCard, { backgroundColor: colors.card, position: 'absolute', left: 16, right: 16, bottom: 80, zIndex: 10 }] }>
          <View style={styles.timeRow}>
            <View>
              <Text style={[styles.timeLabel, { color: colors.subtext }]}>Running time</Text>
              <Text style={[styles.timeValue, { color: colors.text }]}>{runningTime}</Text>
            </View>
            {loading ? (
              <ActivityIndicator color={colors.blue} />
            ) : tracking ? (
              <TouchableOpacity style={styles.pauseButton} onPress={handleStop}>
                <MaterialCommunityIcons name="stop" size={28} color="#fff" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.pauseButton} onPress={handleStart}>
                <MaterialCommunityIcons name="play" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>{distance}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>{kcal}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: colors.text }]}>{speed}</Text>
            </View>
          </View>
        </View>
        <Text style={{color: colors.text, position: 'absolute', top: 80, left: 16, zIndex: 10}}>Points: {locations.length}</Text>
      </View>
      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
          <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.activeIconBg}>
            <MaterialCommunityIcons name="chart-box-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <MaterialCommunityIcons name="home-variant" size={28} color={colors.blue} />
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
  mapContainer: {
    flex: 1,
    position: 'relative',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  polyline: {
    position: 'absolute',
    top: '30%',
    left: '30%',
    width: '40%',
    height: 2,
    backgroundColor: '#2196F3',
    borderRadius: 1,
  },
  topBar: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
  title: {
    color: '#222',
    fontSize: 18,
    fontWeight: '700',
  },
  gpsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  gpsText: {
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 13,
  },
  bottomCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  timeValue: {
    color: '#222',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 2,
  },
  pauseButton: {
    backgroundColor: '#08C8F6',
    borderRadius: 18,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#222',
    fontWeight: '700',
    fontSize: 16,
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
