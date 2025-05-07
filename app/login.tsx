import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './config/ThemeContext';
import { API_URL } from './config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      }
    : {
        background: '#fff',
        card: '#F6F6F6',
        text: '#222',
        subtext: '#888',
        inputBg: '#F6F6F6',
        icon: '#BDBDBD',
        blue: '#08C8F6',
      };

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('firebaseToken', data.firebaseToken);
      }
        alert('Login successful!');
        router.push('/home');
      } else {
        const data = await response.json();
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.greeting, { color: colors.text }]}>Hey there,</Text>
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      <View style={[styles.divider, { backgroundColor: colors.card }]} />
      <View style={styles.inputContainer}>
        <TextInput
          mode="flat"
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Email"
          placeholderTextColor={colors.subtext}
          value={email}
          onChangeText={setEmail}
          left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email-outline" size={20} color={colors.icon} />} />}
          underlineColor="transparent"
          theme={{ colors: { background: colors.inputBg, text: colors.text } }}
        />
        <TextInput
          mode="flat"
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Password"
          placeholderTextColor={colors.subtext}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          left={<TextInput.Icon icon={() => <MaterialIcons name="lock-outline" size={20} color={colors.icon} />} />}
          right={<TextInput.Icon icon={() => (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.icon} />
            </TouchableOpacity>
          )} />}
          underlineColor="transparent"
          theme={{ colors: { background: colors.inputBg, text: colors.text } }}
        />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogin}>
        <LinearGradient
          colors={[colors.blue, '#1A1A2E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.orRow}>
        <View style={[styles.orDivider, { backgroundColor: colors.card }]} />
        <Text style={[styles.orText, { color: colors.subtext }]}>Or</Text>
        <View style={[styles.orDivider, { backgroundColor: colors.card }]} />
      </View>
      <View style={styles.registerRow}>
        <Text style={[styles.registerText, { color: colors.text }]}>Want a new account? </Text>
        <Text style={styles.registerLink} onPress={() => router.push('/register')}>Register</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },
  greeting: {
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '400',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 18,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  orDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 14,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    color: '#222',
    fontSize: 14,
  },
  registerLink: {
    color: '#008CFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
