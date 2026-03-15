import React, { useMemo,useState  } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTickets } from "../../context/TicketContext";
import { useRoute } from "@react-navigation/native";
import type { IssueItem } from "../../types";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import { useAuth } from "../../context/AuthContext";
import { useNavigation} from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
/* ================= ISSUE CARD ================= */

function IssueCard({ item }: { item: IssueItem }) {
    const { assignTicket } = useTickets();
const route = useRoute();
 const navigation = useNavigation<any>();
 const getIssueIdColor = (priority: IssueItem["priority"]) => {
  if (priority === "critical") return "#FF3B30";
  if (priority === "moderate") return "#FF9500";
  return "#8E8E93";
};
const getRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diff = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
  return `${Math.floor(diff / 86400)} d ago`;
};
 const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
 const { user } = useAuth();
  return (
    <TouchableOpacity onPress={ () => navigation.navigate("TechnicianTicketDetailed", {
  issueId: item.id, })

    }>
    <View style={[styles.card,{ borderTopColor: getIssueIdColor(item.priority) }]}>
      {/* Priority + Time */}
      <View style={styles.cardTopRow}>
        <View style={[styles.priorityBadge,{ backgroundColor: getIssueIdColor(item.priority) }]}>
          <Text style={styles.priorityText}>
          ● {capitalize(item.priority)}
          </Text>
        </View>

        <Text style={styles.timeText}>
          {getRelativeTime(item.createdAt)}
        </Text>
      </View>

      {/* Title */}
      <Text style={styles.titleText}>
        {item.title}
      </Text>

      <View style={styles.divider} />

      {/* Location */}
      <Text style={styles.sectionLabel}>Location</Text>
      <Text style={styles.locationText}>
        {item.location}
      </Text>

      {/* Tags */}
      <Text style={[styles.sectionLabel, { marginTop: 10 }]}>
        Type
      </Text>

      <View style={styles.tagRow}>
  {item.categoryTags?.map((tag, i: number) => (
    <View key={tag.id || i} style={styles.tagChip}>
      <Text style={styles.tagText}>
        {tag.label}
      </Text>
    </View>
  ))}
</View>

      {/* Button */}
      <TouchableOpacity
        style={styles.resolveBtn}
        onPress={() => {
  assignTicket(item.id, user?.name ?? "");
  navigation.navigate("TechnicianHome");
}}
      >
        <Text style={styles.resolveText}>
          Start Resolving
        </Text>
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );
}

/* ================= SCREEN ================= */

const TechnicianAllIssues = () => {
  const { tickets } = useTickets();

  /* 🔥 GLOBAL COUNTS */
  const assignedCount = useMemo(
  () =>
    tickets.filter(
      t =>
        t.status === "assigned" ||
        t.status === "in progress"
    ).length,
  [tickets]
);

const unassignedCount = useMemo(
  () =>
    tickets.filter(
      t => t.status === "not started"
    ).length,
  [tickets]
);

const total = assignedCount + unassignedCount;
const isEmpty = total === 0;

const isFullyAssigned =
total > 0 && assignedCount === total;

  const [activeFilter, setActiveFilter] = useState<
  "all" | "network" | "hardware"
  >("all");
  /* Show only unassigned tickets in list */
  const availableIssues = useMemo(() => {
  return tickets.filter((t) => {
    // Only show unassigned issues
    if (t.status !== "not started") return false;

    if (activeFilter === "all") return true;

    return t.categoryTags?.some(
      (tag) =>
        tag.label.toLowerCase() === activeFilter
    );
  });
}, [tickets, activeFilter]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        style={styles.container}
      >
        <Text style={styles.headerTitle}>All Issues</Text>

        {/* ASSIGNED BAR CARD */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>
            Issues status
          </Text>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={styles.legendBlue} />
              <Text style={{fontFamily: "Poppins-Regular", fontSize: 13, color: "#4B4B4B"}}>Assigned</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendLight} />
              <Text style={{fontFamily: "Poppins-Regular", fontSize: 13, color: "#4B4B4B"}}>Unassigned</Text>
            </View>
          </View>

          {/* PROGRESS BAR */}
          <View style={styles.statsOuterCard}>
  {isEmpty ? (
  /* ---------------- EMPTY STATE ---------------- */
  <View style={styles.emptyBar}>
    <Text style={styles.emptyText}>
      No issues raised
    </Text>
  </View>

) : isFullyAssigned ? (
  /* ---------------- FULLY ASSIGNED ---------------- */
  <View style={styles.fullBar}>
    <Ionicons name="checkmark" size={22} color="#FFFFFF" />
    <Text style={styles.fullText}>
      All Issues are assigned
    </Text>
  </View>

) : (
  /* ---------------- NORMAL SPLIT BAR ---------------- */
  <View style={styles.barContainer}>
    <View
      style={[
        styles.assignedBar,
        { flex: assignedCount },
      ]}
    />
    <View
      style={[
        styles.unassignedBar,
        { flex: unassignedCount },
      ]}
    />
  </View>
)}
<View style={styles.countRow}> 
  <Text style={styles.countText}> 
    <Text style={styles.countNumber}> {assignedCount} </Text>Assigned </Text> 
    <Text style={styles.countText}> 
    <Text style={styles.countNumber}> {unassignedCount} </Text>Unassigned </Text> 
</View>
</View>
</View>

<View style={styles.filterRow}>
  {["All", "Network", "Hardware"].map((item) => {
    const value = item.toLowerCase() as
      | "all"
      | "network"
      | "hardware";

    const isActive = activeFilter === value;

    return (
      <TouchableOpacity
        key={item}
        activeOpacity={0.8}
        onPress={() => setActiveFilter(value)}
        style={[
          styles.filterPill,
          isActive && styles.filterActive,
        ]}
      >
        <Text
          style={[
            styles.filterText,
            isActive && styles.filterTextActive,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>
        {/* EMPTY STATE */}
        {availableIssues.length === 0 ? (
          <View style={styles.emptyContainer}>
            <TicketFaded width={150} height={82} />
            <Text style={styles.emptyTitle}>
              No active issues
            </Text>
            <Text style={styles.emptySubtitle}>
              New assignments will appear here once an issue is raised
            </Text>
          </View>
        ) : (
          availableIssues.map(item => (
            <IssueCard key={item.id} item={item} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TechnicianAllIssues;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Medium",
    marginTop: 12,
    marginBottom: 20,
  },

  statsCard: {
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 5,
  },

  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
    color: "#081A41",
    marginBottom: 4,
  },

  legendRow: {
    flexDirection: "column",
    marginBottom: 12,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },

  legendBlue: {
    width: 8,
    height: 8,
    backgroundColor: "#103482",
    marginRight: 8,
  },

  legendLight: {
    width: 8,
    height: 8,
    backgroundColor: "#C2D3F4",
    marginRight: 8,
  },

  barWrapper: {
    flexDirection: "row",
    height: 50,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },

  barAssigned: {
    backgroundColor: "#103482",
  },

  barUnassigned: {
    backgroundColor: "#C2D3F4",
  },


  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
    marginTop: 20,
    color: "#081A41",
  },

  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderTopWidth: 6,
    paddingVertical: 16,
    paddingHorizontal: 16,
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
    letterSpacing: 0.3,
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
    lineHeight: 20,
    fontFamily: "Poppins-Medium",
    letterSpacing: 0.1,
    color: "#4B4B4B",
  },

  divider: {
    height: 1,
    backgroundColor: "#CED6E0",
    marginVertical: 10,
  },

  sectionLabel: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
  },

  locationText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
    color: "#4B4B4B",
    marginTop: 2,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },

  tagChip: {
    borderWidth: 1,
    borderColor: "#1A56D9",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
    marginRight: 8,
  },

  tagText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#1A56D9",
  },

  resolveBtn: {
    alignSelf: "flex-end",
    backgroundColor: "#0D2B6C",
    marginTop: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 33,
  },

  resolveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },


statsOuterCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 12,
  padding: 16,
  borderWidth: 0.5,
  borderColor: "#CED6E0",
},

barContainer: {
  height: 68,
  borderRadius: 8,
  overflow: "hidden",
  flexDirection: "row",
  backgroundColor: "#A5B4FC",
},

assignedBar: {
  backgroundColor: "#103482",
},

unassignedBar: {
  backgroundColor: "#C2D3F4",
},

countRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 12,
},

countText: {
  fontSize: 14,
  color: "#4B4B4B",
  fontFamily: "Poppins-Regular",
  fontWeight: "500",
},

countNumber: {
  fontWeight: "700", 
    fontFamily: "Poppins-Regular", // makes only number bold
  color: "#4B4B4B",    // optional: slightly darker
},
filterRow: {
  flexDirection: "row",
  marginTop: 16,
  marginBottom: 16,
},

filterPill: {
  borderWidth: 1,
  borderColor: "#CED6E0",
  paddingHorizontal: 18,
  alignItems: "center",
  justifyContent:"center",
  paddingVertical: 8,
  borderRadius: 25,
  marginRight: 12,
},

filterActive: {
  backgroundColor: "#1A56D9",
  borderColor: "#1A56D9",
},

filterText: {
  fontSize: 14,
  fontFamily: "Poppins-Medium",
  color: "#081A41",
},

filterTextActive: {
  color: "#FFFFFF",
  fontWeight: "600",
},
emptyBar: {
  backgroundColor: "#EDF0F3",
  borderRadius: 8,
  height: 68,
  justifyContent: "center",
  alignItems: "center",
},

emptyText: {
  fontSize: 13,
  color: "#A0A0A0",
  fontFamily: "Poppins-Regular",
},

fullBar: {
  backgroundColor: "#0D2B6C",
  borderRadius: 8,
  height: 68,
  justifyContent: "center",
  alignItems: "center",
},

fullText: {
  color: "#FFFFFF",
  marginTop: 2,
  fontSize: 13,
  fontWeight: "600",
  fontFamily: "Poppins-Regular",
},
});