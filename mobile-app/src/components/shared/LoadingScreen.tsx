import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../constants/colors';

export const LoadingScreen = () => (
  <View className="flex-1 bg-background justify-center items-center">
    <ActivityIndicator size="large" color={COLORS.primary} />
  </View>
);
