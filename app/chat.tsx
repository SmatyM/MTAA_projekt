import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { API_URL } from './config/api';
import { useLocalSearchParams } from 'expo-router';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Chat() {
  let { trainerId } = useLocalSearchParams();
  // Ak je trainerId pole, vezmi prvý prvok, inak string
  if (Array.isArray(trainerId)) trainerId = trainerId[0];
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<any>(null);
  const flatListRef = useRef<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const userIdRef = useRef<string | null>(null);
  const trainerIdRef = useRef<string | null>(null);
  const [logedUserId, setLogedUserId] = useState<string | null>(null);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);
  useEffect(() => {
    trainerIdRef.current = trainerId;
  }, [trainerId]);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(setUserId);
    AsyncStorage.getItem('role').then(setRole);
  }, []);

  useEffect(() => {
    const init = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      fetchMessages(storedUserId);
      // Inicializácia socket.io
      socketRef.current = io(API_URL.replace('/api', ''), {
        transports: ['websocket'],
      });
      socketRef.current.on('connect', () => {
        if (storedUserId) {
          socketRef.current.emit('join', storedUserId);
        }
      });
      socketRef.current.on('receive_message', (msg: any) => {
        console.log('SOCKET: receive_message', msg);
        const myId = userIdRef.current;
        const partnerId = trainerIdRef.current;
        console.log('SOCKET: currentUserId', myId, 'currentTrainerId', partnerId);
        
          setMessages(prev => {
            if (prev.some(m => m.id === msg.id)) {
              console.log('SOCKET: message already exists, skipping');
              return prev;
            }
            console.log('SOCKET: adding message to state', msg);
            return [...prev, msg];
          });
        
      });
    };
    init();
    return () => {
      socketRef.current?.disconnect();
    };
  }, [trainerId]);

  useEffect(() => {
    if (socketRef.current && userId) {
      socketRef.current.emit('join', userId);
    }
  }, [userId]);

  const fetchMessages = async (storedUserId?: string | null) => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/${trainerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setMessages([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      let uid = storedUserId || (await AsyncStorage.getItem('userId'));
      if (!uid && Array.isArray(data) && data.length > 0) {
        // Zisti userId z histórie správ (prvá správa, kde sender_id alebo receiver_id nie je trainerId)
        const firstMsg = data.find((msg: any) => msg.sender_id != trainerId) || data.find((msg: any) => msg.receiver_id != trainerId);
        if (firstMsg) {
          uid = firstMsg.sender_id != trainerId ? String(firstMsg.sender_id) : String(firstMsg.receiver_id);
          await AsyncStorage.setItem('userId', String(uid));
          setUserId(uid);
        }
      }
      setMessages(Array.isArray(data) ? data.sort((a, b) => a.id - b.id) : []);
    } catch (err) {
      setMessages([]);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const token = await AsyncStorage.getItem('token');
    const res = await fetch(`${API_URL}/chat/${trainerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ content: input })
    });
    if (!res.ok) {
      return;
    }
    const msg = await res.json();
    setInput('');
    // Set userId if not set
    if (!userId && msg.sender_id) {
      await AsyncStorage.setItem('userId', String(msg.sender_id));
      setUserId(String(msg.sender_id));
    }
    // Send only notification via socket.io, do not create message again
    socketRef.current?.emit('send_message', {
      senderId: userId || msg.sender_id,
      receiverId: trainerId,
      content: msg.content,
      // Optionally, send message id for deduplication
      id: msg.id
    });
    // Always re-fetch the full history
    await fetchMessages(userId || msg.sender_id);
    flatListRef.current?.scrollToEnd({ animated: true });
    console.log('sendMessage', { input, userId, trainerId });
  };

  const fetchLoggedUserId = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      setLogedUserId(String(data.id));
    } catch (err) {
      // handle error if needed
    }
  };

  useEffect(() => {
    fetchLoggedUserId();
  }, []);

  // Určenie "ja" a "partner" podľa role
  const myId = userId;
  const partnerId = trainerId;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => {
          
          return (
            <View style={[
              styles.messageRow,
              String(item.sender_id) === String(logedUserId)
                ? styles.userMsg
                : styles.trainerMsg
            ]}>
              <Text>{item.content}</Text>
              
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Napíš správu..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={{ color: '#fff' }}>Odoslať</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageRow: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  trainerMsg: { backgroundColor: '#eee', alignSelf: 'flex-start' },
  userMsg: { backgroundColor: '#08C8F6', alignSelf: 'flex-end', color: '#fff' },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 8 },
  sendBtn: { backgroundColor: '#08C8F6', borderRadius: 8, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center' },
}); 