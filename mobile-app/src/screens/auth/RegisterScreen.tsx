import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  SafeAreaView, ScrollView, StatusBar, ActivityIndicator, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('Name, email, and password are required.'); return;
    }
    try {
      setError(''); setLoading(true);
      await api.post('/auth/register', { name, email, phone, password, role: 'VICTIM' });
      Alert.alert('Account Created', 'Your account has been created. Please log in.', [
        { text: 'Login', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FE' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FE" />
      {/* Purple header band */}
      <View style={{
        backgroundColor: '#1E1248', paddingTop: 36, paddingBottom: 32,
        paddingHorizontal: 24, alignItems: 'center',
        borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
      }}>
        <View style={{
          width: 64, height: 64, backgroundColor: 'rgba(91,63,211,0.5)',
          borderRadius: 32, alignItems: 'center', justifyContent: 'center',
          marginBottom: 14, borderWidth: 2, borderColor: 'rgba(139,111,247,0.5)',
        }}>
          <Ionicons name="person-add" size={30} color="#FFFFFF" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>Create Account</Text>
        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>Join SafeProtect Cameroon</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingTop: 28 }} showsVerticalScrollIndicator={false}>
        {error ? (
          <View style={{ backgroundColor: '#FFE5EA', padding: 12, borderRadius: 10, marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="alert-circle" size={16} color="#FF2E55" style={{ marginRight: 8 }} />
            <Text style={{ color: '#FF2E55', fontSize: 13, fontWeight: '600', flex: 1 }}>{error}</Text>
          </View>
        ) : null}

        {[
          { label: 'Full Name', value: name, setter: setName, placeholder: 'Your full name', icon: 'person-outline', keyboard: 'default' as const, secure: false },
          { label: 'Email Address', value: email, setter: setEmail, placeholder: 'your@email.com', icon: 'mail-outline', keyboard: 'email-address' as const, secure: false },
          { label: 'Phone Number', value: phone, setter: setPhone, placeholder: '+237 600 000 000', icon: 'call-outline', keyboard: 'phone-pad' as const, secure: false },
        ].map(({ label, value, setter, placeholder, icon, keyboard }) => (
          <View key={label} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>{label}</Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#E8E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
              <Ionicons name={icon as any} size={18} color="#75759E" style={{ marginRight: 10 }} />
              <TextInput
                style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: '#1E1E2D' }}
                placeholder={placeholder} placeholderTextColor="#B0B0C8"
                value={value} onChangeText={setter}
                autoCapitalize="none" keyboardType={keyboard} editable={!loading}
              />
            </View>
          </View>
        ))}

        {/* Password field */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: '#75759E', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Password</Text>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1.5, borderColor: '#E8E8F0', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, marginBottom: 28 }}>
          <Ionicons name="lock-closed-outline" size={18} color="#75759E" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, paddingVertical: 14, fontSize: 15, color: '#1E1E2D' }}
            placeholder="Min. 8 characters" placeholderTextColor="#B0B0C8"
            secureTextEntry={!showPwd} value={password} onChangeText={setPassword} editable={!loading}
          />
          <TouchableOpacity onPress={() => setShowPwd(!showPwd)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name={showPwd ? 'eye-off-outline' : 'eye-outline'} size={20} color="#75759E" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister} disabled={loading}
          style={{ backgroundColor: loading ? '#8B6FF7' : '#5B3FD3', paddingVertical: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 20, shadowColor: '#5B3FD3', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10, elevation: 6 }}
          activeOpacity={0.85}
        >
          {loading ? <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} /> : null}
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>{loading ? 'Creating account...' : 'Register'}</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 32 }}>
          <Text style={{ color: '#75759E', fontSize: 14 }}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: '#5B3FD3', fontWeight: '700', fontSize: 14 }}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
