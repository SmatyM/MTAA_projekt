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

// TODO: Pridať route pre 'trainers' a 'chat' do expo-router, ak používate file-based routing