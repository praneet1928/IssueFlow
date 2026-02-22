import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ClientHome from "./ClientHome";
import ClientHistory from "./ClientHistory";
import NewTicket from "./cards/NewTicket";

import HomeIcon from "../../../assets/images/HomeIcon.svg";
import RaiseIcon from "../../../assets/images/raise.svg";
import HistoryIcon from "../../../assets/images/History.svg";

const Tab = createBottomTabNavigator();

const ACTIVE = "#103482";
const INACTIVE = "#8CABEC";

export default function BottomTabs() {
  const insets = useSafeAreaInsets();

  // ✅ If Android with 3-button nav, give fallback padding
  const bottomSpace =
    Platform.OS === "android"
      ? insets.bottom > 0
        ? insets.bottom
        : 10
      : insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: Platform.OS === "android" ? 64 + bottomSpace: 56 + bottomSpace,
          },
          {
            display:
              getFocusedRouteNameFromRoute(route) === "NewTicket"
                ? "none"
                : "flex",
          },
        ],
      })}
    >
      <Tab.Screen
        name="ClientHome"
        component={ClientHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <HomeIcon
                width={26}
                color={focused ? ACTIVE : INACTIVE}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? ACTIVE : INACTIVE },
                ]}
              >
                Home
              </Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NewTicket"
        component={NewTicket}
        options={{
          tabBarStyle: { display: "none"},
          tabBarIcon: () => (
            <View style={styles.fab}>
              <RaiseIcon width={56} color={ACTIVE} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ClientHistory"
        component={ClientHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <HistoryIcon
                width={26}
                color={focused ? ACTIVE : INACTIVE}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: focused ? ACTIVE : INACTIVE },
                ]}
              >
                History
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 45,
  },

  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    height: 22,
    width: "5%",
    fontWeight: "500",
    alignItems: "center",
    justifyContent: "center",
  },

  fab: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 35 : 35,
  },
});