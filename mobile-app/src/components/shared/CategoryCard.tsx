import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

export const CategoryCard = ({ title, icon, selected, onPress }: { title: string, icon: string, selected: boolean, onPress: () => void }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`p-4 rounded-card items-center justify-center border-2 m-1 flex-1 min-h-[120px] ${selected ? 'border-primary bg-primary/10' : 'border-gray-100 bg-card'}`}
  >
    <Ionicons name={icon as any} size={32} color={selected ? COLORS.primary : COLORS.textSecondary} />
    <Text className={`mt-2 text-center font-semibold ${selected ? 'text-primary' : 'text-textSecondary'}`}>{title}</Text>
  </TouchableOpacity>
);
