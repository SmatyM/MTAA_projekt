import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';

export default function Activity() {
  const router = useRouter();
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

  // Placeholder stats
  const runningTime = '01:09:44';
  const distance = '10,9 km';
  const kcal = '539 kcal';
  const speed = '12,3 km/h';

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Map background placeholder */}
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://static-maps.yandex.ru/1.x/?ll=30.516667,50.433333&z=13&l=map&size=450,450' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        {/* Polyline placeholder (could use react-native-maps Polyline in real app) */}
        <View style={[styles.polyline, { backgroundColor: colors.blue }]} />
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back-ios" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Current running</Text>
          <View style={[styles.gpsStatus, { backgroundColor: darkMode ? '#1B5E20' : '#E8F5E9' }]}>
            <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#4CAF50" />
            <Text style={styles.gpsText}>GPS</Text>
          </View>
        </View>
      </View>
      {/* Bottom card */}
      <View style={[styles.bottomCard, { backgroundColor: colors.card }]}>
        <View style={styles.timeRow}>
          <View>
            <Text style={[styles.timeLabel, { color: colors.subtext }]}>Running time</Text>
            <Text style={[styles.timeValue, { color: colors.text }]}>{runningTime}</Text>
          </View>
          <TouchableOpacity style={styles.pauseButton}>
            <MaterialCommunityIcons name="pause" size={28} color="#fff" />
          </TouchableOpacity>
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
