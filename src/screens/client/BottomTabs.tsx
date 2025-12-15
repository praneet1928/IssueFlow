import React from "react";
import { View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import ClientHome from "./ClientHome";
import ClientHistory from "./ClientHistory";
import NewTicket from "./NewTicket";

import HomeIcon from "../../../assets/images/Category.svg";
import RaiseIcon from "../../../assets/images/raise.svg";
import TicketIcon from "../../../assets/images/TicketOutline.svg";

const Tab = createBottomTabNavigator();

const ACTIVE = "#103482";
const INACTIVE = "#8CABEC";

export default function BottomTabs() {
  return (
    <Tab.Navigator
  screenOptions={({ route }) => ({
    headerShown: false,
    tabBarShowLabel: false,
    tabBarStyle: [
      styles.tabBar,
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
            <HomeIcon width={24} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />

      <Tab.Screen
        name="NewTicket"
        component={NewTicket}
        options={{
          tabBarIcon: () => (
            <View style={styles.fab}>
              <RaiseIcon width={60} color={ACTIVE} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ClientHistory"
        component={ClientHistory}
        options={{
          tabBarIcon: ({ focused }) => (
            <TicketIcon width={22} color={focused ? ACTIVE : INACTIVE} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
  },
  fab: {
    marginTop:40,
   // alignItems: "flex-end",
    //justifyContent: "flex-end",
  },
});
