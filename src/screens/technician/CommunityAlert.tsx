import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

/* ===============================
   Navigation Types
================================= */
export type TechnicianStackParamList = {
  CommunityAlerts: undefined;
};

type CommunityAlertsNavigationProp = StackNavigationProp<
  TechnicianStackParamList,
  "CommunityAlerts"
>;

type CommunityAlertsRouteProp = RouteProp<
  TechnicianStackParamList,
  "CommunityAlerts"
>;

type Props = {
  navigation: CommunityAlertsNavigationProp;
  route: CommunityAlertsRouteProp;
};

/* ===============================
   Alert Type
================================= */
type AlertMessage = {
  id: string;
  text: string;
  createdAt: number;
};

/* ===============================
   Screen
================================= */
export default function CommunityAlerts({ navigation }: Props) {
  const [message, setMessage] = useState("");
  const [alerts, setAlerts] = useState<AlertMessage[]>([]);
  const [focused, setFocused] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSend = () => {
    if (!message.trim()) return;

    const newAlert: AlertMessage = {
      id: Date.now().toString(),
      text: message,
      createdAt: Date.now(),
    };

    setAlerts(prev => [newAlert, ...prev]);
    setMessage("");
  };

  /* ===============================
     Smart Time Formatter
  ================================= */

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  };

  const formatExactDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#1F2A44" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Send Community Alert
          </Text>

          <View style={{ width: 22 }} />
        </View>

        {/* Alerts */}
        {alerts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={60}
              color="#EDF0F3"
            />
            <Text style={styles.emptyText}>
              Notify others about important updates or concerns in your area.
            </Text>
          </View>
        ) : (
          <FlatList
  data={alerts}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => {
    const isLast = index === alerts.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.alertItem,
          isLast && { borderBottomWidth: 0 } // remove border for last item
        ]}
        activeOpacity={0.8}
        onPress={() =>
          setExpandedId(expandedId === item.id ? null : item.id)
        }
      >
        <View style={styles.alertRow}>
          <Text style={styles.alertText}>{item.text}</Text>

          <Text style={styles.timeText}>
            {formatRelativeTime(item.createdAt)}
          </Text>
        </View>

        {expandedId === item.id && (
          <Text style={styles.exactTime}>
            created at : {formatExactDate(item.createdAt)}
          </Text>
        )}
      </TouchableOpacity>
    );
  }}
/>
        )}

        {/* Input */}
        <View style={styles.inputWrapper}>
          <View
            style={[
              styles.inputContainer,
              { borderColor: focused ? "#4D8CFF" : "#CED6E0" },
            ]}
          >
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Send alert"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
            >
              <Ionicons
                name="paper-plane"
                size={18}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ===============================
   Styles
================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Full white background
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 21,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#081A41",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyText: {
    marginTop: 16,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
    fontSize: 14,
  },

  alertItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 76,
    backgroundColor: "#FBFBFB",
    borderBottomWidth: 1,
    borderBottomColor: "#CED6E0",
  },

  alertRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap:32,
    paddingHorizontal: 12,
    justifyContent: "space-between",
  },

  alertText: {
    flex: 1,
    color: "#4B4B4B",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    paddingRight: 10,
    marginBottom: 12,
  },

  timeText: {
    color: "#A0A0A0",
    fontFamily: "Poppins-Regular",
    fontSize: 12,
  },

  exactTime: {
    textAlign: "right",
    paddingRight: 10,
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: "#A0A0A0",
  },

  inputWrapper: {
    paddingTop: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 1,
    backgroundColor: "#FFFFFF",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "92%",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom:10,
    backgroundColor: "#FFFFFF",
    paddingLeft: 14,
    paddingHorizontal: 8,
  },

  input: {
    flex: 1,
    height: 48,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },

  sendButton: {
    backgroundColor: "#1F3C88",
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});