import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2000);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <Text className="text-4xl font-bold text-white mb-4">SafeProtect</Text>
      <ActivityIndicator size="large" color="#FFF" />
    </View>
  );
};
