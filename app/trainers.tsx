import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { API_URL } from './config/api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Trainers() {
  const [trainers, setTrainers] = useState<{id: number, email: string, first_name?: string, last_name?: string}[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchTrainers();
    AsyncStorage.getItem('role').then(setRole);
  }, [search]);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/trainers?q=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setTrainers(prev => Array.isArray(prev) ? prev : []);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setTrainers(Array.isArray(data) ? data : []);
    } catch (err) {
      setTrainers([]);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vyhľadaj trénera</Text>
      <TextInput
        style={styles.input}
        placeholder="Zadaj meno alebo email"
        value={search}
        onChangeText={setSearch}
      />
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={trainers}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.trainerRow} onPress={() => router.push({ pathname: '/chat', params: { trainerId: item.id } })}>
              <Text style={styles.trainerEmail}>{item.first_name || ''} {item.last_name || ''} ({item.email})</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 16 },
  trainerRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  trainerEmail: { fontSize: 16 },
});
