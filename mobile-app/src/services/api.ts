import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "http://10.137.242.37:5000/api";

const api = axios.create({
  baseURL,
});

const refreshApi = axios.create({
  baseURL,
});

let onAuthFailure: (() => void) | null = null;

export const setOnAuthFailure = (callback: () => void) => {
  onAuthFailure = callback;
};

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("@refreshToken");
        if (!refreshToken) {
          await AsyncStorage.removeItem("@user");
          await AsyncStorage.removeItem("@token");
          await AsyncStorage.removeItem("@refreshToken");
          onAuthFailure?.();
          return Promise.reject(error);
        }

        const response = await refreshApi.post("/auth/refresh-token", {
          token: refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await AsyncStorage.setItem("@token", accessToken);
        await AsyncStorage.setItem("@refreshToken", newRefreshToken);

        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any).Authorization =
          `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        await AsyncStorage.removeItem("@user");
        await AsyncStorage.removeItem("@token");
        await AsyncStorage.removeItem("@refreshToken");
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
