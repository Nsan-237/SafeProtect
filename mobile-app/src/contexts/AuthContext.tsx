import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import api from '../services/api';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to load user state', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();

    // Auto-logout on 401 Unauthorized response
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          setUser(null);
          await AsyncStorage.removeItem('@user');
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@refreshToken');
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: loggedInUser, tokens } = response.data;
      
      setUser(loggedInUser);
      await AsyncStorage.setItem('@user', JSON.stringify(loggedInUser));
      await AsyncStorage.setItem('@token', tokens.accessToken);
      await AsyncStorage.setItem('@refreshToken', tokens.refreshToken);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || 'Authentication failed';
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
