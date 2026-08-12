import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

//To change the ip address
const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.213.43.37:5000/api";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Separate instance used ONLY for refresh calls — never intercepted
const refreshApi = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

let onAuthFailure: (() => void) | null = null;
let refreshRequest: Promise<{ accessToken: string; refreshToken: string }> | null =
  null;

export const setOnAuthFailure = (callback: () => void) => {
  onAuthFailure = callback;
};

// Attach access token to every outgoing request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@token");
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses: try to refresh token once, then logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh when:
    // 1. Response is 401
    // 2. We haven't already retried this request
    // 3. The failing request was NOT itself a login/refresh call (avoids loops)
    const isAuthRoute =
      originalRequest?.url?.includes("/auth/login") ||
      originalRequest?.url?.includes("/auth/refresh-token") ||
      originalRequest?.url?.includes("/auth/register");

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      originalRequest._retry = true;

      try {
        const storedRefreshToken = await AsyncStorage.getItem("@refreshToken");
        if (!storedRefreshToken) {
          // No refresh token stored — clear auth and signal logout
          await AsyncStorage.multiRemove(["@user", "@token", "@refreshToken"]);
          onAuthFailure?.();
          return Promise.reject(error);
        }

        // Deduplicate concurrent refresh calls
        if (!refreshRequest) {
          refreshRequest = refreshApi
            .post("/auth/refresh-token", { token: storedRefreshToken })
            .then((response) => response.data)
            .finally(() => {
              refreshRequest = null;
            });
        }

        const { accessToken, refreshToken: newRefreshToken } =
          await refreshRequest;

        await AsyncStorage.setItem("@token", accessToken);
        await AsyncStorage.setItem("@refreshToken", newRefreshToken);

        // Retry original request with new token
        originalRequest.headers = originalRequest.headers || {};
        (originalRequest.headers as any).Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh also failed — force logout
        await AsyncStorage.multiRemove(["@user", "@token", "@refreshToken"]);
        onAuthFailure?.();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
