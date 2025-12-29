import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator, BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import type { CustomerTabParamList } from "../types/navigation";

import HomeScreen from "../screens/HomeScreen";
import CouriersMapScreen from "../screens/CouriersMapScreen";
import CreateShipmentScreen from "../screens/CreateShipmentScreen";
import ShipmentsHistoryScreen from "../screens/ShipmentsHistoryScreen";
import AccountScreen from "../screens/AccountScreen";

const Tab = createBottomTabNavigator<CustomerTabParamList>();

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        if (route.name === "NewShipment") {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              onPress={() => navigation.navigate(route.name)}
              style={styles.fabWrapper}
            >
              <View style={styles.fab}>
                <MaterialCommunityIcons name="send" size={24} color="white" />
              </View>
            </TouchableOpacity>
          );
        }

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        const icon = (() => {
          switch (route.name) {
            case "Home": return <Feather name="home" size={22} color={isFocused ? "#e53935" : "#666"} />;
            case "Map": return <Feather name="map" size={22} color={isFocused ? "#e53935" : "#666"} />;
            case "History": return <Feather name="clock" size={22} color={isFocused ? "#e53935" : "#666"} />;
            case "Account": return <Ionicons name="person-outline" size={22} color={isFocused ? "#e53935" : "#666"} />;
            default: return null;
          }
        })();

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            {icon}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function CustomerTabs() {
  return (
    <Tab.Navigator
      tabBar={(p) => <CustomTabBar {...p} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Map" component={CouriersMapScreen} />
      <Tab.Screen name="NewShipment" component={CreateShipmentScreen} />
      <Tab.Screen name="History" component={ShipmentsHistoryScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "white",
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
  },
  fabWrapper: {
    width: 72,
    alignItems: "center",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#5949d3ff", 
    alignItems: "center",
    justifyContent: "center",
    marginTop: -28,
  },
});