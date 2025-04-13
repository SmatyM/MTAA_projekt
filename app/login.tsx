import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, TextInput as PaperInput } from 'react-native-paper';

export default function Login() {
  const router = useRouter();
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Login</Text>
      <PaperInput label="Email" keyboardType="email-address" style={{ marginVertical: 10 }} />
      <PaperInput label="Password" secureTextEntry style={{ marginVertical: 10 }} />
      <Button mode="contained" onPress={() => router.push('/home')} style={{ marginTop: 20 }}>Login</Button>
    </View>
  );
}
