import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { IssueItem } from "../../types";

import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";

/* -------- ISSUE CARD -------- */
function HistoryIssueCard({
  item,
  onDelete,
}: {
  item: IssueItem;
  onDelete: (id: string) => void;
}) {
  const navigation = useNavigation<any>();

  const getPriorityColor = (priority: IssueItem["priority"]) => {
    switch (priority) {
      case "critical":
        return "#FF3B30";
      case "moderate":
        return "#F68D2B";
      case "low":
        return "#8E8E93";
      default:
        return "#000";
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "printer":
        return <PrinterIcon width={48} height={42} />;
      case "monitor":
        return <MonitorIcon width={48} height={40} />;
      case "wifi":
        return <WifiIcon width={48} height={40} />;
      default:
        return <GenericIcon width={48} height={40} />;
    }
  };

  const handleRaiseAgain = () => {
    Alert.alert(
      "Raise Issue Again",
      "Do you want to raise this issue again?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            onDelete(item.id);                 // ✅ remove from history
            navigation.navigate("Successfull");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const priorityColor = getPriorityColor(item.priority);

  return (
    <View style={styles.card}>
      {/* Meta */}
      <View style={styles.issueMeta}>
        <MaterialCommunityIcons
          name="ticket"
          size={22}
          color={priorityColor}
        />
        <Text style={[styles.issueCodeText, { color: priorityColor }]}>
          {item.code}
        </Text>
        <Text style={styles.issueTime}>
          {item.timestampMinutesAgo} mins ago
        </Text>
      </View>

      {/* Content */}
      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text style={styles.issueLocation}>{item.location}</Text>

      <View style={styles.issueImage}>{getDeviceIcon(item.Device)}</View>

      {/* Tags + Raise again */}
      <View style={styles.tagRow}>
        {item.categoryTags.map((tag) => (
          <View key={tag.id} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag.label}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.raiseAgainRow}
          onPress={handleRaiseAgain}
        >
          <Text style={[styles.raiseAgainArrow, { top: -1 }]}>⟳ </Text>
          <Text style={styles.raiseAgainText}>Raise again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------- SCREEN -------- */
const HistoryScreen: React.FC = () => {
  const [issues, setIssues] = React.useState<IssueItem[]>([
    {
      id: "his-1",
      code: "#AD677",
      priority: "moderate",
      timestampMinutesAgo: 20,
      title: "My printer is not getting connected to Wi-Fi",
      location: "CSE Block 201",
      categoryTags: [
        { id: "tag-nw", label: "Network" },
        { id: "tag-hw", label: "Hardware" },
      ],
      Device: "Printer",
    },
    {
      id: "his-2",
      code: "#AD521",
      priority: "critical",
      timestampMinutesAgo: 130,
      title: "My Monitor is not showing the screen",
      location: "ECE Block 107",
      categoryTags: [{ id: "tag-hw", label: "Hardware" }],
      Device: "Monitor",
    },
  ]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>History</Text>

        {issues.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              You have no resolved{"\n"}issues
            </Text>
            <TouchableOpacity style={styles.raiseRow}>
              <Text style={styles.raiseText}>Raise an issue</Text>
              <Text style={[styles.raisearrow, { top: -1 }]}> ➜</Text>
            </TouchableOpacity>
          </View>
        ) : (
          issues.map((item) => (
            <HistoryIssueCard
              key={item.id}
              item={item}
              onDelete={(id) =>
                setIssues((prev) =>
                  prev.filter((issue) => issue.id !== id)
                )
              }
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

  raiseText: {
    fontSize: 16,
    color: "#A0A0A0",
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
    borderWidth: 0.5,
    borderColor: "#0000001A",
    shadowColor: "#a7a7a7",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
  },

  issueTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0F172A",
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

  raiseAgainRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    backgroundColor: "#103482",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  raiseAgainText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },

  raiseAgainArrow: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});
