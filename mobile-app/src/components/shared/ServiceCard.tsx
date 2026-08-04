import React from 'react';
import { View, Text } from 'react-native';
import { Service } from '../../types';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export const ServiceCard = ({ service }: { service: Service }) => (
  <View className="bg-card p-4 rounded-card mb-4 shadow-sm border border-gray-100 flex-row items-center">
    <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mr-4">
      <Ionicons name="medical" size={24} color={COLORS.primary} />
    </View>
    <View className="flex-1">
      <Text className="font-bold text-textPrimary text-base">{service.name}</Text>
      <Text className="text-textSecondary text-sm">{service.type}</Text>
    </View>
    <Text className="text-primary font-semibold">{service.distance}</Text>
  </View>
);
