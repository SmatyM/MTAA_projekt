import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from './config/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './config/api';

const notifications = [
  {
    id: '1',
    title: "Don't miss your run",
    subtitle: 'About 3 hours ago',
  },
  {
    id: '2',
    title: 'Add some workout for tomorrow',
    subtitle: 'About 3 hours ago',
  },
];

export default function Notifications() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const [role, setRole] = React.useState<string | null>(null);

  const colors = darkMode
    ? {
        background: '#181A20',
        card: '#23262F',
        text: '#fff',
        subtext: '#BDBDBD',
        inputBg: '#23262F',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#23262F',
        avatar: '#23262F',
      }
    : {
        background: '#fff',
        card: '#F6F6F6',
        text: '#222',
        subtext: '#888',
        inputBg: '#F6F6F6',
        icon: '#BDBDBD',
        blue: '#08C8F6',
        divider: '#F0F0F0',
        avatar: '#C7DBF7',
      };

  React.useEffect(() => {
    AsyncStorage.getItem('role').then(setRole);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.headerRow, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.inputBg }]} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notification</Text>
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.inputBg }]} onPress={() => router.push('/trainers')}>
          <MaterialIcons name="search" size={22} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.headerBtn, { backgroundColor: colors.inputBg }] }>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      {/* Button to Chats */}
      <TouchableOpacity
        style={{
          margin: 16,
          padding: 14,
          backgroundColor: colors.blue,
          borderRadius: 12,
          alignItems: 'center',
        }}
        onPress={() => router.push('/chats')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Zobraziť všetky chaty</Text>
      </TouchableOpacity>
      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View>
            <View style={styles.notificationRow}>
              <View style={[styles.avatar, { backgroundColor: colors.avatar }]} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
                <Text style={[styles.notificationSubtitle, { color: colors.subtext }]}>{item.subtitle}</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons name="dots-vertical" size={18} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.divider }]} />
          </View>
        )}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
      />

      {/* Chat Conversations List */}
      <ChatListSection colors={colors} />
      <ChatsSection colors={colors} />
      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNav, { backgroundColor: colors.card }] }>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/activity')}>
          <MaterialCommunityIcons name="chart-box-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/home')}>
          <MaterialCommunityIcons name="home-variant" size={28} color={colors.blue} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/notifications')}>
          <LinearGradient colors={[colors.blue, '#1A1A2E']} style={styles.activeIconBg}>
            <MaterialCommunityIcons name="bell-outline" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.activeDot} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/profile')}>
          <MaterialCommunityIcons name="account-outline" size={28} color={colors.blue} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerBtn: {
    borderRadius: 16,
    padding: 6,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 14,
  },
  notificationTitle: {
    fontWeight: '600',
    fontSize: 15,
  },
  notificationSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 10,
    paddingBottom: 18,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 100,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconBg: {
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1A6DD1',
    marginTop: 2,
    alignSelf: 'center',
  },
});

function ChatListSection({ colors }: { colors: any }) {
  const [chats, setChats] = React.useState<any[]>([]);
  const router = useRouter();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchConversations = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setChats([]);
        return;
      }
      const data = await res.json();
      console.log('conversations from backend', data);
      setChats(Array.isArray(data) ? data : []);
    };
    fetchConversations();
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('role').then(setRole);
  }, []);

  if (!chats.length) return (
    <View style={{ marginTop: 16, marginHorizontal: 16 }}>
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        {role === 'trainer' ? 'Chaty s používateľmi' : 'Chaty s trénermi'}
      </Text>
      <Text style={{ color: colors.subtext }}>Žiadne chaty s trénermi</Text>
    </View>
  );
  return (
    <View style={{ marginTop: 16, marginHorizontal: 16 }}>
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
        {role === 'trainer' ? 'Chaty s používateľmi' : 'Chaty s trénermi'}
      </Text>
      {chats.map(chat => (
        <TouchableOpacity
          key={chat.trainerId}
          style={[styles.notificationRow, { backgroundColor: colors.card, borderRadius: 10, marginBottom: 8 }]}
          onPress={() => {
            if (!chat.trainerId || isNaN(Number(chat.trainerId))) {
              alert('Chyba: Neplatné ID trénera!');
              return;
            }
            router.push({ pathname: '/chat', params: { trainerId: String(chat.trainerId) } });
          }}
        >
          <View style={[styles.avatar, { backgroundColor: colors.avatar }]} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.notificationTitle, { color: colors.text }]}>{chat.email}</Text>
            <Text style={[styles.notificationSubtitle, { color: colors.subtext }]} numberOfLines={1}>{chat.lastMessage}</Text>
          </View>
          {chat.unreadCount > 0 && (
            <View style={{ backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 8, alignSelf: 'center' }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>{chat.unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ChatsSection({ colors }: { colors: any }) {
  const [chats, setChats] = React.useState<any[]>([]);
  const router = useRouter();
  const [role, setRole] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchConversations = async () => {
      const token = await AsyncStorage.getItem('token');
      const res = await fetch(`${API_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setChats([]);
        return;
      }
      const data = await res.json();
      setChats(Array.isArray(data) ? data : []);
    };
    fetchConversations();
  }, []);

  React.useEffect(() => {
    AsyncStorage.getItem('role').then(setRole);
  }, []);

  return (
    <View style={{ marginTop: 24, marginHorizontal: 16 }}>
      <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 20, marginBottom: 8 }}>Chats</Text>
      {chats.length === 0 ? (
        <Text style={{ color: colors.subtext }}>No chats yet.</Text>
      ) : (
        chats.map(chat => (
          <TouchableOpacity
            key={chat.trainerId}
            style={[styles.notificationRow, { backgroundColor: colors.card, borderRadius: 10, marginBottom: 8 }]}
            onPress={() => {
              if (!chat.trainerId || isNaN(Number(chat.trainerId))) {
                alert('Chyba: Neplatné ID používateľa!');
                return;
              }
              router.push({ pathname: '/chat', params: { trainerId: String(chat.trainerId) } });
            }}
          >
            <View style={[styles.avatar, { backgroundColor: colors.avatar }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.notificationTitle, { color: colors.text }]}>{chat.first_name || ''} {chat.last_name || ''} {chat.email ? `(${chat.email})` : ''}</Text>
              <Text style={[styles.notificationSubtitle, { color: colors.subtext }]} numberOfLines={1}>{chat.lastMessage}</Text>
            </View>
            {chat.unreadCount > 0 && (
              <View style={{ backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 8, alignSelf: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{chat.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}
