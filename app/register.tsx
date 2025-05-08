import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { TextInput, Checkbox } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from './config/ThemeContext';
import { API_URL } from './config/api';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTrainer, setIsTrainer] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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

  const handleRegister = async () => {
    if (!acceptTerms) {
      alert('You must accept the terms.');
      return;
    }
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          role: isTrainer ? 'trainer' : 'user',
          first_name: firstName,
          last_name: lastName,
        }),
      });
      if (response.ok) {
        alert('Registration successful!');
        router.push('/login');
      } else {
        const data = await response.json();
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.greeting, { color: colors.text }]}>Hey there,</Text>
      <Text style={[styles.title, { color: colors.text }]}>Create an Account</Text>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />
      <View style={styles.inputContainer}>
        <TextInput
          mode="flat"
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="First Name"
          placeholderTextColor={colors.subtext}
          value={firstName}
          onChangeText={setFirstName}
          left={<TextInput.Icon icon={() => <MaterialIcons name="person-outline" size={20} color={colors.icon} />} />}
          underlineColor="transparent"
          theme={{ colors: { background: colors.inputBg, text: colors.text } }}
        />
        <TextInput
          mode="flat"
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
          placeholder="Last Name"
          placeholderTextColor={colors.subtext}
          value={lastName}
          onChangeText={setLastName}
          left={<TextInput.Icon icon={() => <MaterialIcons name="person-outline" size={20} color={colors.icon} />} />}
          underlineColor="transparent"
          theme={{ colors: { background: colors.inputBg, text: colors.text } }}
        />
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
      <View style={styles.checkboxRow}>
        <Checkbox.Android
          status={isTrainer ? 'checked' : 'unchecked'}
          onPress={() => setIsTrainer(!isTrainer)}
          color={colors.blue}
        />
        <Text style={[styles.checkboxLabel, { color: colors.text }]}>I&apos;m trainer</Text>
      </View>
      <View style={styles.checkboxRow}>
        <Checkbox.Android
          status={acceptTerms ? 'checked' : 'unchecked'}
          onPress={() => setAcceptTerms(!acceptTerms)}
          color={colors.blue}
        />
        <Text style={[styles.checkboxLabel, { color: colors.text }] }>
          By continuing you accept our{' '}
          <Text style={[styles.link, { color: colors.blue }]} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>Privacy Policy</Text>
          {' '}and{' '}
          <Text style={[styles.link, { color: colors.blue }]} onPress={() => Linking.openURL('https://your-terms-url.com')}>Term of Use</Text>
        </Text>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleRegister}>
        <LinearGradient
          colors={[colors.blue, '#1A1A2E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Register</Text>
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.orRow}>
        <View style={[styles.orDivider, { backgroundColor: colors.divider }]} />
        <Text style={[styles.orText, { color: colors.subtext }]}>Or</Text>
        <View style={[styles.orDivider, { backgroundColor: colors.divider }]} />
      </View>
      <View style={styles.loginRow}>
        <Text style={[styles.loginText, { color: colors.text }]}>Already have an account? </Text>
        <Text style={[styles.loginLink, { color: colors.blue }]} onPress={() => router.push('/login')}>Login</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    justifyContent: 'flex-start',
  },
  greeting: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '400',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginBottom: 18,
  },
  inputContainer: {
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    textDecorationLine: 'underline',
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
  },
  orText: {
    marginHorizontal: 8,
    fontSize: 14,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontWeight: '600',
    fontSize: 14,
  },
});