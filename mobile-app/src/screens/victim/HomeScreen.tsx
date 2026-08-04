import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';
import { Case } from '../../types';

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = useCallback(async () => {
    try {
      const response = await api.get('/cases');
      const allCases = response.data;

      const mapCategory = (cat: string) => {
        switch (cat) {
          case 'PHYSICAL_ABUSE':    return 'Physical Abuse';
          case 'SEXUAL_ABUSE':      return 'Sexual Abuse';
          case 'DOMESTIC_VIOLENCE': return 'Domestic Violence';
          case 'EMOTIONAL_ABUSE':   return 'Emotional Abuse';
          case 'NEGLECT':           return 'Neglect';
          default:                  return 'Other';
        }
      };

      const mapStatus = (status: string) => {
        switch (status) {
          case 'NEW':                 return 'New';
          case 'UNDER_INVESTIGATION': return 'In Progress';
          case 'SUPPORT_PROVIDED':    return 'In Progress';
          case 'RESOLVED':            return 'Resolved';
          case 'CLOSED':              return 'Resolved';
          default:                    return 'New';
        }
      };

      let filteredCases = allCases;
      if (user?.role === 'VICTIM' && user?.victimProfile?.id) {
        filteredCases = allCases.filter((c: any) => c.incident?.victimId === user.victimProfile?.id);
      } else if (user?.role === 'SOCIAL_WORKER' && user?.socialWorkerProfile?.id) {
        filteredCases = allCases.filter((c: any) => c.assignedWorkerId === user.socialWorkerProfile?.id);
      }

      const mapped = filteredCases.map((c: any): Case => ({
        id: c.id,
        caseId: c.caseNumber,
        type: mapCategory(c.incident?.category),
        status: mapStatus(c.status) as any,
        date: new Date(c.incident?.date || c.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        location: c.incident?.location || '',
        description: c.incident?.description || '',
        riskLevel: c.riskLevel || 'High',
        victimId: c.incident?.victimId || '',
      }));

      setCases(mapped);
    } catch (err) {
      console.error('Error fetching cases:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases])
  );

  const categories = [
    { name: 'Physical Abuse',   icon: 'hand-left-outline' as const, bg: '#F0EDFF', color: '#5B3FD3' },
    { name: 'Sexual Abuse',     icon: 'body-outline' as const,      bg: '#FFF0F3', color: '#FF2E55' },
    { name: 'Emotional Abuse',  icon: 'heart-dislike-outline' as const, bg: '#FFF3E0', color: '#E65100' },
    { name: 'Neglect',          icon: 'home-outline' as const,      bg: '#E3F2FD', color: '#1565C0' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      
      {/* Top Header */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F5',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#5B3FD3',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              {(user?.name || 'V').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 12, color: '#75759E', fontWeight: '600' }}>Welcome back,</Text>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#1E1E2D' }}>{user?.name || 'User'}</Text>
          </View>
        </View>

        <TouchableOpacity style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#F8F9FE',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#E8E8F0',
        }}>
          <Ionicons name="notifications-outline" size={20} color="#1E1E2D" />
          <View style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#FF2E55',
          }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        
        {/* Main Banner — Report Incident */}
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate('ReportIncident')}
          style={{
            backgroundColor: '#1E1248',
            borderRadius: 20,
            padding: 22,
            marginBottom: 24,
            shadowColor: '#1E1248',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <View style={{
                backgroundColor: 'rgba(91,63,211,0.5)',
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 12,
                alignSelf: 'flex-start',
                marginBottom: 10,
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>24/7 CONFIDENTIAL HELP</Text>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 }}>
                Report an Incident
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 18, marginBottom: 16 }}>
                Submit a report securely and anonymously. Our team is here to assist you.
              </Text>
              <View style={{
                backgroundColor: '#5B3FD3',
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 12,
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13, marginRight: 6 }}>Report Now</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </View>

            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255,255,255,0.12)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
            }}>
              <Ionicons name="shield-checkmark" size={30} color="#8B6FF7" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Report Categories */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12 }}>
          Quick Category Selection
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 24 }}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => navigation.navigate('ReportIncident')}
              activeOpacity={0.8}
              style={{
                width: '48%',
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 14,
                marginBottom: 12,
                borderWidth: 1,
                borderColor: '#F0F0F5',
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: cat.bg,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}>
                <Ionicons name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E1E2D', flex: 1 }} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Active Cases Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6 }}>
            My Active Reports
          </Text>
          {cases.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#5B3FD3' }}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="small" color="#5B3FD3" style={{ marginVertical: 20 }} />
        ) : cases.length === 0 ? (
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#F0F0F5',
            marginBottom: 24,
          }}>
            <Ionicons name="folder-open-outline" size={40} color="#B0B0C8" />
            <Text style={{ color: '#1E1E2D', fontSize: 14, fontWeight: '700', marginTop: 10 }}>No Active Reports</Text>
            <Text style={{ color: '#75759E', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
              When you submit a report, case progress will appear here.
            </Text>
          </View>
        ) : (
          cases.slice(0, 3).map((c) => {
            const isResolved = c.status === 'Resolved';
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => navigation.navigate('CaseDetail', { id: c.id })}
                activeOpacity={0.8}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: '#F0F0F5',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.04,
                  shadowRadius: 6,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: '#1E1E2D' }}>{c.caseId}</Text>
                  <View style={{
                    backgroundColor: isResolved ? '#E8F5E9' : '#FFF3E0',
                    paddingHorizontal: 10,
                    paddingVertical: 3,
                    borderRadius: 12,
                  }}>
                    <Text style={{ color: isResolved ? '#2E7D32' : '#E65100', fontSize: 11, fontWeight: '700' }}>
                      {c.status}
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#5B3FD3', marginBottom: 4 }}>{c.type}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#75759E' }}>{c.date}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#B0B0C8" />
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {/* Quick Emergency / Services Row */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 12, marginTop: 12 }}>
          Support Resources
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Services')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              marginRight: 8,
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#F0F0F5',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0EDFF',
              alignItems: 'center', justifyContent: 'center', marginRight: 10,
            }}>
              <Ionicons name="heart" size={20} color="#5B3FD3" />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#1E1E2D' }}>Services</Text>
              <Text style={{ fontSize: 11, color: '#75759E' }}>Find centers</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SOS')}
            activeOpacity={0.8}
            style={{
              flex: 1,
              marginLeft: 8,
              backgroundColor: '#FFF0F3',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#FFD6DE',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#FF2E55',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <View style={{
              width: 40, height: 40, borderRadius: 12, backgroundColor: '#FF2E55',
              alignItems: 'center', justifyContent: 'center', marginRight: 10,
            }}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
            </View>
            <View>
              <Text style={{ fontSize: 14, fontWeight: '800', color: '#FF2E55' }}>Emergency</Text>
              <Text style={{ fontSize: 11, color: '#FF7B93' }}>Call 122 / 1332</Text>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};
