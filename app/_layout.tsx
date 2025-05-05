import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './config/ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <Stack />
      </PaperProvider>
    </ThemeProvider>
  );
}