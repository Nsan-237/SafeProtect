import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  organization?: { id: string; name: string };
  socialWorker?: { user: { name: string } };
}

export const AppointmentsScreen = () => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'History'>('Upcoming');
  
  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    date: '',
    time: '',
    type: 'General Counseling',
    notes: '',
  });

  const fetchAppointments = async () => {
    try {
      setError(null);
      const res = await api.get('/appointments');
      setAppointments(res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  const handleBookAppointment = async () => {
    if (!newAppointment.title || !newAppointment.date || !newAppointment.time) {
      Alert.alert('Error', 'Please fill in the title, date, and time fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/appointments', newAppointment);
      setModalVisible(false);
      setNewAppointment({ title: '', date: '', time: '', type: 'General Counseling', notes: '' });
      fetchAppointments();
      Alert.alert('Success', 'Appointment booked successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (activeTab === 'Upcoming') {
      return app.status === 'SCHEDULED';
    }
    return app.status === 'COMPLETED' || app.status === 'CANCELLED';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'COMPLETED':
        return { bg: '#E3F2FD', text: '#1565C0' };
      case 'CANCELLED':
        return { bg: '#FFEBEE', text: '#C62828' };
      default:
        return { bg: '#FFF3E0', text: '#E65100' };
    }
  };

  const renderItem = ({ item }: { item: Appointment }) => {
    const statusColors = getStatusColor(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={[styles.badge, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.badgeText, { color: statusColors.text }]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#75759E" />
            <Text style={styles.detailText}>{new Date(item.date).toLocaleDateString()} at {item.time}</Text>
          </View>

          {item.organization && (
            <View style={styles.detailRow}>
              <Ionicons name="business-outline" size={16} color="#75759E" />
              <Text style={styles.detailText}>{item.organization.name}</Text>
            </View>
          )}

          {item.socialWorker && (
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={16} color="#75759E" />
              <Text style={styles.detailText}>Social Worker: {item.socialWorker.user.name}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Ionicons name="list-outline" size={16} color="#75759E" />
            <Text style={styles.detailText}>{item.type}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#D0D0E0" />
      <Text style={styles.emptyTitle}>No appointments found</Text>
      <Text style={styles.emptyText}>
        {activeTab === 'Upcoming' 
          ? "You don't have any upcoming appointments scheduled."
          : "You don't have any past appointments."}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('Upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'Upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'History' && styles.activeTab]}
          onPress={() => setActiveTab('History')}
        >
          <Text style={[styles.tabText, activeTab === 'History' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#5B3FD3" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchAppointments}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5B3FD3']} />
          }
        />
      )}

      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Book Appointment</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={28} color="#1E1E2D" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., Initial Consultation"
              placeholderTextColor="#A0A0B0"
              value={newAppointment.title}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, title: text }))}
            />

            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="2026-08-15"
              placeholderTextColor="#A0A0B0"
              value={newAppointment.date}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, date: text }))}
            />

            <Text style={styles.label}>Time (HH:MM)</Text>
            <TextInput
              style={styles.input}
              placeholder="14:00"
              placeholderTextColor="#A0A0B0"
              value={newAppointment.time}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, time: text }))}
            />

            <Text style={styles.label}>Type</Text>
            <View style={styles.typeContainer}>
              {['General Counseling', 'Legal Aid', 'Medical Support'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    newAppointment.type === type && styles.activeTypeChip
                  ]}
                  onPress={() => setNewAppointment(prev => ({ ...prev, type }))}
                >
                  <Text style={[
                    styles.typeChipText,
                    newAppointment.type === type && styles.activeTypeChipText
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any specific topics you'd like to discuss..."
              placeholderTextColor="#A0A0B0"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={newAppointment.notes}
              onChangeText={(text) => setNewAppointment(prev => ({ ...prev, notes: text }))}
            />

            <TouchableOpacity 
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleBookAppointment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Book Now</Text>
              )}
            </TouchableOpacity>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E1E2D',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: '#E8E8F0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#75759E',
  },
  activeTabText: {
    color: '#1E1E2D',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E2D',
    flex: 1,
    marginRight: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  cardBody: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#75759E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#C62828',
    fontSize: 16,
    marginBottom: 12,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#5B3FD3',
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E1E2D',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#75759E',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5B3FD3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B3FD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 20 : 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F5',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E1E2D',
  },
  modalBody: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1E2D',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F8F9FE',
    borderWidth: 1,
    borderColor: '#E8E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E1E2D',
  },
  textArea: {
    minHeight: 100,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FE',
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  activeTypeChip: {
    backgroundColor: '#5B3FD3',
    borderColor: '#5B3FD3',
  },
  typeChipText: {
    fontSize: 14,
    color: '#75759E',
    fontWeight: '500',
  },
  activeTypeChipText: {
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#5B3FD3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#5B3FD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
