import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from './config/ThemeContext';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Index() {
  const router = useRouter();
  const { darkMode } = useTheme();

  const colors = darkMode
    ? {
        background: '#181A20',
        text: '#fff',
        subtext: '#BDBDBD',
        blue: '#08C8F6',
      }
    : {
        background: '#FFFFFF',
        text: '#000',
        subtext: '#666',
        blue: '#008CFF',
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <Text style={[styles.title, { color: colors.text }]}>FIITness</Text>
      <Text style={[styles.subtitle, { color: colors.subtext }]}>JOIN US TODAY!</Text>
      
      <TouchableOpacity onPress={() => router.push('/register')} style={styles.buttonContainer}>
        <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 30,
    width: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
