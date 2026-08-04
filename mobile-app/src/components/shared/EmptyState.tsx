import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const EmptyState = ({ message, icon = 'folder-open-outline' }: { message: string, icon?: string }) => (
  <View className="flex-1 items-center justify-center p-8">
    <Ionicons name={icon as any} size={64} color="#D1D5DB" />
    <Text className="text-textSecondary text-center mt-4 text-lg">{message}</Text>
  </View>
);
