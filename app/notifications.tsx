import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';

const notifications = [
  {
    id: '1',
    title: "Don't miss your run",
    subtitle: 'About 3 hours ago',
  },
  {
    id: '2',
    title: 'Add some workout for tomorrow',
    subtitle: 'About 3 hours ago',
  },
];

export default function Notifications() {
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
        avatar: '#23262F',
      }
    : {
        background: '#fff',
        card: '#F6F6F6',
        text: '#222',
        subtext: '#888',
        inputBg: '#F6F6F6',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#F0F0F0',
        avatar: '#C7DBF7',
      };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.headerRow, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.inputBg }]} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notification</Text>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.inputBg }] }>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <View style={styles.notificationRow}>
              <View style={[styles.avatar, { backgroundColor: colors.avatar }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.notificationSubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-vertical" size={18} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
      />
      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
          <MaterialCommunityIcons name="chart-box-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <MaterialCommunityIcons name="home-variant" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/notifications')}>
          <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.activeIconBg}>
            <MaterialCommunityIcons name="bell-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialCommunityIcons name="account-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerBtn: {
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 14,
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  notificationSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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
