import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import api from "../../services/api";

const STATUS_OPTIONS = ["New", "In Progress", "Support Provided", "Resolved", "Closed"];

const STATUS_TO_API: Record<string, string> = {
  New: "NEW",
  "In Progress": "UNDER_INVESTIGATION",
  "Support Provided": "SUPPORT_PROVIDED",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
};

interface Worker {
  id: string;
  user: { name: string };
}

export const SWCaseDetailScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const caseId = route?.params?.id;

  const [caseData, setCaseData] = useState<any>(null);
  const [caseNumber, setCaseNumber] = useState("");
  const [status, setStatus] = useState("In Progress");
  const [assignedWorkerId, setAssignedWorkerId] = useState<string>("");
  const [assigneeName, setAssigneeName] = useState("Unassigned");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load case data and workers list in parallel
  useEffect(() => {
    if (!caseId) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const [caseRes, workersRes] = await Promise.all([
          api.get(`/cases/${caseId}`),
          api.get("/social-workers"),
        ]);

        const c = caseRes.data;
        setCaseData(c);
        setCaseNumber(c.caseNumber ?? "");

        const displayStatus =
          Object.entries(STATUS_TO_API).find(([, v]) => v === c.status)?.[0] ??
          "In Progress";
        setStatus(displayStatus);
        setNotes(c.notes ?? "");

        if (c.assignedWorkerId) {
          setAssignedWorkerId(c.assignedWorkerId);
        }
        if (c.assignedWorker?.user?.name) {
          setAssigneeName(c.assignedWorker.user.name);
        }

        setWorkers(workersRes.data);
      } catch (e: any) {
        Alert.alert(
          "Error",
          e?.response?.data?.error ?? "Failed to load case details.",
        );
        navigation?.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  const handleReassign = async (worker: Worker) => {
    setShowAssigneePicker(false);
    try {
      setSaving(true);
      await api.put(`/cases/${caseId}/assign`, { workerId: worker.id });
      setAssignedWorkerId(worker.id);
      setAssigneeName(worker.user.name);
      Alert.alert("✅ Reassigned", `Case reassigned to ${worker.user.name}`);
    } catch (e: any) {
      Alert.alert("Error", e?.response?.data?.error ?? "Failed to reassign case.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/cases/${caseId}`, {
        status: STATUS_TO_API[status],
        notes: notes || undefined,
      });
      Alert.alert(
        "✅ Case Updated",
        "Case status and notes updated successfully!",
        [{ text: "OK", onPress: () => navigation?.goBack() }],
      );
    } catch (e: any) {
      Alert.alert(
        "Error",
        e?.response?.data?.error ?? "Failed to update case.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8F9FE" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Header Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: (insets.top || StatusBar.currentHeight || 24) + 8,
          paddingBottom: 12,
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F5",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={{ padding: 6, marginLeft: -6 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: "800", color: "#1E1E2D" }}>
            Update Case
          </Text>
          <Text style={{ fontSize: 12, color: "#75759E", fontWeight: "600" }}>
            {caseNumber || "SPC-2026-00001"}
          </Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#5B3FD3" />
          <Text style={{ marginTop: 12, color: "#75759E" }}>
            Loading case details...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Incident context */}
          {caseData && (
            <View
              style={{
                backgroundColor: "#F0EDFF",
                borderRadius: 14,
                padding: 16,
                marginBottom: 24,
                borderLeftWidth: 4,
                borderLeftColor: "#5B3FD3",
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#5B3FD3", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Incident Details
              </Text>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#1E1E2D", marginBottom: 4 }}>
                {caseData.incident?.category?.replace(/_/g, " ") ?? "N/A"}
              </Text>
              <Text style={{ fontSize: 13, color: "#75759E" }}>
                {caseData.incident?.location ?? "Location not provided"}
              </Text>
              <Text style={{ fontSize: 13, color: "#75759E", marginTop: 2 }}>
                Victim: {caseData.incident?.victim?.user?.name ?? "Anonymous"}
              </Text>
            </View>
          )}

          {/* Status Selector */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D", marginBottom: 8 }}>
            Case Status
          </Text>
          <TouchableOpacity
            onPress={() => setShowStatusPicker(true)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1.5,
              borderColor: "#E8E8F0",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 15, color: "#1E1E2D", fontWeight: "600" }}>{status}</Text>
            <Ionicons name="chevron-down" size={18} color="#75759E" />
          </TouchableOpacity>

          {/* Assignee Selector */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D", marginBottom: 8 }}>
            Assigned Social Worker
          </Text>
          <TouchableOpacity
            onPress={() => setShowAssigneePicker(true)}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              borderWidth: 1.5,
              borderColor: "#E8E8F0",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="person-outline" size={18} color="#5B3FD3" />
              <Text style={{ fontSize: 15, color: "#1E1E2D", fontWeight: "600" }}>{assigneeName}</Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#75759E" />
          </TouchableOpacity>

          {/* Notes */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E1E2D", marginBottom: 8 }}>
            Case Notes
          </Text>
          <TextInput
            style={{
              backgroundColor: "#FFFFFF",
              borderWidth: 1.5,
              borderColor: "#E8E8F0",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 14,
              color: "#1E1E2D",
              minHeight: 120,
              textAlignVertical: "top",
              marginBottom: 32,
            }}
            placeholder="Add progress notes, observations, or next steps..."
            placeholderTextColor="#A0A0B0"
            multiline
            numberOfLines={5}
            value={notes}
            onChangeText={setNotes}
          />

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={{
              backgroundColor: saving ? "#A0A0C0" : "#5B3FD3",
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              shadowColor: "#5B3FD3",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Status Picker Modal */}
      <Modal
        visible={showStatusPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
          activeOpacity={1}
          onPress={() => setShowStatusPicker(false)}
        >
          <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D", marginBottom: 16 }}>
              Select Status
            </Text>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => { setStatus(opt); setShowStatusPicker(false); }}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: status === opt ? "#F0EDFF" : "transparent",
                  marginBottom: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 15, color: status === opt ? "#5B3FD3" : "#1E1E2D", fontWeight: status === opt ? "700" : "500" }}>
                  {opt}
                </Text>
                {status === opt && <Ionicons name="checkmark-circle" size={20} color="#5B3FD3" />}
              </TouchableOpacity>
            ))}
            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Assignee Picker Modal */}
      <Modal
        visible={showAssigneePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssigneePicker(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" }}
          activeOpacity={1}
          onPress={() => setShowAssigneePicker(false)}
        >
          <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#1E1E2D", marginBottom: 16 }}>
              Reassign Case
            </Text>
            {workers.map((w) => (
              <TouchableOpacity
                key={w.id}
                onPress={() => handleReassign(w)}
                style={{
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  backgroundColor: assignedWorkerId === w.id ? "#F0EDFF" : "transparent",
                  marginBottom: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#F0EDFF", alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#5B3FD3" }}>
                      {w.user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 15, color: assignedWorkerId === w.id ? "#5B3FD3" : "#1E1E2D", fontWeight: assignedWorkerId === w.id ? "700" : "500" }}>
                    {w.user.name}
                  </Text>
                </View>
                {assignedWorkerId === w.id && <Ionicons name="checkmark-circle" size={20} color="#5B3FD3" />}
              </TouchableOpacity>
            ))}
            <View style={{ height: 20 }} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
