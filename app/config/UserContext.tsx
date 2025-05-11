import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './api';
import { registerForPushNotificationsAsync } from './notifications';

export interface UserProfile {
  id?: number;
  email?: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  height?: number | null;
  weight?: number | null;
  date_of_birth?: string | null;
  daily_steps_goal?: number | null;
  daily_distance_goal?: number | null;
  push_token?: string | null;
}

interface UserContextType {
  user: UserProfile | null;
  refreshUser: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const refreshUser = async () => {
    try {
      const token = await AsyncStorage.getItem('firebaseToken');
      if (!token) return;
      const res = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const updatePushToken = async () => {
      const token = await registerForPushNotificationsAsync();
      console.log('Expo push token:', token);
      console.log('User:', user);
      if (token && user?.id) {
        const authToken = await AsyncStorage.getItem('firebaseToken');
        const res = await fetch(`${API_URL}/user/push-token`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ push_token: token }),
        });
        console.log('Push token update response:', res.status);
      }
    };
    if (user) updatePushToken();
  }, [user]);

  return (
    <UserContext.Provider value={{ user, refreshUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}; 