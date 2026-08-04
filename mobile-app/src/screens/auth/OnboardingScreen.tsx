import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export const OnboardingScreen = ({ navigation }: any) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1248' }}>
    <StatusBar barStyle="light-content" backgroundColor="#1E1248" />

    <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 24 }}>
      {/* Illustration */}
      <View style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}>
        <View style={{
          width: width * 0.75,
          height: width * 0.75,
          borderRadius: (width * 0.75) / 2,
          backgroundColor: 'rgba(91,63,211,0.25)',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: 'rgba(139,111,247,0.3)',
          marginBottom: 32,
        }}>
          <Image
            source={require('../../../assets/onboarding.png')}
            style={{ width: width * 0.68, height: width * 0.68, borderRadius: (width * 0.68) / 2 }}
            resizeMode="cover"
          />
        </View>

        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 }}>
          SafeProtect Cameroon
        </Text>
        <Text style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', paddingHorizontal: 16, lineHeight: 22 }}>
          A safe space to report and get help.{'\n'}You are not alone.
        </Text>
      </View>

      {/* Buttons */}
      <View style={{ width: '100%', paddingBottom: 32 }}>
        <TouchableOpacity
          style={{
            width: '100%',
            backgroundColor: '#5B3FD3',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 14,
            alignItems: 'center',
            shadowColor: '#5B3FD3',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
          }}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 17 }}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            borderWidth: 1.5,
            borderColor: 'rgba(255,255,255,0.35)',
            paddingVertical: 16,
            borderRadius: 14,
            marginBottom: 14,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.06)',
          }}
          onPress={() => navigation.navigate('EmergencySOS')}
          activeOpacity={0.85}
        >
          <Ionicons name="call" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>I Need Help Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ paddingVertical: 8, alignItems: 'center' }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', textDecorationLine: 'underline' }}>
            Learn More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </SafeAreaView>
);
