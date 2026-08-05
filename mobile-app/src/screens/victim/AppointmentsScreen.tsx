import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const upcomingAppointments = [
  {
    id: "1",
    title: "Counseling Session",
    dateTime: "07 Jun 2024 • 10:00 AM",
    detail: "With: Counselor Beatrice",
    status: "Confirmed",
  },
  {
    id: "2",
    title: "Medical Examination",
    dateTime: "08 Jun 2024 • 11:30 AM",
    detail: "At: Central Hospital",
    status: "Confirmed",
  },
  {
    id: "3",
    title: "Legal Consultation",
    dateTime: "10 Jun 2024 • 2:00 PM",
    detail: "With: Me Nguema",
    status: "Pending",
  },
];

const historyAppointments = [
  {
    id: "h1",
    title: "Initial Assessment",
    dateTime: "20 May 2024 • 9:00 AM",
    detail: "At: Social Welfare Office",
    status: "Completed",
  },
  {
    id: "h2",
    title: "Medical Check-up",
    dateTime: "25 May 2024 • 3:00 PM",
    detail: "At: Central Hospital",
    status: "Completed",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, { bg: string; text: string }> = {
    Confirmed: { bg: "#E8F5E9", text: "#2E7D32" },
    Pending: { bg: "#FFF3E0", text: "#E65100" },
    Completed: { bg: "#E3F2FD", text: "#1565C0" },
    Cancelled: { bg: "#FFEBEE", text: "#C62828" },
  };
  const s = styles[status] ?? { bg: "#F5F5F5", text: "#757575" };
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

export const AppointmentsScreen = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  const appointments =
    activeTab === "upcoming" ? upcomingAppointments : historyAppointments;

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 0,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={{ padding: 6, marginLeft: -6 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: "#1E1E2D",
              marginLeft: 12,
            }}
          >
            Appointments
          </Text>
        </View>

        {/* Segmented Tabs */}
        <View style={{ flexDirection: "row" }}>
          {(["upcoming", "history"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  alignItems: "center",
                  borderBottomWidth: 2.5,
                  borderBottomColor: isActive ? "#5B3FD3" : "transparent",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: isActive ? "#5B3FD3" : "#75759E",
                    textTransform: "capitalize",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Appointments List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {appointments.length === 0 ? (
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
          appointments.map((appt) => (
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

      {/* Sticky Book Button - only on Upcoming tab */}
      {activeTab === "upcoming" && (
        <View
          style={{
            padding: 16,
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#F0F0F5",
            paddingBottom: 24,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#5B3FD3",
              paddingVertical: 15,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#5B3FD3",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
            onPress={() => alert("Book appointment workflow coming soon!")}
            activeOpacity={0.85}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 16 }}>
              Book Appointment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
