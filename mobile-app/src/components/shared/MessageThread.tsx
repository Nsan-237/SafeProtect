import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const MessageThread = ({ name, message, time }: { name: string, message: string, time: string }) => (
  <View className="bg-card p-4 border-b border-gray-100 flex-row items-center">
    <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-4">
      <Ionicons name="person" size={24} color="#6B7280" />
    </View>
    <View className="flex-1">
      <View className="flex-row justify-between">
        <Text className="font-bold text-textPrimary">{name}</Text>
        <Text className="text-textSecondary text-xs">{time}</Text>
      </View>
      <Text className="text-textSecondary text-sm mt-1" numberOfLines={1}>{message}</Text>
    </View>
  </View>
);
