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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
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
        {/* Purple header band with logo */}
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
            <Ionicons name="shield-checkmark" size={38} color="#FFFFFF" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>
            Welcome Back
          </Text>
          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', textAlign: 'center' }}>
            Sign in to SafeProtect Cameroon
          </Text>
        </View>

        {/* Form */}
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

          {/* Email input */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
            Email Address
          </Text>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            marginBottom: 16,
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

          {/* Password input */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>
            Password
          </Text>
          <View style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            marginBottom: 8,
            borderWidth: 1.5,
            borderColor: '#E8E8F0',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 14,
          }}>
            <Ionicons name="lock-closed-outline" size={18} color="#75759E" style={{ marginRight: 10 }} />
            <TextInput
              style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: '#1E1E2D' }}
              placeholder="••••••••"
              placeholderTextColor="#B0B0C8"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#75759E" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('ForgotPassword')}
            style={{ alignSelf: 'flex-end', marginBottom: 28 }}
            disabled={loading}
          >
            <Text style={{ color: '#5B3FD3', fontWeight: '700', fontSize: 13 }}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: '#5B3FD3',
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
              {loading ? 'Signing in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: '#75759E', fontSize: 14 }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={{ color: '#5B3FD3', fontWeight: '700', fontSize: 14 }}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
