import React from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import TechnicianHome from "./TechnicianHome";
import AllTickets from "./AllTickets";
import TechnicianHistory from "./TechnicianHistory";

import HomeIcon from "../../../assets/images/HomeIcon.svg";
import TicketIcon from "../../../assets/images/Ticket.svg";
import HistoryIcon from "../../../assets/images/History.svg";

const Tab = createBottomTabNavigator();

const ACTIVE = "#103482";
const INACTIVE = "#8CABEC";

export default function TechnicianBottomTabs() {
  const insets = useSafeAreaInsets();

  const bottomSpace =
    Platform.OS === "android"
      ? insets.bottom > 0
        ? insets.bottom
        : 20
      : insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 60 + bottomSpace,
            paddingBottom: bottomSpace,
          },
        ],
      }}
    >
      {/* HOME */}
      <Tab.Screen
        name="TechnicianHome"
        component={TechnicianHome}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Home"
              focused={focused}
              Icon={HomeIcon}
            />
          ),
        }}
      />

      {/* ISSUES */}
      <Tab.Screen
        name="AllTickets"
        component={AllTickets}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="Issues"
              focused={focused}
              Icon={TicketIcon}
            />
          ),
        }}
      />

      {/* HISTORY */}
      <Tab.Screen
        name="TechnicianHistory"
        component={TechnicianHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabItem
              label="History"
              focused={focused}
              Icon={HistoryIcon}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

/* Reusable Tab Item */
function TabItem({
  label,
  focused,
  Icon,
}: {
  label: string;
  focused: boolean;
  Icon: any;
}) {
  return (
    <View style={styles.tabItem}>
      <Icon
        width={24}
        color={focused ? ACTIVE : INACTIVE}
      />
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? ACTIVE : INACTIVE },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.4,
    paddingHorizontal: 10,
    borderTopColor: "#CED6E0",
  },

  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 42,
  },

  tabLabel: {
    fontSize: 11,
    width: "10%",
    height: "110%",
    fontFamily: "Poppins-Regular",
    marginTop: 3,
    fontWeight: "500",
  },
});