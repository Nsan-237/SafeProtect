import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface Thread {
  id: string;
  userId: string;
  name: string;
  subtitle: string;
  message: string;
  time: string;
  unreadCount: number;
}

const formatTime = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export const MessagesScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/messages/threads");
      const rawMsgs: any[] = res.data;

      // Group by the "other" person in the conversation
      const threadMap = new Map<string, Thread>();
      rawMsgs.forEach((msg: any) => {
        const isMe = msg.senderId === user?.id;
        const otherId = isMe ? msg.receiverId : msg.senderId;
        const otherName = isMe
          ? msg.receiver?.name ?? "Unknown"
          : msg.sender?.name ?? "Unknown";

        if (!threadMap.has(otherId)) {
          threadMap.set(otherId, {
            id: msg.id,
            userId: otherId,
            name: otherName,
            subtitle: isMe ? "Sent" : "Received",
            message: msg.content ?? "",
            time: formatTime(msg.createdAt),
            unreadCount: !msg.isRead && !isMe ? 1 : 0,
          });
        }
      });

      setThreads(Array.from(threadMap.values()));
    } catch (err) {
      console.warn("Error fetching message threads:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchThreads();
    }, [fetchThreads]),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 4, marginLeft: -4 }}>
            <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D", marginLeft: 12 }}>
            Messages
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 4 }}>
          <Ionicons name="create-outline" size={22} color="#5B3FD3" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#5B3FD3" />
          <Text style={{ color: "#75759E", marginTop: 12 }}>Loading messages...</Text>
        </View>
      ) : threads.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chatbubbles-outline" size={56} color="#B0B0C8" />
          <Text style={{ color: "#75759E", fontSize: 16, fontWeight: "600", marginTop: 16 }}>
            No messages yet
          </Text>
          <Text style={{ color: "#B0B0C8", fontSize: 13, marginTop: 6, textAlign: "center", paddingHorizontal: 40 }}>
            Your social worker or support team will contact you here
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          {threads.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              onPress={() =>
                navigation.navigate("Chat", {
                  chatName: chat.name,
                  subtitle: chat.subtitle,
                  receiverId: chat.userId,
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: "#F5F5F8",
                flexDirection: "row",
                alignItems: "center",
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: "#F0EDFF",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 14,
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "800", color: "#5B3FD3" }}>
                  {chat.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={{ flex: 1, marginRight: 8 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
                  <Text style={{ fontWeight: "700", fontSize: 15, color: "#1E1E2D" }}>
                    {chat.name}
                  </Text>
                  <Text style={{ color: "#B0B0C8", fontSize: 11 }}>{chat.time}</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 3 }}>
                  <Text style={{ color: "#75759E", fontSize: 13, flex: 1, marginRight: 8 }} numberOfLines={1}>
                    {chat.message}
                  </Text>
                  {chat.unreadCount > 0 && (
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        backgroundColor: "#5B3FD3",
                        borderRadius: 10,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>
                        {chat.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
