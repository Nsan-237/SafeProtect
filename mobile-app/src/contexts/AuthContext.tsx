import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { setOnAuthFailure } from "../services/api";
import { User } from "../types";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["@user", "@token", "@refreshToken"]);
    } catch (e) {
      console.error("Error clearing auth storage:", e);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    // Register auto logout callback for API auth failures
    setOnAuthFailure(() => {
      logout();
    });

    // Check stored user session on launch
    const loadStoredAuth = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("@user");
        const storedToken = await AsyncStorage.getItem("@token");
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load stored auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { user: userData, tokens } = res.data;

    // B1 Security: ADMIN and ORGANIZATION accounts are restricted to the web dashboard only.
    if (userData.role === 'ADMIN' || userData.role === 'ORGANIZATION') {
      throw new Error(
        'This account is for the web dashboard only.\nPlease use the SafeProtect web portal to sign in.'
      );
    }

    await AsyncStorage.setItem("@token", tokens.accessToken);
    await AsyncStorage.setItem("@refreshToken", tokens.refreshToken);
    await AsyncStorage.setItem("@user", JSON.stringify(userData));

    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
