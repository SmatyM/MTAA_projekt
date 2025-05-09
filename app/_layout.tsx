import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider } from './config/ThemeContext';
import { UserProvider } from './config/UserContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PaperProvider>
          <Stack />
        </PaperProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

// TODO: Pridať route pre 'trainers' a 'chat' do expo-router, ak používate file-based routing