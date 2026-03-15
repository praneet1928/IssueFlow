import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import { useTickets } from "../../context/TicketContext";
/* ---------- HELPERS ---------- */

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  return (
    <View style={[styles.avatar]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

/* ---------- SCREEN ---------- */

export default function ClientProfile() {
  const navigation = useNavigation();
const { user } = useAuth();
const { tickets } = useTickets();
if (!user) return null;
const ResolvedIssues = tickets.filter(
  t =>
    t.createdBy === user?.name &&
    t.status !== "completed" &&
    t.status !== "discarded"
).length;
const CurrentIssues = tickets.filter(
  t => t.createdBy === user?.name
).length;
  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Profile</Text>

        <TouchableOpacity onPress={() => navigation.navigate("TechnicianSettings")}>
          <Ionicons name="settings-outline" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
  {/* PATTERNED HEADER */}
  <View style={styles.patternHeader}>
    {Array.from({ length: 36 }).map((_, i) => (
      <Text key={i} style={styles.patternPlus}>
        +
      </Text>
    ))}
  </View>

  {/* AVATAR */}
  <View style={styles.avatarWrapper}>
    <View style={styles.avatar}>
      <Avatar name={user.name} />
    </View>
  </View>

  {/* USER INFO */}
  <Text style={styles.name}>{user.name}</Text>
  <Text style={styles.email}>{user.email}</Text>
</View>


      {/* ACTIVITY */}
      <Text style={styles.sectionTitle}>Your Activity</Text>
      <View style={styles.activityRow}>
      <View style={styles.activityCard}>
        <Text style={styles.activityLabel}>Issues Raised</Text>
        <Text style={styles.activityValue}>{CurrentIssues}</Text>
      </View>

      <View style={styles.activityCard}>
        <Text style={styles.activityLabel}>Issues Resolved</Text>
        <Text style={styles.activityValue}>{ResolvedIssues}</Text>
      </View>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
    color: "#0F172A",
  },

  /* PROFILE CARD */

  cardPattern: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 60,
    backgroundColor: "#EAF1FF",
  },

  /* ACTIVITY */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Medium",
    marginTop: 28,
    marginBottom: 12,
  },

  activityRow: {
  flexDirection: "row",
  justifyContent: "space-between",
},

  activityCard: {
  flex: 1,
  width: "48%", 
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  paddingVertical: 16,
  alignItems: "center",
  marginBottom: 12,
  marginHorizontal: 6,
},


  activityLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#4B4B4B",
    marginBottom: 6,
  },

  activityValue: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Poppins-Regular",
    color: "#0D2B6C",
  },
  /* PROFILE CARD */

profileCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 18,
  paddingBottom: 20,
  alignItems: "center",
  fontFamily: "Poppins-Regular",
  marginTop: 16,
  borderWidth: 1,
  borderColor: "#E5E7EB",
  overflow: "hidden",
},

/* PATTERN HEADER */

patternHeader: {
  width: "100%",
  height: 65,
  backgroundColor: "#E8EEFB",
  flexDirection: "row",
  flexWrap: "wrap",
  paddingHorizontal: 16,
  paddingTop: 12,
},

patternPlus: {
  width: 18,
  height: 18,
  textAlign: "center",
  color: "#CED6E0",
  fontSize: 14,
  fontWeight: "600",
  opacity: 0.9,
},

/* AVATAR */

avatarWrapper: {
  marginTop: -36,
  marginBottom: 12,
},

avatar: {
  width: 72,
  height: 72,
  borderRadius: 36,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  alignItems: "center",
  justifyContent: "center",
},

avatarText: {
  fontSize: 20,
  fontWeight: "600",
  color: "#000",
},

/* TEXT */

name: {
  fontSize: 20,
  fontWeight: "700",
  fontFamily: "Poppins-SemiBold",
  color: "#081A41",
  marginTop: 4,
},

email: {
  fontSize: 16,
  color: "#A0A0A0",
  fontFamily: "Poppins-Regular",
  marginTop: 2,
},

});
