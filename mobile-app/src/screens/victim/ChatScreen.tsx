import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

interface Message {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
}

const formatTime = (dateStr: string) =>
  new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

export const ChatScreen = ({ navigation }: any) => {
  const route = useRoute();
  const { chatName, subtitle, receiverId } = route.params as {
    chatName?: string;
    subtitle?: string;
    receiverId?: string;
  };
  const { user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(!!receiverId);
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async (silent = false) => {
    if (!receiverId) return;
    try {
      if (!silent) setLoading(true);
      const res = await api.get(`/messages/${receiverId}`);
      const mapped: Message[] = res.data.map((m: any) => ({
        id: m.id,
        text: m.content,
        sender: m.senderId === user?.id ? "me" : "other",
        time: formatTime(m.createdAt),
      }));
      setMessages(mapped);
    } catch (err) {
      console.warn("Error fetching messages:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [receiverId, user]);

  useFocusEffect(
    useCallback(() => {
      fetchMessages();
      // Poll every 8 seconds while screen is focused
      const interval = setInterval(() => fetchMessages(true), 8000);
      return () => clearInterval(interval); // cleanup on blur/unmount
    }, [fetchMessages]),
  );

  const handleSend = async () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft("");

    // Optimistic update
    const tempMsg: Message = {
      id: String(Date.now()),
      text,
      sender: "me",
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, tempMsg]);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    if (!receiverId) return; // Offline / demo mode

    try {
      setSending(true);
      await api.post("/messages", { receiverId, content: text });
    } catch (err) {
      console.warn("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#FFFFFF",
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F5",
          }}
        >
          <TouchableOpacity onPress={() => navigation?.goBack()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
          </TouchableOpacity>
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: "#F0EDFF",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#5B3FD3" }}>
              {(chatName ?? "?").charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D" }}>
              {chatName ?? "Chat"}
            </Text>
            {subtitle ? (
              <Text style={{ fontSize: 12, color: "#75759E" }}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {/* Messages */}
        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#5B3FD3" />
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            style={{ flex: 1, paddingHorizontal: 16 }}
            contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.length === 0 && (
              <View style={{ alignItems: "center", marginTop: 40 }}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color="#B0B0C8" />
                <Text style={{ color: "#75759E", marginTop: 12, textAlign: "center" }}>
                  No messages yet. Say hello!
                </Text>
              </View>
            )}
            {messages.map((message) => {
              const isMe = message.sender === "me";
              return (
                <View
                  key={message.id}
                  style={{
                    marginBottom: 12,
                    flexDirection: "row",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                  }}
                >
                  <View
                    style={{
                      maxWidth: "80%",
                      borderRadius: 20,
                      paddingHorizontal: 16,
                      paddingVertical: 10,
                      backgroundColor: isMe ? "#5B3FD3" : "#F0F0FF",
                    }}
                  >
                    <Text style={{ color: isMe ? "#FFFFFF" : "#1E1E2D", fontSize: 14, lineHeight: 20 }}>
                      {message.text}
                    </Text>
                    <Text style={{ marginTop: 4, fontSize: 11, color: isMe ? "rgba(255,255,255,0.65)" : "#75759E" }}>
                      {message.time}
                    </Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Input bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderTopColor: "#E8E8F0",
            backgroundColor: "#FFFFFF",
            paddingHorizontal: 16,
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor="#A0A0B8"
            style={{
              flex: 1,
              borderRadius: 24,
              backgroundColor: "#F2F4FF",
              paddingHorizontal: 16,
              paddingVertical: 10,
              fontSize: 14,
              color: "#1E1E2D",
            }}
            multiline
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={sending || !draft.trim()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: draft.trim() ? "#5B3FD3" : "#D0C8F8",
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
