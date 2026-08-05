import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/colors";

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: CustomTabBarProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
          const isFocused = state.index === index;
          const isSOSTab = route.name === "SOS";

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // SOS button (raised red circle in center)
          if (isSOSTab) {
            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.sosWrapper}
                activeOpacity={0.85}
              >
                <View style={styles.sosButton}>
                  <Text style={styles.sosText}>SOS</Text>
                </View>
              </TouchableOpacity>
            );
          }

          const iconFocused: any = (() => {
            switch (route.name) {
              case "Home":
                return isFocused ? "home" : "home-outline";
              case "Reports":
                return isFocused ? "document-text" : "document-text-outline";
              case "Cases":
                return isFocused ? "folder" : "folder-outline";
              case "Dashboard":
                return isFocused ? "home" : "home-outline";
              case "Services":
                return isFocused ? "heart" : "heart-outline";
              case "Appointments":
                return isFocused ? "calendar" : "calendar-outline";
              case "Profile":
                return isFocused ? "person" : "person-outline";
              default:
                return "ellipse-outline";
            }
          })();

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabItem}
              activeOpacity={0.7}
            >
              <Ionicons
                name={iconFocused}
                size={22}
                color={isFocused ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? COLORS.primary : COLORS.textSecondary },
                ]}
              >
                {typeof label === "string" ? label : route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
  },
  bar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F5",
    height: 68,
    paddingBottom: Platform.OS === "ios" ? 12 : 8,
    alignItems: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  sosWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 4,
  },
  sosButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FF2E55",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    // Raise it above the tab bar
    marginTop: -28,
    shadowColor: "#FF2E55",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  sosText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
