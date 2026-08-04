import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export const SOSButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity onPress={onPress} className="w-48 h-48 rounded-full bg-emergency justify-center items-center shadow-2xl shadow-red-500/50">
    <View className="w-40 h-40 rounded-full bg-red-600 justify-center items-center">
      <Text className="text-white text-5xl font-bold">SOS</Text>
    </View>
  </TouchableOpacity>
);
