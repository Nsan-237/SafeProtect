import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SWDashboardScreen } from '../screens/socialworker/SWDashboardScreen';
import { CaseListScreen } from '../screens/victim/CaseListScreen';
import { SWAppointmentsScreen } from '../screens/socialworker/SWAppointmentsScreen';
import { MessagesScreen } from '../screens/victim/MessagesScreen';
import { ProfileScreen } from '../screens/victim/ProfileScreen';
import { CustomTabBar } from '../components/shared/CustomTabBar';

const Tab = createBottomTabNavigator();

export const SocialWorkerTabs = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Dashboard" component={SWDashboardScreen} />
    <Tab.Screen name="Cases" component={CaseListScreen} />
    <Tab.Screen name="Messages" component={MessagesScreen} />
    <Tab.Screen name="Appointments" component={SWAppointmentsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
