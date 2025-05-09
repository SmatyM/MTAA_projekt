import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';
import { useUser } from './config/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';

export default function Settings() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { user, refreshUser } = useUser();
  const [stepsGoal, setStepsGoal] = React.useState(user?.daily_steps_goal ? String(user.daily_steps_goal) : '');
  const [distanceGoal, setDistanceGoal] = React.useState(user?.daily_distance_goal ? String(user.daily_distance_goal) : '');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setStepsGoal(user?.daily_steps_goal ? String(user.daily_steps_goal) : '');
    setDistanceGoal(user?.daily_distance_goal ? String(user.daily_distance_goal) : '');
  }, [user]);

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

  const handleSave = async () => {
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
          daily_steps_goal: stepsGoal ? parseInt(stepsGoal) : null,
          daily_distance_goal: distanceGoal ? parseFloat(distanceGoal) : null,
        }),
      });
      if (res.ok) {
        await refreshUser();
        Alert.alert('Success', 'Settings saved!');
      } else {
        const data = await res.json();
        Alert.alert('Error', data.error || 'Failed to save settings');
      }
    } catch (err) {
      Alert.alert('Network error');
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: colors.background }] }>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={styles.inputRow}>
          <Text style={[styles.label, { color: colors.text }]}>Daily Steps Goal</Text>
          <TextInput
            mode="flat"
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="e.g. 6000"
            placeholderTextColor={colors.subtext}
            value={stepsGoal}
            onChangeText={setStepsGoal}
            keyboardType="numeric"
            underlineColor="transparent"
            theme={{ colors: { background: colors.inputBg, text: colors.text } }}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={[styles.label, { color: colors.text }]}>Daily Distance Goal (km)</Text>
          <TextInput
            mode="flat"
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            placeholder="e.g. 5.0"
            placeholderTextColor={colors.subtext}
            value={distanceGoal}
            onChangeText={setDistanceGoal}
            keyboardType="numeric"
            underlineColor="transparent"
            theme={{ colors: { background: colors.inputBg, text: colors.text } }}
          />
        </View>
        <TouchableOpacity style={{ marginTop: 20, alignSelf: 'flex-start', opacity: loading ? 0.7 : 1 }} onPress={handleSave} disabled={loading}>
          <LinearGradient
            colors={[colors.blue, '#1A1A2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.saveButton}
          >
            <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
          </LinearGradient>
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
  title: {
    color: '#222',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
  inputRow: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    fontSize: 16,
    height: 44,
    marginBottom: 4,
    paddingHorizontal: 8,
  },
  saveButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
}); 