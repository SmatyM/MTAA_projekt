import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from 'react-native-paper';

export default function Home() {
  const router = useRouter();
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome Back</Text>
      <Button mode="outlined" onPress={() => router.push('/activity')} style={{ marginVertical: 10 }}>Activity Tracker</Button>
      <Button mode="outlined" onPress={() => router.push('/notifications')} style={{ marginVertical: 10 }}>Notifications</Button>
    </View>
  );
}