import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import { useTickets } from "../../context/TicketContext";
import type { IssueItem } from "../../types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation";

/* ================= ISSUE CARD ================= */

function TechnicianHistoryCard({ item }: { item: IssueItem }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getRelativeTime = (date?: string) => {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate("TechnicianTicketDetailed", {
          issueId: item.id,
        })
      }
    >
      {/* Time */}
      <Text style={styles.historyTime}>
        {getRelativeTime(item.completedAt)}
      </Text>

      {/* Title */}
      <Text style={styles.issueTitle}>
        {item.title}
      </Text>

      <View style={styles.divider} />

      {/* Location */}
      <Text style={styles.sectionLabel}>Location</Text>
      <Text style={styles.locationText}>
        {item.location || "Not specified"}
      </Text>

      {/* Raised By */}
      <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
        Raised by
      </Text>

      <View style={styles.personRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.createdBy?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>

        <Text style={styles.personName}>
          {item.createdBy || "Client name"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

/* ================= SCREEN ================= */

const TechnicianHistoryScreen = () => {
  const { history } = useTickets();

  const sortedHistory = React.useMemo(() => {
    return [...history].sort((a, b) => {
      const dateA = new Date(a.completedAt ?? 0).getTime();
      const dateB = new Date(b.completedAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [history]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.container}>
        <Text style={styles.title}>History</Text>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            sortedHistory.length === 0
              ? styles.emptyScrollContainer
              : { paddingBottom: 40 }
          }
        >
          {/* EMPTY STATE */}
          {sortedHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <TicketFaded width={150} height={82} />

              <Text style={styles.emptyTitle}>
                No completed issues yet
              </Text>

              <Text style={styles.emptySubtitle}>
                Issues you resolve will appear here
              </Text>
            </View>
          ) : (
            sortedHistory.map((item: IssueItem) => (
              <TechnicianHistoryCard
                key={item.id}
                item={item}
              />
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TechnicianHistoryScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
  },

  /* HEADER TITLE */
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#081A41",
    fontFamily: "Poppins-SemiBold",
    marginTop: 10,
    marginBottom: 15,
  },

  /* EMPTY STATE */
  emptyScrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },

  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 20,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 80
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E5EAF5",
  },

  historyTime: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 6,
  },

  issueTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
    lineHeight: 24,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5EAF5",
    marginVertical: 14,
  },

  sectionLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  locationText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
    color: "#374151",
  },

  personRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1E3A8A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  avatarText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  personName: {
    fontSize: 14,
    color: "#374151",
  },
});