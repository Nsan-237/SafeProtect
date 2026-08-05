import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Header } from "../../components/shared/Header";
import { useRoute } from "@react-navigation/native";

const initialMessages = [
  {
    id: "1",
    text: "Hi Marie, how can I help you today?",
    sender: "other",
    time: "10:28 AM",
  },
  {
    id: "2",
    text: "I need an update on my case status.",
    sender: "me",
    time: "10:29 AM",
  },
  {
    id: "3",
    text: "Your case is currently under review by the protection team.",
    sender: "other",
    time: "10:30 AM",
  },
];

export const ChatScreen = () => {
  const route = useRoute();
  const { chatName, subtitle } = route.params as {
    chatName?: string;
    subtitle?: string;
  };
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  const handleSend = () => {
    if (!draft.trim()) return;
    const nextMessage = {
      id: String(Date.now()),
      text: draft.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, nextMessage]);
    setDraft("");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <Header title={chatName ? `${chatName}` : "Chat"} />
      <View className="bg-white border-b border-gray-100 px-4 py-3">
        <Text className="text-sm text-[#75759E]">
          {subtitle || "Chat with your support team"}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((message) => {
          const isMe = message.sender === "me";
          return (
            <View
              key={message.id}
              className={`mb-3 flex-row ${isMe ? "justify-end" : "justify-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-3xl px-4 py-3 ${isMe ? "bg-[#5B3FD3]" : "bg-[#F0F0FF]"}`}
              >
                <Text className={`${isMe ? "text-white" : "text-[#1E1E2D]"}`}>
                  {message.text}
                </Text>
                <Text
                  className={`mt-1 text-[11px] ${isMe ? "text-[#D1D7FF]" : "text-[#75759E]"}`}
                >
                  {message.time}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="border-t border-gray-200 bg-white px-4 py-3">
        <View className="flex-row items-center gap-3">
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Type a message..."
            placeholderTextColor="#A0A0B8"
            className="flex-1 rounded-3xl bg-[#F2F4FF] px-4 py-3 text-sm text-[#1E1E2D]"
          />
          <TouchableOpacity
            onPress={handleSend}
            className="h-12 w-12 items-center justify-center rounded-full bg-[#5B3FD3]"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold">Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
