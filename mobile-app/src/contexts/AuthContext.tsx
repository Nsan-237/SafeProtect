import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import api, { setOnAuthFailure } from "../services/api";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setOnAuthFailure(() => {
      setUser(null);
      AsyncStorage.removeItem("@user");
      AsyncStorage.removeItem("@token");
      AsyncStorage.removeItem("@refreshToken");
    });

    const loadUser = async () => {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem("@user"),
          AsyncStorage.getItem("@token"),
        ]);

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        } else {
          await AsyncStorage.removeItem("@user");
          await AsyncStorage.removeItem("@token");
          await AsyncStorage.removeItem("@refreshToken");
        }
      } catch (err) {
        console.error("Failed to load user state", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { user: loggedInUser, tokens } = response.data;

      setUser(loggedInUser);
      await AsyncStorage.setItem("@user", JSON.stringify(loggedInUser));
      await AsyncStorage.setItem("@token", tokens.accessToken);
      await AsyncStorage.setItem("@refreshToken", tokens.refreshToken);
    } catch (error: any) {
      const errMsg = error.response?.data?.error || "Authentication failed";
      throw new Error(errMsg);
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
    await AsyncStorage.removeItem("@token");
    await AsyncStorage.removeItem("@refreshToken");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
