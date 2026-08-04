import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  // NOTE: Use your PC's LAN IP (not localhost) so the phone can reach the backend.
  // This IP matches the Expo Metro server IP (10.137.242.37).
  baseURL: 'http://10.137.242.37:5000/api',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
