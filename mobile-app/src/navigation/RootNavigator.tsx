import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import { AuthStack } from './AuthStack';
import { VictimTabs } from './VictimTabs';
import { SocialWorkerTabs } from './SocialWorkerTabs';
import { CaseDetailScreen } from '../screens/victim/CaseDetailScreen';
import { ReportIncidentScreen } from '../screens/victim/ReportIncidentScreen';
import { SWCaseDetailScreen } from '../screens/socialworker/SWCaseDetailScreen';
import { View, ActivityIndicator } from 'react-native';

const Stack = createStackNavigator();

const VictimStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="VictimTabs" component={VictimTabs} />
    <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
    <Stack.Screen name="ReportIncident" component={ReportIncidentScreen} />
  </Stack.Navigator>
);

const SocialWorkerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SocialWorkerTabs" component={SocialWorkerTabs} />
    <Stack.Screen name="UpdateCase" component={SWCaseDetailScreen} />
  </Stack.Navigator>
);

export const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#5B3FD3" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : user.role === 'VICTIM' ? (
        <VictimStack />
      ) : (
        <SocialWorkerStack />
      )}
    </NavigationContainer>
  );
};
