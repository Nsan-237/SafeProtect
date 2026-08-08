import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { Case } from "../../types";

export const CaseListScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<
    "All" | "New" | "In Progress" | "Resolved"
  >("All");

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

      let filteredCases = allCases;
      if (user?.role === "VICTIM" && user?.victimProfile?.id) {
        filteredCases = allCases.filter(
          (c: any) => c.incident?.victimId === user.victimProfile?.id,
        );
      } else if (
        user?.role === "SOCIAL_WORKER" &&
        user?.socialWorkerProfile?.id
      ) {
        filteredCases = allCases.filter(
          (c: any) => c.assignedWorkerId === user.socialWorkerProfile?.id,
        );
      }

      const mapPriority = (priority: string) => {
        switch (priority) {
          case "LOW":
            return "Low" as const;
          case "MEDIUM":
            return "Medium" as const;
          case "HIGH":
            return "High" as const;
          case "CRITICAL":
            return "Critical" as const;
          default:
            return "High" as const;
        }
      };

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
          riskLevel: mapPriority(c.priority),
          victimId: c.incident?.victimId || "",
        }),
      );

      setCases(mapped);
    } catch (err) {
      console.error("Error fetching cases in list screen:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases]),
  );

  const handleCasePress = (c: Case) => {
    if (user?.role === "VICTIM") {
      navigation.navigate("CaseDetail", { id: c.id });
    } else {
      navigation.navigate("UpdateCase", { id: c.id });
    }
  };

  const getFilteredCases = () => {
    return cases.filter((c) => {
      const matchesFilter =
        selectedFilter === "All" || c.status === selectedFilter;
      const matchesSearch =
        c.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  };

  const filteredCasesList = getFilteredCases();

  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Header section with search */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: "800",
            color: "#1E1E2D",
            marginBottom: 12,
          }}
        >
          {user?.role === "VICTIM" ? "My Reports" : "Assigned Cases"}
        </Text>

        {/* Search Input */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#F8F9FE",
            borderRadius: 12,
            paddingHorizontal: 12,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: "#E8E8F0",
          }}
        >
          <Ionicons name="search-outline" size={18} color="#75759E" />
          <TextInput
            placeholder="Search by Case ID, type, location..."
            placeholderTextColor="#B0B0C8"
            style={{
              flex: 1,
              paddingVertical: 10,
              marginLeft: 8,
              fontSize: 14,
              color: "#1E1E2D",
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#75759E" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter pills */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(["All", "New", "In Progress", "Resolved"] as const).map(
            (filter) => {
              const isActive = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: isActive ? "#5B3FD3" : "#F0F0F5",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: isActive ? "#FFFFFF" : "#75759E",
                    }}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>
      </View>

      {/* Cases list */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color="#5B3FD3"
            style={{ marginTop: 24 }}
          />
        ) : filteredCasesList.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 48 }}>
            <Ionicons name="folder-open-outline" size={48} color="#B0B0C8" />
            <Text
              style={{
                color: "#1E1E2D",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 12,
              }}
            >
              No Cases Found
            </Text>
            <Text
              style={{
                color: "#75759E",
                fontSize: 13,
                marginTop: 4,
                textAlign: "center",
              }}
            >
              We couldn't find any cases matching your filters.
            </Text>
          </View>
        ) : (
          filteredCasesList.map((c) => {
            const isResolved = c.status === "Resolved";
            const isEmergency =
              c.riskLevel === "High" || c.riskLevel === "Critical";

            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => handleCasePress(c)}
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
                    marginBottom: 6,
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
                      {user?.role === "VICTIM" ? "Details" : "Update"}
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
