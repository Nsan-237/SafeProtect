import React from 'react';
import { View, Text } from 'react-native';
import { Appointment } from '../../types';

export const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
  <View className="bg-card p-4 rounded-card mb-4 shadow-sm border border-gray-100">
    <View className="flex-row justify-between mb-2">
      <Text className="font-bold text-textPrimary text-lg">{appointment.type}</Text>
      <Text className="text-primary font-semibold">{appointment.status}</Text>
    </View>
    <Text className="text-textSecondary">{new Date(appointment.date).toLocaleString()}</Text>
  </View>
);
