import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";

const ROLE_LABEL: Record<string, string> = {
  VICTIM: "Victim",
  SOCIAL_WORKER: "Social Worker",
  ADMIN: "Administrator",
  ORGANIZATION: "Organization",
};

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();

  const displayName = user?.name ?? "My Profile";
  const displayRole = ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? "";

  const menuItems = [
    { title: "Personal Information", icon: "person-outline" as const },
    { title: "Change Password", icon: "key-outline" as const },
    { title: "Notification Settings", icon: "notifications-outline" as const },
    { title: "Privacy & Security", icon: "shield-checkmark-outline" as const },
    { title: "Help & Support", icon: "help-circle-outline" as const },
  ];

  // Generate initials avatar for users without a photo
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1248" />
      <ScrollView style={{ flex: 1 }}>
        {/* Deep purple header with avatar */}
        <View
          style={{
            backgroundColor: "#1E1248",
            paddingTop: (insets.top || StatusBar.currentHeight || 24) + 16,
            paddingBottom: 36,
            paddingHorizontal: 24,
            alignItems: "center",
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
            shadowColor: "#1E1248",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          {/* Avatar circle */}
          <View
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: "#5B3FD3",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              borderWidth: 3,
              borderColor: "rgba(255,255,255,0.25)",
            }}
          >
            <Text
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: "#FFFFFF",
                letterSpacing: 1,
              }}
            >
              {initials}
            </Text>
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: 4,
            }}
          >
            {displayName}
          </Text>
          <View
            style={{
              backgroundColor: "rgba(91,63,211,0.5)",
              paddingHorizontal: 14,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <Text
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 12,
                fontWeight: "700",
              }}
            >
              {displayRole}
            </Text>
          </View>
        </View>

        <View style={{ padding: 20, paddingTop: 24 }}>
          {/* Menu items */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#F0F0F5",
              overflow: "hidden",
              marginBottom: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  borderBottomWidth: index !== menuItems.length - 1 ? 1 : 0,
                  borderBottomColor: "#F5F5F8",
                }}
                activeOpacity={0.7}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: "#F0EDFF",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 14,
                  }}
                >
                  <Ionicons name={item.icon} size={20} color="#5B3FD3" />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 15,
                    fontWeight: "600",
                    color: "#1E1E2D",
                  }}
                >
                  {item.title}
                </Text>
                <Ionicons name="chevron-forward" size={18} color="#B0B0C8" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            onPress={logout}
            style={{
              backgroundColor: "#FFF0F3",
              paddingVertical: 16,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#FFD6DE",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#FF2E55",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 6,
              elevation: 2,
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={22} color="#FF2E55" />
            <Text
              style={{
                color: "#FF2E55",
                fontWeight: "800",
                fontSize: 15,
                marginLeft: 8,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
