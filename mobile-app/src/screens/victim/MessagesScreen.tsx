import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const messagesData = [
  {
    id: "1",
    name: "Aline Ndey",
    subtitle: "Social Worker",
    message: "Please remember our meeting...",
    time: "10:30 AM",
    unreadCount: 2,
    icon: "person",
  },
  {
    id: "2",
    name: "Central Hospital",
    subtitle: "Medical Team",
    message: "Your appointment is confirmed...",
    time: "Yesterday",
    unreadCount: 0,
    icon: "medical",
  },
  {
    id: "3",
    name: "Case Team",
    subtitle: "3 Members",
    message: "New update on case CASE-2024-078",
    time: "Yesterday",
    unreadCount: 0,
    icon: "people",
  },
  {
    id: "4",
    name: "Women's Legal Aid Center",
    subtitle: "Legal",
    message: "Please bring the requested documents",
    time: "2 Days ago",
    unreadCount: 0,
    icon: "ribbon",
  },
  {
    id: "5",
    name: "System",
    subtitle: "System",
    message: "Your report INC-2024-125 has been...",
    time: "3 Days ago",
    unreadCount: 0,
    icon: "notifications",
  },
];

export const MessagesScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FE]">
      <StatusBar barStyle="dark-content" />
      <View className="flex-row items-center justify-between px-6 pt-4 pb-3 bg-white border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            className="p-2 -ml-2"
          >
            <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-[#1E1E2D] ml-4">
            Messages
          </Text>
        </View>
        <TouchableOpacity className="p-2">
          <Ionicons name="ellipsis-vertical" size={20} color="#1E1E2D" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {messagesData.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            onPress={() =>
              navigation.navigate("Chat", {
                chatName: chat.name,
                subtitle: chat.subtitle,
              })
            }
            className="bg-white p-4 border-b border-gray-100 flex-row items-center"
          >
            <View className="w-12 h-12 rounded-full bg-[#5B3FD3]/10 items-center justify-center mr-4">
              <Ionicons name={chat.icon as any} size={22} color="#5B3FD3" />
            </View>

            <View className="flex-1 mr-2">
              <View className="flex-row justify-between items-baseline">
                <View className="flex-row items-center">
                  <Text className="font-bold text-base text-[#1E1E2D]">
                    {chat.name}
                  </Text>
                  <Text className="text-[#75759E] text-xs ml-2 font-medium">
                    ({chat.subtitle})
                  </Text>
                </View>
                <Text className="text-[#75759E] text-xs">{chat.time}</Text>
              </View>

              <View className="flex-row justify-between items-center mt-1">
                <Text
                  className="text-[#75759E] text-sm flex-1 mr-3"
                  numberOfLines={1}
                >
                  {chat.message}
                </Text>
                {chat.unreadCount > 0 && (
                  <View className="w-5 h-5 bg-[#5B3FD3] rounded-full items-center justify-center">
                    <Text className="text-white text-[10px] font-bold">
                      {chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
