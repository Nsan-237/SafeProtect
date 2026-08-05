import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screens/victim/HomeScreen";
import { CaseListScreen } from "../screens/victim/CaseListScreen";
import { EmergencySOSScreen } from "../screens/victim/EmergencySOSScreen";
import { ServicesScreen } from "../screens/victim/ServicesScreen";
import { ProfileScreen } from "../screens/victim/ProfileScreen";
import { CustomTabBar } from "../components/shared/CustomTabBar";

const Tab = createBottomTabNavigator();

export const VictimTabs = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Reports" component={CaseListScreen} />
    <Tab.Screen name="SOS" component={EmergencySOSScreen} />
    <Tab.Screen name="Services" component={ServicesScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);
