import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { Header } from '../../components/shared/Header';

export const ChatScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Chat" />
      <View className="flex-1 p-4">
        <Text>Chat functionality here</Text>
      </View>
    </SafeAreaView>
  );
};
