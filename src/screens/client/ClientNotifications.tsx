import React,{useEffect} from "react";
import {
  View,
  Text,

  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../types/navigation";
import { useNotifications } from "../../context/NotificationContext";
import { Ionicons } from "@expo/vector-icons";
import { LayoutAnimation, Platform, UIManager } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const getTitle = (type: string) => {
  switch (type) {
    case "assigned":
      return "Technician assigned to your issue";
    case "resolved":
      return "Issue resolved successfully";
    case "comment":
      return "New comment on your issue";
    case "issue_created":
      return "Issue raised successfully";
    case "unassigned":
      return "Technician unassigned";
    default:
      return "Notification";
  }
};

const getSubtitle = (type: string) => {
  switch (type) {
    case "assigned":
      return "Tap to view details and take action.";
    case "resolved":
      return "Your issue has been marked as resolved.";
    case "comment":
      return "Tap to view the comment.";
    case "issue_created":
      return "Your issue was submitted successfully.";
    case "unassigned":
      return "We Will Assign You a Technicain very shortly.";
    default:
      return "";
  }
};

const Notifications = () => {
  const navigation = useNavigation<NavProp>();
  useEffect(() => {
  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
  }
}, []);
const { notifications, markAsRead, removeNotification, clearAll } = useNotifications();
const renderRightActions = (id: string) => {
  return (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => {
        LayoutAnimation.configureNext(
          LayoutAnimation.Presets.easeInEaseOut
        );
        removeNotification(id);
      }}
    >
      <Ionicons name="trash" size={20} color="#fff" />
    </TouchableOpacity>
  );
};
  const handlePress = (item: any) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

  markAsRead(item.id);

  navigation.navigate("TicketDetailed", {
    issueId: item.issueId,
    openComments: item.type === "comment",
  });
};

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="chevron-back" size={24} />
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Notifications</Text>

  {notifications.length > 0 ? (
    <TouchableOpacity
  onPress={() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    clearAll();
  }}
>
      <Text style={styles.clearText}>Clear All</Text>
    </TouchableOpacity>
  ) : (
    <View style={{ width: 25 }} />
  )}
</View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
  <Swipeable
    renderRightActions={() => renderRightActions(item.id)}
  >
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.notificationCard,
        item.read && styles.readCard,
      ]}
      onPress={() => handlePress(item)}
    >
      <View style={styles.rowBetween}>
        <Text style={styles.titleText}>
          {getTitle(item.type)}{" "}
          <Text style={styles.issueCode}>
            {item.issueCode}
          </Text>
        </Text>

        <Text style={styles.timeText}>
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>

      <Text style={styles.subtitleText}>
        {getSubtitle(item.type)}
      </Text>
    </TouchableOpacity>
  </Swipeable>
)}
      />
    </SafeAreaView>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff", 
    paddingHorizontal: 2,
  },

  header: {
    height: 56,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18, 
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    left: 12,
    fontFamily: "Poppins-Regular",
    color: "#0F172A",
  },

  notificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  unreadCard: {
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    fontFamily: "Poppins-Regular",
  },

  issueCode: {
    color: "#EF4444",
    fontWeight: "700",
  },

  timeText: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 8,
  },

  subtitleText: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },
  readCard: {
  backgroundColor: "#F1F5F9",
  borderColor: "#E2E8F0",
},
clearText: {
  color: "#A0A0A0",
  fontWeight: "600",
  fontSize: 14,
  fontFamily: "Poppins-Regular",
},
deleteButton: {
  backgroundColor: "#EF4444",
  justifyContent: "center",
  alignItems: "center",
  width: 80,
  marginVertical: 8,
  borderRadius: 12,
},
});