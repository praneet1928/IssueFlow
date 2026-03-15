import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import type { IssueItem } from "../../types";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import IssueFlow from "../../../assets/images/issueflow.svg";
import Bell from "../../../assets/images/BellOutline.svg";
import Tick from "../../../assets/images/Tick.svg";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import { useAuth } from "../../context/AuthContext";
import { useTickets } from "../../context/TicketContext";
import { useRoute, RouteProp } from "@react-navigation/native";
import type { TechTabParamList } from "../../types/navigation";

type TechnicianHomeRouteProp = RouteProp<
  TechTabParamList,
  "TechnicianHome"
>;


function Avatar({ name }: { name: string }) {
  const letter = name.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.avatar]}>
      <Text style={styles.avatarText}>{letter}</Text>
    </View>
  );
}

function Header() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
   if (!user) return null;
  return (
    <View style={styles.header}>
      <IssueFlow height={36} width={130} />

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={{ marginRight: 24 }}
          onPress={() => navigation.navigate("TechnicianNotifications")}
        >
          <Bell height={24} width={24} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("TechnicianProfile")}
        >
          <Avatar name={user.name}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const TechnicianHomeScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
const { tickets } = useTickets();
const { assignTicket, resolveTicket } = useTickets();
const myTickets = tickets.filter(
  t =>
    t.assignedTo === user?.name &&
    t.status !== "completed" &&
    t.status !== "discarded"
);
const getIssueIdColor = (priority: IssueItem["priority"]) => {
  if (priority === "critical") return "#FF3B30";
  if (priority === "moderate") return "#FF9500";
  return "#8E8E93";
};
const route = useRoute<TechnicianHomeRouteProp>();
const [showToast, setShowToast] = useState(false);

useEffect(() => {
  let timer: NodeJS.Timeout;

  if (route.params?.showToast) {
    setShowToast(true);

    // Clear param so it won't trigger again
    navigation.setParams({});

    timer = setTimeout(() => {
      setShowToast(false);
    }, 5000); // ⏳ 5 seconds
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [route.params?.showToast]);
const confirmFinish = (ticketId: string) => {
  Alert.alert(
    "Finish Issue",
    "Are you sure you want to mark this issue as completed?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Finish",
        style: "destructive",
        onPress: () => {
          resolveTicket(ticketId); // ✅ now correct
        },
      },
    ]
  );
};
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} d ago`;
};
  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Header />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* -------- Community Alert Card -------- */}
          <TouchableOpacity
  activeOpacity={0.85}
  style={styles.alertCard}
  onPress={() => navigation.navigate("CommunityAlerts")}
>
  <View style={styles.alertTextContainer}>
    <Text style={styles.alertTitle}>
      Send Community Alert
    </Text>

    <Text style={styles.alertSubtitle}>
      Notify others about important updates 
      or concerns in your area.
    </Text>
  </View>

  {/* Arrow Button */}
  <View style={styles.alertArrowContainer}>
    <Ionicons
  name="arrow-forward-outline"
  size={18}
  color="#1D2B53"
  style={{ transform: [{ rotate: "-45deg" }] }}
/>
  </View>
</TouchableOpacity>

          {/* -------- Currently working section -------- */}
          <Text style={styles.sectionTitle}>
            Currently working on
          </Text>

          {/* -------- Empty state -------- */}
          {myTickets.length === 0 ? (
  /* -------- Empty state -------- */
  <View style={styles.emptyContainer}>
    <TicketFaded width={130} height={70} />

    <Text style={styles.emptyTitle}>
      No active issues
    </Text>

    <Text style={styles.emptySubtitle}>
      Pick an issue from the issue page to
      start working
    </Text>

    <TouchableOpacity
      style={styles.primaryButton}
      onPress={() => navigation.navigate("AllTickets")}
      activeOpacity={0.85}
    >
      <Text style={styles.primaryButtonText}>
        View issues
      </Text>
    </TouchableOpacity>
  </View>
) : (
  myTickets.map(ticket => (
    <TouchableOpacity
      key={ticket.id}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("TechnicianTicketDetailed", {
          issueId: ticket.id,
        })
      }
    >
      <View style={styles.card}>
            {/* Priority + Time */}
            <View style={styles.cardTopRow}>
              <View style={[styles.priorityBadge,{ backgroundColor: getIssueIdColor(ticket.priority) }]}>
                <Text style={styles.priorityText}>
                  ●  {capitalize(ticket.priority)}
                </Text>
              </View>
      
              <Text style={styles.timeText}>
                {getRelativeTime(ticket.assignedAt ?? "")}
              </Text>
            </View>
      
            {/* Title */}
            <Text style={styles.titleText}>
              {ticket.title}
            </Text>
      
            <View style={styles.divider} />
      
            {/* Location */}
            <Text style={styles.sectionLabel}>Location</Text>
            <Text style={styles.locationText}>
              {ticket.location}
            </Text>
      
      
            {/* Button */}
            <TouchableOpacity
              style={styles.resolveBtn}
  onPress={() => confirmFinish(ticket.id)}
         >
              <Text style={styles.resolveText}>
                Finish
              </Text>
            </TouchableOpacity>
          </View>
    </TouchableOpacity>
  ))
)}
        </ScrollView>
        {showToast && (
  <View style={styles.toast}>
    <View style={styles.toastIcon}>
      <Tick />
    </View>

    <Text style={styles.toastText}>
      Thank you! Your feedback helps make IssueFlow better for everyone
    </Text>
  </View>
)}
      </View>
    </SafeAreaView>
  );
};

export default TechnicianHomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  /* HEADER */
  header: {
    marginTop: 6,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#103482",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },


  /* SECTION */
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Medium",
    marginTop: 30,
    marginBottom: 12,
  },

  /* EMPTY */
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
    color: "#081A41",
    textAlign: "center",
  },

  emptySubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  primaryButton: {
    marginTop: 20,
    backgroundColor: "#0B2C6F",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },

arrowCircle: {
    position: "absolute",
    right: 12,
    top: 12,
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: "#dce4f4",
  alignItems: "center",
  justifyContent: "center",
},
ticketCard: {
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 14,
  padding: 16,
  marginBottom: 16,
  backgroundColor: "#FFF",
},

ticketTitle: {
  fontSize: 16,
  fontWeight: "600",
  color: "#1F2937",
},

ticketLocation: {
  fontSize: 14,
  color: "#6B7280",
  marginTop: 4,
},

ticketStatus: {
  marginTop: 10,
  backgroundColor: "#E0E7FF",
  alignSelf: "flex-start",
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 14,
},

ticketStatusText: {
  fontSize: 12,
  fontWeight: "600",
  color: "#3730A3",
},


card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CED6E0",
    padding: 16,
    marginBottom: 16,
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

   priorityBadge: {
    //paddingHorizontal: 12,
    paddingLeft: 12,
    paddingRight: 14,
    paddingVertical: 6,
    borderRadius: 50,
  },

  priorityText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },

  timeText: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#A0A0A0",
  },

  titleText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
    color: "#4B4B4B",
  },

  divider: {
    height: 1,
    backgroundColor: "#CED6E0",
    marginVertical: 12,
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
  },

  locationText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
    marginTop: 2,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },

  tagChip: {
    borderWidth: 1,
    borderColor: "#2563EB",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 4,
  },

  tagText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#2563EB",
  },

  resolveBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#0D2B6C",
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },

  resolveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },

  alertCard: {
  backgroundColor: "#F2F4F7",
  borderRadius: 20,
  padding: 18,
  height: 109,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
},

alertTextContainer: {
 flex: 1,
  paddingRight: 10,
},

alertTitle: {
  fontSize: 18,
  fontWeight: "600",
  fontFamily: "Poppins-Medium",
  color: "#081A41",
  marginBottom: 8,
},

alertSubtitle: {
  fontSize: 14,
  color: "#4B4B4B",
  lineHeight: 18,
},

alertArrowContainer: {
  width: 38,
  height: 38,
  borderRadius: 20,
  backgroundColor: "#E5EBF7",
  justifyContent: "center",
  alignItems: "center",
},
toast: {
  position: "absolute",
  bottom: 30,
  left: 20,
  right: 20,
  backgroundColor: "#E8EEF9",
  flexDirection: "row",
  alignItems: "center",
  padding: 16,
  borderRadius: 20,
},

toastIcon: {
  width: 36,
  height: 36,
  borderRadius: 20,
  backgroundColor: "#236EFD",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

toastText: {
  flex: 1,
  color: "#081A41",
  fontFamily: "Poppins-Regular",
  fontSize: 13,
  fontWeight: "500",
},
});