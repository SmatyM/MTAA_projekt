import { View, Text, TextInput } from 'react-native';
import { Button, TextInput as PaperInput } from 'react-native-paper';

export default function Register() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Create an Account</Text>
      <PaperInput label="First Name" style={{ marginVertical: 10 }} />
      <PaperInput label="Last Name" style={{ marginVertical: 10 }} />
      <PaperInput label="Email" keyboardType="email-address" style={{ marginVertical: 10 }} />
      <PaperInput label="Password" secureTextEntry style={{ marginVertical: 10 }} />
      <Button mode="contained" onPress={() => {}} style={{ marginTop: 20 }}>Register</Button>
    </View>
  );
}