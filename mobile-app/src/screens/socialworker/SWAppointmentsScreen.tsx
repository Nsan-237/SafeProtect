import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const scheduleData = [
  {
    id: 'a1', title: 'Case Review — Marie Dupont', dateTime: '07 Jun 2024 • 10:00 AM',
    detail: 'At: Social Welfare Office, Yaoundé', status: 'Confirmed',
  },
  {
    id: 'a2', title: 'Hospital Accompany Visit', dateTime: '08 Jun 2024 • 9:30 AM',
    detail: 'At: Central Hospital', status: 'Confirmed',
  },
  {
    id: 'a3', title: 'Legal Aid Coordination', dateTime: '10 Jun 2024 • 2:00 PM',
    detail: 'With: Women\'s Legal Aid Center', status: 'Pending',
  },
  {
    id: 'a4', title: 'Team Supervision Session', dateTime: '12 Jun 2024 • 3:00 PM',
    detail: 'At: MINPROFF Office', status: 'Pending',
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    Confirmed:  { bg: '#E8F5E9', text: '#2E7D32' },
    Pending:    { bg: '#FFF3E0', text: '#E65100' },
    Completed:  { bg: '#E3F2FD', text: '#1565C0' },
  };
  const s = map[status] ?? { bg: '#F5F5F5', text: '#757575' };
  return (
    <View style={{ backgroundColor: s.bg, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <Text style={{ color: s.text, fontSize: 11, fontWeight: '700' }}>{status}</Text>
    </View>
  );
};

export const SWAppointmentsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const displayed = activeTab === 'upcoming'
    ? scheduleData.filter(a => a.status !== 'Completed')
    : scheduleData.filter(a => a.status === 'Completed');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <View style={{ backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 0, borderBottomWidth: 1, borderBottomColor: '#F0F0F5' }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#1E1E2D', marginBottom: 16 }}>My Schedule</Text>
        <View style={{ flexDirection: 'row' }}>
          {(['upcoming', 'history'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2.5, borderBottomColor: activeTab === tab ? '#5B3FD3' : 'transparent' }}
            >
              <Text style={{ fontSize: 14, fontWeight: '700', color: activeTab === tab ? '#5B3FD3' : '#75759E', textTransform: 'capitalize' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {displayed.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="calendar-outline" size={52} color="#B0B0C8" />
            <Text style={{ color: '#75759E', fontSize: 15, marginTop: 12, fontWeight: '600' }}>No {activeTab} appointments</Text>
          </View>
        ) : (
          displayed.map(appt => (
            <View key={appt.id} style={{ backgroundColor: '#FFFFFF', padding: 18, borderRadius: 16, borderWidth: 1, borderColor: '#F0F0F5', marginBottom: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E1E2D', flex: 1, marginRight: 8 }}>{appt.title}</Text>
                <StatusBadge status={appt.status} />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Ionicons name="time-outline" size={13} color="#5B3FD3" />
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#5B3FD3', marginLeft: 4 }}>{appt.dateTime}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location-outline" size={13} color="#75759E" />
                <Text style={{ fontSize: 12, color: '#75759E', marginLeft: 4 }}>{appt.detail}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
