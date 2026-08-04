import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Case } from '../../types';
import { StatusBadge } from './StatusBadge';

export const CaseCard = ({ caseData, onPress }: { caseData: Case, onPress?: () => void }) => (
  <TouchableOpacity onPress={onPress} className="bg-card p-4 rounded-card mb-4 shadow-sm border border-gray-100">
    <View className="flex-row justify-between items-center mb-2">
      <Text className="font-bold text-lg text-textPrimary">{caseData.caseId}</Text>
      <StatusBadge status={caseData.status} />
    </View>
    <Text className="text-textSecondary mb-1">{caseData.type}</Text>
    <Text className="text-textSecondary text-xs">{caseData.date}</Text>
  </TouchableOpacity>
);
