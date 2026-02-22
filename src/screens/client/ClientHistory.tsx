import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useTickets } from "../../context/TicketContext";
import type { IssueItem } from "../../types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {  CompositeNavigationProp,useNavigation,RouteProp } from "@react-navigation/native";
import {TabParamList ,RootStackParamList} from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import Path from "../../../assets/images/path.svg";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";


/* -------- ISSUE CARD -------- */
function HistoryIssueCard({
  item,
}: {
  item: IssueItem;
}) {
  type HistoryScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, "ClientHistory">,
  NativeStackNavigationProp<RootStackParamList>
>;

const navigation = useNavigation<HistoryScreenNavigationProp>();
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
  const { tickets } = useTickets();
  const isCompleted = item.status === "completed";
  const isDiscarded = item.status === "discarded";
  const showTechnician =
    isCompleted && item.assignedTo; 
    
  const { raiseAgain ,removeTicket} = useTickets();
  const headerColor = isCompleted ? "#8CABEC" : "#8CABEC";
  const hasActiveInstance = tickets.some(
  t =>
    t.title === item.title &&
    t.status !== "completed" &&
    t.status !== "discarded"
);
const handleRaisePress = () => {
  // 🛑 Safety guard
  if (hasActiveInstance) return;

  Alert.alert(
    "Raise Issue Again",
    "A new ticket will be created with a fresh timeline. Continue?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Raise",
        onPress: () => {
          const newId = raiseAgain(item);

          navigation.navigate("Successfull");
        },
      },
    ]
  );
};
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() =>
       navigation.navigate("TicketDetailed", {
  issueId: item.id,
})}
    >
      {/* Header */}
      <Text style={[styles.historyLabel, { color: headerColor }]}>
        {getRelativeTime(
          isCompleted ? item.completedAt : item.completedAt
        )}
      </Text>

      {/* Title */}
      <Text style={styles.issueTitle}>{item.title}</Text>

      <View style={styles.divider} />

      {/* Status */}
      <Text style={styles.sectionLabel}>Status</Text>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: isCompleted ? "#A9DFBF" : "#EDF0F3",
          },
        ]}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isCompleted ? "#27AE60" : "#A0A0A0" },
          ]}
        />
        <Text
          style={{
            color: isCompleted ? "#27AE60" : "#A0A0A0",
            fontWeight: "600", fontFamily: "Poppins-Regular"
          }}
        >
          {isCompleted ? "Completed" : "Discarded"}
        </Text>
      </View>

      {/* ✅ Show Technician Only If Completed */}
      {showTechnician && (
        <>
          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
            Resolved by
          </Text>

          <View style={styles.techRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {item.assignedTo?.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.techName}>{item.assignedTo}</Text>
          </View>
        </>
      )}

      {/* Bottom Row */}
<View style={styles.cardBottomRow}>
  <View style={{ width: 10 }} />

  <TouchableOpacity
    style={[
      styles.raiseButton,
      hasActiveInstance && styles.raiseButtonDisabled
    ]}
    disabled={hasActiveInstance}
    onPress={handleRaisePress}
  >
    <Path
      width={16}
      color={hasActiveInstance ? "#A0A0A0" : "#FFFFFF"}
      style={styles.raiseIcon}
    />

    <Text
      style={[
        styles.raiseText,
        hasActiveInstance && styles.raiseTextDisabled
      ]}
    >
      {hasActiveInstance
        ? "Active Issue Ongoing"
        : "Raise again"}
    </Text>
  </TouchableOpacity>
</View>
  </TouchableOpacity>
  );
}

/* -------- SCREEN -------- */
const HistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { history, removeTicket } = useTickets();
  const sortedHistory = React.useMemo(() => {
  return [...history].sort((a, b) => {
    const dateA = new Date(a.completedAt ?? 0).getTime();
    const dateB = new Date(b.completedAt ?? 0).getTime();
    return dateB - dateA; // recent → old
  });
}, [history]);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>History</Text>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.illustrationWrapper}>
              <TicketFaded width={150} height={82} />
            </View>

            <Text style={styles.emptyTitle}>
              No resolved issues yet
            </Text>

            <Text style={styles.emptySubtitle}>
              When an issue is fixed or closed, you'll see it here.
            </Text>

          </View>
       ) : (
  sortedHistory.map((item: IssueItem) => (
    <HistoryIssueCard
      key={item.id}
      item={item}
    />
  ))
)}
      </ScrollView>
    </SafeAreaView>
  );
};


export default HistoryScreen;

/* -------- STYLES -------- */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: "700",
    color: "#081A41",
    fontFamily: "Poppins-Bold",
    marginTop: 16,
    marginBottom: 24,
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: "#E5EAF5",
    borderRadius: 14,
    padding: 16,
  },

  emptyText: {
    fontSize: 18,
    color: "#4B4B4B",
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },

  raiseRow: {
    flexDirection: "row",
    alignItems: "center",
  },



  raisearrow: {
    fontSize: 18,
    color: "#A0A0A0",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#CED6E0",
  },

  issueMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  issueCodeText: {
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },

  issueTime: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },

  issueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },

  issueLocation: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 10,
  },

  issueImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#0000001A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },

  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1A56D9",
  },

  tagText: {
    fontSize: 12,
    color: "#1A56D9",
    fontWeight: "600",
  },

  emptyContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 32,
  marginTop: 180,
},

illustrationWrapper: {
  marginBottom: 24,
  opacity: 0.8,
},

emptyTitle: {
  fontSize: 18,
  fontWeight: "600",
  fontFamily: "Poppins-Regular",
  color: "#081A41",
  textAlign: "center",
  marginBottom: 8,
},

emptySubtitle: {
  fontSize: 14,
  color: "#6B7280",
  textAlign: "center",
  fontWeight: "500",
  fontFamily: "Poppins-Regular",
  lineHeight: 22,
  marginBottom: 24,
},

primaryButton: {
  backgroundColor: "#0B2C6F",
  paddingVertical: 12,
  paddingHorizontal: 26,
  borderRadius: 10,
},

primaryButtonText: {
  color: "#FFFFFF",
  fontSize: 14,
  fontFamily: "Poppins-Regular",
  fontWeight: "600",
},
historyLabel: {
  fontSize: 13,
  fontWeight: "500",
   fontFamily: "Poppins-Regular",
  marginBottom: 6,
},

divider: {
  height: 1,
  backgroundColor: "#CED6E0",
  marginVertical: 12,
},

sectionLabel: {
  fontSize: 13,
  color: "#6B7280",
  marginBottom: 6,
},

statusBadge: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: 16,
  alignSelf: "flex-start",
},

dot: {
  width: 6,
  height: 6,
  borderRadius: 16,
  marginRight: 7,
},

techRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "#1E3A8A",
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},
cardBottomRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: 16,
},
avatarText: {
  color: "#FFFFFF",
  fontWeight: "600",
},

techName: {
  fontSize: 14,
  color: "#1F2937",
},

raiseButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#1A56D9",
  width: 140,
  height: 42,
  paddingHorizontal: 12,
  paddingVertical: 4,
  borderRadius: 22,
},

raiseIcon: {
  marginRight: 8,
},

raiseText: {
  color: "#FFFFFF",
  fontWeight: "500",
},
raiseButtonDisabled: {
  backgroundColor: "#EDF0F3",

  justifyContent: "center",
  flexDirection: "row",
  paddingHorizontal: 12,
  paddingVertical: 4,
  alignItems: "center",
   width:195,
  height: 42,

},

raiseTextDisabled: {
  color: "#A0A0A0",              // muted gray text
},

raiseIconDisabled: {
  color: "#9CA3AF",              // muted icon
},

});
