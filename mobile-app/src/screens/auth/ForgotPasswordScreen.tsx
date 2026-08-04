import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      Alert.alert(
        'Reset Link Sent',
        'If an account exists with this email, password reset instructions have been sent.',
        [{ text: 'Back to Login', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Purple header band with lock icon */}
        <View style={{
          backgroundColor: '#1E1248',
          paddingTop: 40,
          paddingBottom: 40,
          paddingHorizontal: 24,
          alignItems: 'center',
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        }}>
          <View style={{
            width: 72,
            height: 72,
            backgroundColor: 'rgba(91,63,211,0.6)',
            borderRadius: 36,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            borderWidth: 2,
            borderColor: 'rgba(139,111,247,0.5)',
          }}>
            <Ionicons name="key-outline" size={36} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>
            Forgot Password?
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center', paddingHorizontal: 20 }}>
            Enter your registered email address to receive reset instructions
          </Text>
        </View>

        {/* Form Body */}
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
          {error ? (
            <View style={{
              backgroundColor: '#FFE5EA',
              padding: 12,
              borderRadius: 10,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="alert-circle" size={16} color="#FF2E55" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FF2E55', fontWeight: '600', fontSize: 13, flex: 1 }}>{error}</Text>
            </View>
          ) : null}

          {sent ? (
            <View style={{
              backgroundColor: '#E8F5E9',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#C8E6C9',
            }}>
              <Ionicons name="checkmark-circle" size={32} color="#2E7D32" style={{ marginBottom: 8 }} />
              <Text style={{ color: '#2E7D32', fontWeight: '700', fontSize: 15, marginBottom: 4 }}>Reset Link Sent!</Text>
              <Text style={{ color: '#388E3C', fontSize: 13, textAlign: 'center' }}>
                Check your inbox at {email} for instructions.
              </Text>
            </View>
          ) : null}

          {/* Email input */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
            Email Address
          </Text>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            marginBottom: 24,
            borderWidth: 1.5,
            borderColor: '#E8E8F0',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}>
            <Ionicons name="mail-outline" size={18} color="#75759E" style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: '#1E1E2D' }}
              placeholder="your@email.com"
              placeholderTextColor="#B0B0C8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleReset}
            style={{
              backgroundColor: loading ? '#8B6FF7' : '#5B3FD3',
              paddingVertical: 16,
              borderRadius: 14,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#5B3FD3',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 10,
              elevation: 6,
            }}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} /> : null}
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }}
          >
            <Ionicons name="arrow-back" size={16} color="#5B3FD3" style={{ marginRight: 6 }} />
            <Text style={{ color: '#5B3FD3', fontWeight: '700', fontSize: 14 }}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
