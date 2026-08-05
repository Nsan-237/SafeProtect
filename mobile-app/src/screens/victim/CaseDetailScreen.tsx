import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "#E3F2FD", text: "#1565C0" },
  UNDER_INVESTIGATION: { bg: "#FFF3E0", text: "#E65100" },
  SUPPORT_PROVIDED: { bg: "#FFF3E0", text: "#E65100" },
  RESOLVED: { bg: "#E8F5E9", text: "#2E7D32" },
  CLOSED: { bg: "#F3E5F5", text: "#6A1B9A" },
};

const CATEGORY_LABEL: Record<string, string> = {
  PHYSICAL_ABUSE: "Physical Abuse",
  SEXUAL_ABUSE: "Sexual Abuse",
  DOMESTIC_VIOLENCE: "Domestic Violence",
  EMOTIONAL_ABUSE: "Emotional Abuse",
  NEGLECT: "Neglect",
  OTHER: "Other",
};

const STATUS_LABEL: Record<string, string> = {
  NEW: "New",
  UNDER_INVESTIGATION: "In Progress",
  SUPPORT_PROVIDED: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

export const CaseDetailScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const caseId = route?.params?.id;
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!caseId) {
      setError("No case ID provided.");
      setLoading(false);
      return;
    }
    const fetchCase = async () => {
      try {
        const res = await api.get(`/cases/${caseId}`);
        setCaseData(res.data);
      } catch (e: any) {
        setError(e?.response?.data?.error || "Failed to load case.");
      } finally {
        setLoading(false);
      }
    };
    fetchCase();
  }, [caseId]);

  const statusColors = caseData
    ? (STATUS_COLORS[caseData.status] ?? { bg: "#F5F5F5", text: "#757575" })
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            Case Details
          </Text>
        </View>
        <TouchableOpacity style={{ padding: 6 }}>
          <Ionicons name="ellipsis-vertical" size={20} color="#1E1E2D" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#5B3FD3" />
          <Text style={{ marginTop: 12, color: "#75759E", fontSize: 14 }}>
            Loading case...
          </Text>
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
        >
          <Ionicons name="alert-circle-outline" size={48} color="#FF2E55" />
          <Text
            style={{
              color: "#FF2E55",
              fontSize: 15,
              fontWeight: "600",
              marginTop: 12,
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Case ID + Status Badge */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              padding: 16,
              borderRadius: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#F0F0F5",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#1E1E2D" }}>
              {caseData.caseNumber}
            </Text>
            <View
              style={{
                backgroundColor: statusColors?.bg,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
              }}
            >
              <Text
                style={{
                  color: statusColors?.text,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {STATUS_LABEL[caseData.status] ?? caseData.status}
              </Text>
            </View>
          </View>

          {/* Incident Information */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 20,
              borderRadius: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: "#F0F0F5",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: "#1E1E2D",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F5F5F8",
              }}
            >
              Incident Information
            </Text>
            {[
              {
                label: "Type",
                value:
                  CATEGORY_LABEL[caseData.incident?.category] ??
                  caseData.incident?.category ??
                  "—",
              },
              {
                label: "Reported On",
                value: caseData.incident?.date
                  ? new Date(caseData.incident.date).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : "—",
              },
              { label: "Location", value: caseData.incident?.location ?? "—" },
              {
                label: "Reported By",
                value: caseData.incident?.isAnonymous
                  ? "Anonymous"
                  : (caseData.incident?.victim?.user?.name ?? "—"),
              },
            ].map(({ label, value }) => (
              <View
                key={label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "#75759E", fontSize: 13 }}>{label}</Text>
                <Text
                  style={{
                    color: "#1E1E2D",
                    fontSize: 13,
                    fontWeight: "600",
                    maxWidth: "60%",
                    textAlign: "right",
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>

          {/* Victim Information */}
          <View
            style={{
              backgroundColor: "#FFFFFF",
              padding: 20,
              borderRadius: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#F0F0F5",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "800",
                color: "#1E1E2D",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F5F5F8",
              }}
            >
              Victim Information
            </Text>
            {[
              {
                label: "Name",
                value: caseData.incident?.isAnonymous
                  ? "Anonymous"
                  : (caseData.incident?.victim?.user?.name ?? "—"),
              },
              {
                label: "Age",
                value: caseData.incident?.victim?.age
                  ? String(caseData.incident.victim.age)
                  : "—",
              },
              {
                label: "Gender",
                value: caseData.incident?.victim?.gender ?? "—",
              },
              {
                label: "Contact",
                value: caseData.incident?.isAnonymous
                  ? "Hidden"
                  : (caseData.incident?.victim?.user?.phone ?? "—"),
              },
            ].map(({ label, value }) => (
              <View
                key={label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}
              >
                <Text style={{ color: "#75759E", fontSize: 13 }}>{label}</Text>
                <Text
                  style={{
                    color: value === "Hidden" ? "#75759E" : "#1E1E2D",
                    fontSize: 13,
                    fontWeight: "600",
                    fontStyle: value === "Hidden" ? "italic" : "normal",
                    maxWidth: "60%",
                    textAlign: "right",
                  }}
                >
                  {value}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};
