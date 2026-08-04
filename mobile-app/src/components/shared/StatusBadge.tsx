import React from 'react';
import { View, Text } from 'react-native';

export const StatusBadge = ({ status }: { status: string }) => {
  let bgColor = 'bg-gray-200';
  let textColor = 'text-gray-800';
  if (status === 'New') { bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; }
  else if (status === 'In Progress') { bgColor = 'bg-yellow-100'; textColor = 'text-yellow-800'; }
  else if (status === 'Resolved') { bgColor = 'bg-green-100'; textColor = 'text-green-800'; }

  return (
    <View className={`px-3 py-1 rounded-full ${bgColor}`}>
      <Text className={`text-xs font-semibold ${textColor}`}>{status}</Text>
    </View>
  );
};
