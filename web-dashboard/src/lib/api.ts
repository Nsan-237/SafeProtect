import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshRequest: Promise<{ accessToken: string; refreshToken: string }> | null = null;

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('@token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      typeof window === 'undefined'
    ) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('@refreshToken');
    if (!refreshToken) {
      localStorage.removeItem('@user');
      localStorage.removeItem('@token');
      window.location.assign('/login');
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      refreshRequest ??= refreshApi
        .post('/auth/refresh-token', { token: refreshToken })
        .then((response) => response.data)
        .finally(() => {
          refreshRequest = null;
        });

      const { accessToken, refreshToken: newRefreshToken } = await refreshRequest;
      localStorage.setItem('@token', accessToken);
      localStorage.setItem('@refreshToken', newRefreshToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem('@user');
      localStorage.removeItem('@token');
      localStorage.removeItem('@refreshToken');
      window.location.assign('/login');
      return Promise.reject(refreshError);
    }
  },
);

export default api;
