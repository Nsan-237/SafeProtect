import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { Case } from "../../types";

export const SWDashboardScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/cases");
      const allCases = response.data;

      const mapCategory = (cat: string) => {
        switch (cat) {
          case "PHYSICAL_ABUSE":
            return "Physical Abuse";
          case "SEXUAL_ABUSE":
            return "Sexual Abuse";
          case "DOMESTIC_VIOLENCE":
            return "Domestic Violence";
          case "EMOTIONAL_ABUSE":
            return "Emotional Abuse";
          case "NEGLECT":
            return "Neglect";
          default:
            return "Other";
        }
      };

      const mapStatus = (status: string) => {
        switch (status) {
          case "NEW":
            return "New";
          case "UNDER_INVESTIGATION":
            return "In Progress";
          case "SUPPORT_PROVIDED":
            return "In Progress";
          case "RESOLVED":
            return "Resolved";
          case "CLOSED":
            return "Resolved";
          default:
            return "New";
        }
      };

      const swId = user?.socialWorkerProfile?.id;
      const filteredCases = swId
        ? allCases.filter((c: any) => c.assignedWorkerId === swId)
        : allCases;

      const mapped = filteredCases.map(
        (c: any): Case => ({
          id: c.id,
          caseId: c.caseNumber,
          type: mapCategory(c.incident?.category),
          status: mapStatus(c.status) as any,
          date: new Date(c.incident?.date || c.createdAt).toLocaleDateString(
            "en-GB",
            { day: "numeric", month: "short", year: "numeric" },
          ),
          location: c.incident?.location || "Yaoundé",
          description: c.incident?.description || "",
          riskLevel: c.riskLevel || "High",
          victimId: c.incident?.victimId || "",
        }),
      );

      setCases(mapped);
    } catch (err) {
      console.error("Error fetching cases in SW dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases]),
  );

  // Metrics (matching reference Web Dashboard cards)
  const totalAssigned = cases.length;
  const activeCount = cases.filter(
    (c) => c.status === "In Progress" || c.status === "New",
  ).length;
  const urgentCount = cases.filter(
    (c) => c.riskLevel === "High" || c.riskLevel === "Critical",
  ).length;
  const resolvedCount = cases.filter((c) => c.status === "Resolved").length;

  const stats = [
    {
      label: "Total Cases",
      val: totalAssigned,
      badge: "↑ 12%",
      color: "#5B3FD3",
      bg: "#F0EDFF",
      icon: "document-text-outline" as const,
    },
    {
      label: "Active Cases",
      val: activeCount,
      badge: "↑ 8%",
      color: "#1565C0",
      bg: "#E3F2FD",
      icon: "sync-outline" as const,
    },
    {
      label: "Urgent Cases",
      val: urgentCount,
      badge: "↑ 3%",
      color: "#FF2E55",
      bg: "#FFF0F3",
      icon: "alert-circle-outline" as const,
    },
    {
      label: "Closed Cases",
      val: resolvedCount,
      badge: "↑ 15%",
      color: "#2E7D32",
      bg: "#E8F5E9",
      icon: "checkmark-circle-outline" as const,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1248" />

      {/* Header Band */}
      <View
        style={{
          backgroundColor: "#1E1248",
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 16,
          paddingBottom: 28,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          shadowColor: "#1E1248",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#5B3FD3",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 14,
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.2)",
              }}
            >
              <Text
                style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "800" }}
              >
                {(user?.name || "S").charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.65)",
                  fontWeight: "600",
                }}
              >
                Social Worker Dashboard
              </Text>
              <Text
                style={{ fontSize: 20, fontWeight: "800", color: "#FFFFFF" }}
              >
                {user?.name || "Aline Ndey"}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "rgba(91,63,211,0.5)",
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 16,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>
              ON DUTY
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Metric Cards Grid (Matching Web Dashboard cards) */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: "#75759E",
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 12,
          }}
        >
          Overview & Metrics
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {stats.map((s) => (
            <View
              key={s.label}
              style={{
                width: "48%",
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: "#F0F0F5",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: s.bg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={s.icon} size={20} color={s.color} />
                </View>
                <View
                  style={{
                    backgroundColor: s.bg,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{ color: s.color, fontSize: 10, fontWeight: "800" }}
                  >
                    {s.badge}
                  </Text>
                </View>
              </View>

              <Text
                style={{
                  fontSize: 26,
                  fontWeight: "900",
                  color: "#1E1E2D",
                  marginBottom: 2,
                }}
              >
                {loading ? "—" : s.val}
              </Text>
              <Text
                style={{ fontSize: 11, color: "#75759E", fontWeight: "600" }}
              >
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Action Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("Cases")}
            activeOpacity={0.85}
            style={{
              flex: 1,
              marginRight: 6,
              backgroundColor: "#5B3FD3",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              shadowColor: "#5B3FD3",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Ionicons
              name="folder-open-outline"
              size={18}
              color="#FFFFFF"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 13 }}>
              All Cases
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Appointments")}
            activeOpacity={0.85}
            style={{
              flex: 1,
              marginLeft: 6,
              backgroundColor: "#FFFFFF",
              borderWidth: 1.5,
              borderColor: "#5B3FD3",
              paddingVertical: 14,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#5B3FD3"
              style={{ marginRight: 6 }}
            />
            <Text style={{ color: "#5B3FD3", fontWeight: "800", fontSize: 13 }}>
              Schedule
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Cases Section */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#75759E",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Assigned Incidents & Cases
          </Text>
          {cases.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate("Cases")}>
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#5B3FD3" }}
              >
                View All
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color="#5B3FD3"
            style={{ marginVertical: 24 }}
          />
        ) : cases.length === 0 ? (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#F0F0F5",
            }}
          >
            <Ionicons name="shield-outline" size={40} color="#B0B0C8" />
            <Text
              style={{
                color: "#1E1E2D",
                fontSize: 14,
                fontWeight: "700",
                marginTop: 10,
              }}
            >
              No Assigned Cases
            </Text>
            <Text
              style={{
                color: "#75759E",
                fontSize: 12,
                textAlign: "center",
                marginTop: 4,
              }}
            >
              New incidents assigned to your profile will appear here.
            </Text>
          </View>
        ) : (
          cases.slice(0, 5).map((c) => {
            const isResolved = c.status === "Resolved";
            const isEmergency =
              c.riskLevel === "High" || c.riskLevel === "Critical";

            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => navigation.navigate("UpdateCase", { id: c.id })}
                activeOpacity={0.8}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: isEmergency ? "#FFD6DE" : "#F0F0F5",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "800",
                        color: "#1E1E2D",
                        marginRight: 8,
                      }}
                    >
                      {c.caseId}
                    </Text>
                    {isEmergency && (
                      <View
                        style={{
                          backgroundColor: "#FFE5EA",
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: "#FF2E55",
                            fontSize: 10,
                            fontWeight: "800",
                          }}
                        >
                          URGENT
                        </Text>
                      </View>
                    )}
                  </View>

                  <View
                    style={{
                      backgroundColor: isResolved ? "#E8F5E9" : "#FFF3E0",
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        color: isResolved ? "#2E7D32" : "#E65100",
                        fontSize: 11,
                        fontWeight: "700",
                      }}
                    >
                      {c.status}
                    </Text>
                  </View>
                </View>

                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: "#5B3FD3",
                    marginBottom: 4,
                  }}
                >
                  {c.type}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="location-outline"
                      size={13}
                      color="#75759E"
                      style={{ marginRight: 3 }}
                    />
                    <Text style={{ fontSize: 12, color: "#75759E" }}>
                      {c.location} • {c.date}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#5B3FD3",
                        marginRight: 4,
                      }}
                    >
                      Update
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#5B3FD3"
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
