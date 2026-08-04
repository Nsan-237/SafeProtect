import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/colors';

export const Header = ({ title }: { title: string }) => {
  const navigation = useNavigation();
  return (
    <View className="flex-row items-center p-4 bg-card border-b border-gray-100 pt-12">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
        <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
      </TouchableOpacity>
      <Text className="text-xl font-bold text-textPrimary">{title}</Text>
    </View>
  );
};
