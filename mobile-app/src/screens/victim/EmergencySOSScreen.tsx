import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export const EmergencySOSScreen = ({ navigation }: any) => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: '1', name: 'Family Contact', phone: '+237 670 000 111', relation: 'Parent' },
  ]);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [sosActive, setSosActive] = useState(false);

  const handleSOSPress = () => {
    setSosActive(true);
    Alert.alert(
      '🚨 EMERGENCY SOS TRIGGERED',
      'Your location (Yaoundé, Mfoundi) has been broadcast to emergency responders and trusted contacts. Calling emergency helpline...',
      [
        {
          text: 'Call Helpline (122)',
          onPress: () => {
            setSosActive(false);
            Linking.openURL('tel:122');
          },
        },
        {
          text: 'Cancel SOS',
          style: 'cancel',
          onPress: () => setSosActive(false),
        },
      ]
    );
  };

  const handleCallNumber = (num: string) => {
    Linking.openURL(`tel:${num}`);
  };

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) {
      Alert.alert('Error', 'Please enter both name and phone number.');
      return;
    }
    setContacts([
      ...contacts,
      { id: Date.now().toString(), name: newContactName, phone: newContactPhone, relation: 'Trusted' },
    ]);
    setNewContactName('');
    setNewContactPhone('');
    Alert.alert('Success', 'Trusted contact added.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FF2E55' }}>
      <StatusBar barStyle="light-content" backgroundColor="#FF2E55" />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
      }}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={{ padding: 6, marginLeft: -6 }}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginLeft: 12 }}>
          Emergency
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* SOS Button with Concentric Rings */}
        <View style={{ alignItems: 'center', marginVertical: 16 }}>
          <View style={{
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: 'rgba(255,255,255,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.25)',
          }}>
            <View style={{
              width: 170,
              height: 170,
              borderRadius: 85,
              backgroundColor: 'rgba(255,255,255,0.22)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1.5,
              borderColor: 'rgba(255,255,255,0.35)',
            }}>
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handleSOSPress}
                style={{
                  width: 124,
                  height: 124,
                  borderRadius: 62,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                <Text style={{ color: '#FF2E55', fontSize: 32, fontWeight: '900', letterSpacing: 1 }}>
                  SOS
                </Text>
                <Text style={{ color: '#FF2E55', fontSize: 9, fontWeight: '800', marginTop: 2, textAlign: 'center' }}>
                  Tap to call for help
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700', marginTop: 16 }}>
            Your location will be shared
          </Text>
        </View>

        {/* Trusted Contacts Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setShowContactsModal(true)}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 18,
            marginBottom: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E1E2D', marginBottom: 2 }}>
              Trusted Contacts ({contacts.length})
            </Text>
            <Text style={{ fontSize: 12, color: '#75759E', fontWeight: '500' }}>
              Add or manage your emergency contacts
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FF2E55" />
        </TouchableOpacity>

        {/* Helplines Card */}
        <View style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E1E2D', marginBottom: 16 }}>
            Helplines
          </Text>

          {[
            { name: 'Child Protection Helpline', number: '122' },
            { name: 'GBV Helpline (MINPROFF)', number: '1332' },
            { name: 'Police', number: '117' },
          ].map((item, idx, arr) => (
            <TouchableOpacity
              key={item.number}
              onPress={() => handleCallNumber(item.number)}
              activeOpacity={0.8}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F8F9FE',
                padding: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#E8E8F0',
                marginBottom: idx !== arr.length - 1 ? 10 : 0,
              }}
            >
              <View style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#F0EDFF',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="call" size={18} color="#5B3FD3" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#1E1E2D' }}>
                {item.name}
              </Text>
              <View style={{
                backgroundColor: '#5B3FD3',
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                  {item.number}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* Trusted Contacts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showContactsModal}
        onRequestClose={() => setShowContactsModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
          activeOpacity={1}
          onPress={() => setShowContactsModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              paddingBottom: 36,
              maxHeight: '80%',
            }}
          >
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E8E8F0', alignSelf: 'center', marginBottom: 20 }} />

            <Text style={{ fontSize: 20, fontWeight: '800', color: '#1E1E2D', marginBottom: 4 }}>
              Trusted Contacts
            </Text>
            <Text style={{ fontSize: 12, color: '#75759E', marginBottom: 20 }}>
              These contacts receive SMS notifications during an emergency SOS call.
            </Text>

            {/* Contacts list */}
            {contacts.map((c) => (
              <View key={c.id} style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 12,
                backgroundColor: '#F8F9FE',
                borderRadius: 12,
                marginBottom: 8,
              }}>
                <View>
                  <Text style={{ fontWeight: '700', color: '#1E1E2D', fontSize: 14 }}>{c.name}</Text>
                  <Text style={{ color: '#75759E', fontSize: 12 }}>{c.phone} • {c.relation}</Text>
                </View>
                <TouchableOpacity onPress={() => handleCallNumber(c.phone)}>
                  <Ionicons name="call-outline" size={20} color="#5B3FD3" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add new contact input */}
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#75759E', marginTop: 16, marginBottom: 8 }}>
              Add New Contact
            </Text>
            <TextInput
              placeholder="Contact Name"
              placeholderTextColor="#B0B0C8"
              style={{ backgroundColor: '#F8F9FE', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E8E8F0', marginBottom: 8, fontSize: 14 }}
              value={newContactName}
              onChangeText={setNewContactName}
            />
            <TextInput
              placeholder="Phone Number (+237...)"
              placeholderTextColor="#B0B0C8"
              keyboardType="phone-pad"
              style={{ backgroundColor: '#F8F9FE', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#E8E8F0', marginBottom: 16, fontSize: 14 }}
              value={newContactPhone}
              onChangeText={setNewContactPhone}
            />

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                onPress={handleAddContact}
                style={{ flex: 1, backgroundColor: '#5B3FD3', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 14 }}>Add Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowContactsModal(false)}
                style={{ flex: 1, backgroundColor: '#F0F0F5', paddingVertical: 14, borderRadius: 12, alignItems: 'center' }}
              >
                <Text style={{ color: '#1E1E2D', fontWeight: '700', fontSize: 14 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};
