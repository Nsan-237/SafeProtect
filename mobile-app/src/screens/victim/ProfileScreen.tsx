import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";

const ROLE_LABEL: Record<string, string> = {
  VICTIM: "Victim",
  SOCIAL_WORKER: "Social Worker",
  ADMIN: "Administrator",
  ORGANIZATION: "Organization",
};

// ────────────────────────────────────────────────────────────────
// Sub-modals
// ────────────────────────────────────────────────────────────────

const PersonalInfoModal = ({
  visible,
  user,
  onClose,
  onSaved,
}: {
  visible: boolean;
  user: any;
  onClose: () => void;
  onSaved: (name: string, phone: string) => void;
}) => {
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/users/${user?.id}`, { name: name.trim(), phone: phone.trim() });
      Alert.alert("✅ Saved", "Your profile has been updated.");
      onSaved(name.trim(), phone.trim());
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
            }}
            // prevent tap-through
            onStartShouldSetResponder={() => true}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D", marginBottom: 20 }}>
              Personal Information
            </Text>

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#75759E", marginBottom: 6, textTransform: "uppercase" }}>Full Name</Text>
            <TextInput
              style={{
                backgroundColor: "#F8F9FE",
                borderWidth: 1.5,
                borderColor: "#E8E8F0",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                color: "#1E1E2D",
                marginBottom: 16,
              }}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#A0A0B0"
            />

            <Text style={{ fontSize: 12, fontWeight: "700", color: "#75759E", marginBottom: 6, textTransform: "uppercase" }}>Phone Number</Text>
            <TextInput
              style={{
                backgroundColor: "#F8F9FE",
                borderWidth: 1.5,
                borderColor: "#E8E8F0",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 15,
                color: "#1E1E2D",
                marginBottom: 28,
              }}
              value={phone}
              onChangeText={setPhone}
              placeholder="+237 6XX XXX XXX"
              placeholderTextColor="#A0A0B0"
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              onPress={handleSave}
              disabled={saving}
              style={{
                backgroundColor: saving ? "#A0A0C0" : "#5B3FD3",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 8 }} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const ChangePasswordModal = ({
  visible,
  userId,
  onClose,
}: {
  visible: boolean;
  userId?: string;
  onClose: () => void;
}) => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = async () => {
    if (!current || !newPass || !confirm) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }
    if (newPass !== confirm) {
      Alert.alert("Validation", "New password and confirmation do not match.");
      return;
    }
    if (newPass.length < 6) {
      Alert.alert("Validation", "Password must be at least 6 characters.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/users/${userId}`, { currentPassword: current, password: newPass });
      Alert.alert("✅ Changed", "Password updated successfully.");
      setCurrent(""); setNewPass(""); setConfirm("");
      onClose();
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View
            style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}
            onStartShouldSetResponder={() => true}
          >
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D", marginBottom: 20 }}>
              Change Password
            </Text>

            {[
              { label: "Current Password", value: current, set: setCurrent },
              { label: "New Password", value: newPass, set: setNewPass },
              { label: "Confirm New Password", value: confirm, set: setConfirm },
            ].map(({ label, value, set }) => (
              <View key={label}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#75759E", marginBottom: 6, textTransform: "uppercase" }}>{label}</Text>
                <TextInput
                  style={{
                    backgroundColor: "#F8F9FE",
                    borderWidth: 1.5,
                    borderColor: "#E8E8F0",
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: "#1E1E2D",
                    marginBottom: 16,
                  }}
                  value={value}
                  onChangeText={set}
                  secureTextEntry
                  placeholder="••••••••"
                  placeholderTextColor="#A0A0B0"
                />
              </View>
            ))}

            <TouchableOpacity
              onPress={handleChange}
              disabled={saving}
              style={{
                backgroundColor: saving ? "#A0A0C0" : "#5B3FD3",
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                marginTop: 4,
              }}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "700" }}>Update Password</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 16 }} />
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ────────────────────────────────────────────────────────────────
// Main Profile Screen
// ────────────────────────────────────────────────────────────────

export const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { logout, user, updateUser } = useAuth();

  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const displayName = user?.name ?? "My Profile";
  const displayRole = ROLE_LABEL[user?.role ?? ""] ?? user?.role ?? "";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const menuItems = [
    {
      title: "Personal Information",
      icon: "person-outline" as const,
      onPress: () => setShowPersonalInfo(true),
    },
    {
      title: "Change Password",
      icon: "key-outline" as const,
      onPress: () => setShowChangePassword(true),
    },
    {
      title: "Notification Settings",
      icon: "notifications-outline" as const,
      onPress: () => Alert.alert("Coming Soon", "Notification preferences will be available in a future update."),
    },
    {
      title: "Privacy & Security",
      icon: "shield-checkmark-outline" as const,
      onPress: () => Alert.alert("Privacy Policy", "Your data is protected under our privacy policy and government child protection regulations."),
    },
    {
      title: "Help & Support",
      icon: "help-circle-outline" as const,
      onPress: () => Alert.alert("Help & Support", "Contact us at: support@safeprotect.cm\nHotline: +237 222 000 000"),
    },
  ];

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
            <Text style={{ fontSize: 32, fontWeight: "800", color: "#FFFFFF", letterSpacing: 1 }}>
              {initials}
            </Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginBottom: 4 }}>
            {displayName}
          </Text>
          <View style={{ backgroundColor: "rgba(91,63,211,0.5)", paddingHorizontal: 14, paddingVertical: 4, borderRadius: 20 }}>
            <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: "700" }}>
              {displayRole}
            </Text>
          </View>
          {user?.email && (
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginTop: 6 }}>
              {user.email}
            </Text>
          )}
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
                onPress={item.onPress}
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
                <Text style={{ flex: 1, fontSize: 15, fontWeight: "600", color: "#1E1E2D" }}>
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
            <Text style={{ color: "#FF2E55", fontWeight: "800", fontSize: 15, marginLeft: 8 }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals */}
      <PersonalInfoModal
        visible={showPersonalInfo}
        user={user}
        onClose={() => setShowPersonalInfo(false)}
        onSaved={(name, phone) => {
          updateUser({ name, phone });
        }}
      />
      <ChangePasswordModal
        visible={showChangePassword}
        userId={user?.id}
        onClose={() => setShowChangePassword(false)}
      />
    </SafeAreaView>
  );
};
