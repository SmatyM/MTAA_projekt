import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { API_URL } from './config/api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Conversation {
  trainerId: number;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export default function Chats() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Fetching conversations from backend...');
      const res = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setConversations([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      console.log('Conversations received from backend:', data);
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      setConversations([]);
    }
    setLoading(false);
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.threadRow}
      onPress={() => router.push({ pathname: '/chat', params: { trainerId: item.trainerId } })}
    >
      <Text style={styles.threadName}>{(item.first_name || '') + ' ' + (item.last_name || '')} ({item.email})</Text>
      <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage || 'Žiadna správa'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Moje chaty</Text>
      {loading ? <ActivityIndicator /> : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.trainerId.toString()}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 32 }}>Žiadne chaty</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  threadRow: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  threadName: { fontSize: 16, fontWeight: 'bold' },
  lastMsg: { fontSize: 14, color: '#888', marginTop: 4 },
}); 