import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

const STATUS_OPTIONS = ['New', 'In Progress', 'Resolved', 'Closed'];

const STATUS_TO_API: Record<string, string> = {
  'New':         'NEW',
  'In Progress': 'UNDER_INVESTIGATION',
  'Resolved':    'RESOLVED',
  'Closed':      'CLOSED',
};

const WORKER_OPTIONS = [
  'Aline Ndey (Social Worker)',
  'Eric Tchana (Social Worker)',
  'Unassigned',
];

export const SWCaseDetailScreen = ({ navigation, route }: any) => {
  const caseId = route?.params?.id;

  const [caseData, setCaseData]         = useState<any>(null);
  const [caseNumber, setCaseNumber]     = useState('');
  const [status, setStatus]             = useState('In Progress');
  const [assignee, setAssignee]         = useState('Aline Ndey (Social Worker)');
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [showAssigneePicker, setShowAssigneePicker] = useState(false);
  const [notes, setNotes]               = useState('');
  const [followUpDate, setFollowUpDate] = useState('07/06/2024');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);

  // Load existing case data
  useEffect(() => {
    if (!caseId) { setLoading(false); return; }
    const load = async () => {
      try {
        const res = await api.get(`/cases/${caseId}`);
        const c   = res.data;
        setCaseData(c);
        setCaseNumber(c.caseNumber ?? 'SPC-2026-00001');

        const displayStatus = Object.entries(STATUS_TO_API).find(([, v]) => v === c.status)?.[0] ?? 'In Progress';
        setStatus(displayStatus);
        setNotes(c.notes ?? 'Initial assessment done. Patient referred for medical examination and counseling.');
        if (c.assignedWorker?.user?.name) {
          setAssignee(`${c.assignedWorker.user.name} (Social Worker)`);
        }
      } catch (e: any) {
        Alert.alert('Error', e?.response?.data?.error ?? 'Failed to load case details.');
        navigation?.goBack();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/cases/${caseId}`, {
        status: STATUS_TO_API[status],
        notes: notes || undefined,
      });
      Alert.alert('✅ Case Updated', 'Case status and notes updated successfully!', [
        { text: 'OK', onPress: () => navigation?.goBack() },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.error ?? 'Failed to update case.');
    } finally {
      setSaving(false);
    }
  };

  const quickDates = ['07/06/2024', '14/06/2024', '21/06/2024', '30/06/2024'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />

      {/* Header Bar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F5',
      }}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 6, marginLeft: -6 }}>
          <Ionicons name="arrow-back" size={24} color="#1E1E2D" />
        </TouchableOpacity>
        <View style={{ marginLeft: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1E1E2D' }}>Update Case</Text>
          <Text style={{ fontSize: 12, color: '#75759E', fontWeight: '600' }}>{caseNumber || 'SPC-2026-00001'}</Text>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#5B3FD3" />
          <Text style={{ marginTop: 12, color: '#75759E' }}>Loading case details...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          {/* Incident Context Banner */}
          {caseData && (
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: '#F0F0F5',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', marginBottom: 4 }}>
                Incident Summary
              </Text>
              <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E1E2D', marginBottom: 2 }}>
                {caseData.incident?.category?.replace('_', ' ') || 'Domestic Violence'}
              </Text>
              <Text style={{ fontSize: 12, color: '#75759E' }}>
                Location: {caseData.incident?.location || 'Yaoundé, Mfoundi'} • Reported: {new Date(caseData.createdAt).toLocaleDateString('en-GB')}
              </Text>
            </View>
          )}

          {/* Status Dropdown */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
              Status
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowStatusPicker(!showStatusPicker)}
              style={{
                backgroundColor: '#FFFFFF',
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: showStatusPicker ? '#5B3FD3' : '#E8E8F0',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E1E2D' }}>{status}</Text>
              <Ionicons name={showStatusPicker ? 'chevron-up' : 'chevron-down'} size={20} color="#75759E" />
            </TouchableOpacity>

            {showStatusPicker && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E8E8F0',
                marginTop: 6,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}>
                {STATUS_OPTIONS.map((opt, i) => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => { setStatus(opt); setShowStatusPicker(false); }}
                    style={{
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: i !== STATUS_OPTIONS.length - 1 ? 1 : 0,
                      borderBottomColor: '#F5F5F8',
                      backgroundColor: status === opt ? '#F0EDFF' : '#FFFFFF',
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '700', color: status === opt ? '#5B3FD3' : '#1E1E2D' }}>{opt}</Text>
                    {status === opt && <Ionicons name="checkmark-circle" size={18} color="#5B3FD3" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Assign To Dropdown (Matches Reference Image Screen 2) */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
              Assign To
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowAssigneePicker(!showAssigneePicker)}
              style={{
                backgroundColor: '#FFFFFF',
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: showAssigneePicker ? '#5B3FD3' : '#E8E8F0',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E2D' }}>{assignee}</Text>
              <Ionicons name={showAssigneePicker ? 'chevron-up' : 'chevron-down'} size={20} color="#75759E" />
            </TouchableOpacity>

            {showAssigneePicker && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E8E8F0',
                marginTop: 6,
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 4,
              }}>
                {WORKER_OPTIONS.map((w, i) => (
                  <TouchableOpacity
                    key={w}
                    onPress={() => { setAssignee(w); setShowAssigneePicker(false); }}
                    style={{
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottomWidth: i !== WORKER_OPTIONS.length - 1 ? 1 : 0,
                      borderBottomColor: '#F5F5F8',
                      backgroundColor: assignee === w ? '#F0EDFF' : '#FFFFFF',
                    }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: assignee === w ? '#5B3FD3' : '#1E1E2D' }}>{w}</Text>
                    {assignee === w && <Ionicons name="checkmark-circle" size={18} color="#5B3FD3" />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Case Notes Multiline Input */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
              Case Notes
            </Text>
            <TextInput
              style={{
                backgroundColor: '#FFFFFF',
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: '#E8E8F0',
                fontSize: 14,
                color: '#1E1E2D',
                minHeight: 120,
                lineHeight: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
              multiline
              textAlignVertical="top"
              placeholder="Initial assessment done. Patient referred for medical examination and counseling."
              placeholderTextColor="#B0B0C8"
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Next Action / Follow-up Date */}
          <View style={{ marginBottom: 32 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
              Next Action / Follow-up
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(!showDatePicker)}
              style={{
                backgroundColor: '#FFFFFF',
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: showDatePicker ? '#5B3FD3' : '#E8E8F0',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#1E1E2D' }}>
                {followUpDate || '07/06/2024'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#75759E" />
            </TouchableOpacity>

            {showDatePicker && (
              <View style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E8E8F0',
                marginTop: 6,
                padding: 14,
              }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#75759E', marginBottom: 10 }}>Select Date:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {quickDates.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => { setFollowUpDate(d); setShowDatePicker(false); }}
                      style={{
                        backgroundColor: followUpDate === d ? '#5B3FD3' : '#F0F0F5',
                        paddingHorizontal: 14,
                        paddingVertical: 8,
                        borderRadius: 10,
                      }}
                    >
                      <Text style={{ color: followUpDate === d ? '#FFFFFF' : '#1E1E2D', fontSize: 13, fontWeight: '700' }}>
                        {d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Save Changes Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.85}
            style={{
              backgroundColor: saving ? '#8B6FF7' : '#5B3FD3',
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              shadowColor: '#5B3FD3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
          >
            {saving ? <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} /> : null}
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
              {saving ? 'Saving Changes...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      )}
    </SafeAreaView>
  );
};
