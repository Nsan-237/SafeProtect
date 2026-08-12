import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface AppointmentAPIItem {
  id: string;
  victimId: string;
  organizationId: string;
  socialWorkerId: string;
  title: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes: string;
  createdAt: string;
  victim?: { user?: { name: string; email: string } };
  organization?: { id: string; name: string; location: string };
  socialWorker?: { user?: { name: string } };
}

interface AppointmentItem {
  id: string;
  title: string;
  dateTime: string;
  detail: string;
  status: string;
}

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { bg: string; text: string }> = {
    Confirmed: { bg: "#E8F5E9", text: "#2E7D32" },
    Pending: { bg: "#FFF3E0", text: "#E65100" },
    Completed: { bg: "#E3F2FD", text: "#1565C0" },
    Cancelled: { bg: "#FFEBEE", text: "#C62828" },
  };
  const s = map[status] ?? { bg: "#F5F5F5", text: "#757575" };
  return (
    <View
      style={{
        backgroundColor: s.bg,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
      }}
    >
      <Text style={{ color: s.text, fontSize: 11, fontWeight: "700" }}>
        {status}
      </Text>
    </View>
  );
};

export const SWAppointmentsScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth(); // If auth context is needed
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );
  
  const [scheduleData, setScheduleData] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get('/appointments');
      const apiData: AppointmentAPIItem[] = response.data;
      
      const mappedData: AppointmentItem[] = apiData.map(item => {
        let mappedStatus = item.status;
        if (item.status === 'SCHEDULED') mappedStatus = 'Confirmed';
        else if (item.status === 'COMPLETED') mappedStatus = 'Completed';
        else if (item.status === 'CANCELLED') mappedStatus = 'Cancelled';
        
        let dateStr = item.date;
        try {
          const d = new Date(item.date);
          const month = d.toLocaleString('default', { month: 'short' });
          dateStr = `${d.getDate().toString().padStart(2, '0')} ${month} ${d.getFullYear()}`;
        } catch(e) {}
        
        const timeStr = item.time ? item.time : '';
        const dateTimeStr = timeStr ? `${dateStr} • ${timeStr}` : dateStr;
        
        const detailStr = item.organization?.location || item.organization?.name || 'No location provided';
        
        return {
          id: item.id,
          title: item.title || 'Appointment',
          dateTime: dateTimeStr,
          detail: detailStr,
          status: mappedStatus,
        };
      });
      
      setScheduleData(mappedData);
    } catch (err: any) {
      console.error('Error fetching appointments:', err);
      setError(err.response?.data?.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, [fetchAppointments]);

  const displayed =
    activeTab === "upcoming"
      ? scheduleData.filter((a) => a.status !== "Completed" && a.status !== "Cancelled")
      : scheduleData.filter((a) => a.status === "Completed" || a.status === "Cancelled");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: "#1E1E2D",
            marginBottom: 16,
          }}
        >
          My Schedule
        </Text>
        <View style={{ flexDirection: "row" }}>
          {(["upcoming", "history"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: "center",
                borderBottomWidth: 2.5,
                borderBottomColor:
                  activeTab === tab ? "#5B3FD3" : "transparent",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: activeTab === tab ? "#5B3FD3" : "#75759E",
                  textTransform: "capitalize",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#5B3FD3" />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#5B3FD3" style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
            <Text
              style={{
                color: "#1E1E2D",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              Error Loading Appointments
            </Text>
            <Text
              style={{
                color: "#75759E",
                fontSize: 13,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              {error}
            </Text>
            <TouchableOpacity 
              onPress={fetchAppointments}
              style={{ marginTop: 16, backgroundColor: '#5B3FD3', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 }}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : displayed.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="calendar-outline" size={52} color="#B0B0C8" />
            <Text
              style={{
                color: "#75759E",
                fontSize: 15,
                marginTop: 12,
                fontWeight: "600",
              }}
            >
              No {activeTab} appointments
            </Text>
          </View>
        ) : (
          displayed.map((appt) => (
            <View
              key={appt.id}
              style={{
                backgroundColor: "#FFFFFF",
                padding: 18,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#F0F0F5",
                marginBottom: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "800",
                    color: "#1E1E2D",
                    flex: 1,
                    marginRight: 8,
                  }}
                >
                  {appt.title}
                </Text>
                <StatusBadge status={appt.status} />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Ionicons name="time-outline" size={13} color="#5B3FD3" />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#5B3FD3",
                    marginLeft: 4,
                  }}
                >
                  {appt.dateTime}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="location-outline" size={13} color="#75759E" />
                <Text style={{ fontSize: 12, color: "#75759E", marginLeft: 4 }}>
                  {appt.detail}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
