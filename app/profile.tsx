import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';
import { useUser } from './config/UserContext';

// This will be provided by backend later
const isTrainer = true; // Change to true to see trainer view

export default function Profile() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useTheme();
  const { refreshUser } = useUser();

  // State for profile fields
  const [height, setHeight] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
      };

  // Save profile handler
  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/user/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          date_of_birth: dateOfBirth || null,
        }),
      });
      if (res.ok) {
        alert('Profile saved!');
        await refreshUser();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save profile');
      }
    } catch (err) {
      alert('Network error');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
          <TouchableOpacity style={[styles.profileIcon, { backgroundColor: colors.card }] } onPress={() => router.push('/settings')}>
            <MaterialCommunityIcons name="cog-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>
        {/* Form Fields */}
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="account-outline" size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            mode="flat"
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Height"
            placeholderTextColor={colors.subtext}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            underlineColor="transparent"
            theme={{ colors: { background: colors.inputBg, text: colors.text } }}
            right={<TextInput.Icon icon={() => <Text style={[styles.inputUnit, { color: colors.blue }]}>CM</Text>} />}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="calendar-month-outline" size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            mode="flat"
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Date of Birth (YYYY-MM-DD)"
            placeholderTextColor={colors.subtext}
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            underlineColor="transparent"
            theme={{ colors: { background: colors.inputBg, text: colors.text } }}
          />
        </View>
        <View style={styles.inputRow}>
          <MaterialCommunityIcons name="weight-kilogram" size={20} color={colors.icon} style={styles.inputIcon} />
          <TextInput
            mode="flat"
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="Your Weight"
            placeholderTextColor={colors.subtext}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            underlineColor="transparent"
            theme={{ colors: { background: colors.inputBg, text: colors.text } }}
            right={<TextInput.Icon icon={() => <Text style={[styles.inputUnit, { color: colors.blue }]}>KG</Text>} />}
          />
        </View>
        {/* Save Button */}
        <TouchableOpacity style={{ marginTop: 10, alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }} onPress={handleSaveProfile} disabled={loading}>
          <LinearGradient
            colors={[colors.blue, '#1A1A2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* Dark Mode Toggle */}
        <Text style={[styles.sectionLabel, { color: colors.subtext }]}>Dark Mode</Text>
        <View style={styles.switchRow}>
          <TouchableOpacity
            style={[styles.switchButton, !darkMode && styles.switchButtonActive, { backgroundColor: !darkMode ? colors.blue : colors.card }]}
            onPress={() => setDarkMode(false)}
          >
            <Text style={[styles.switchText, !darkMode && styles.switchTextActive, { color: !darkMode ? '#fff' : colors.subtext }]}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switchButton, darkMode && styles.switchButtonActive, { backgroundColor: darkMode ? colors.blue : colors.card }]}
            onPress={() => setDarkMode(true)}
          >
            <Text style={[styles.switchText, darkMode && styles.switchTextActive, { color: darkMode ? '#fff' : colors.subtext }]}>Dark</Text>
          </TouchableOpacity>
        </View>
        {/* Trainer/User Section */}
        {!isTrainer ? (
          <TouchableOpacity style={styles.findTrainerButton}>
            <LinearGradient
              colors={[colors.blue, '#1A1A2E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientButton}
            >
              <Text style={styles.buttonText}>Find trainer</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={styles.trainerRow}>
            <TextInput
              mode="flat"
              style={[styles.trainerInput, { backgroundColor: colors.inputBg, color: colors.text }]}
              value="Name Name"
              underlineColor="transparent"
              theme={{ colors: { background: colors.inputBg, text: colors.text } }}
              editable={false}
              left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="account-outline" size={20} color={colors.icon} />} />}
            />
            <TouchableOpacity style={styles.removeButton}>
              <LinearGradient
                colors={[colors.blue, '#1A1A2E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Remove</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
          <MaterialCommunityIcons name="chart-box-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <MaterialCommunityIcons name="home-variant" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.activeIconBg}>
            <MaterialCommunityIcons name="account-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.activeDot} />
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
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#222',
    fontSize: 20,
    fontWeight: '700',
  },
  profileIcon: {
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 8,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    fontSize: 16,
    height: 44,
  },
  inputUnit: {
    color: '#008CFF',
    fontWeight: '700',
    fontSize: 13,
    marginRight: 8,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  switchButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  switchButtonActive: {
    backgroundColor: '#08C8F6',
  },
  switchText: {
    color: '#888',
    fontWeight: '600',
    fontSize: 15,
  },
  switchTextActive: {
    color: '#fff',
  },
  findTrainerButton: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  gradientButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  trainerInput: {
    flex: 1,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    fontSize: 16,
    height: 44,
    marginRight: 8,
  },
  removeButton: {
    alignSelf: 'flex-end',
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
