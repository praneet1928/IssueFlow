import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PrinterIcon from "../../../assets/images/printer.svg";


const HistoryScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={styles.title}>History</Text>

        {/* Section */}
        <Text style={styles.section}>Upcoming</Text>

        {/* Empty State */}
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            You have no active{"\n"}Issues
          </Text>
          <TouchableOpacity>
            <Text style={styles.raiseText}>Raise an issue →</Text>
          </TouchableOpacity>
        </View>

        {/* Issue Card */}
        <View style={styles.issueCard}>
  <View style={styles.rowBetween}>
    <Text style={styles.issueId}>★ #AD677</Text>
    <Text style={styles.time}>20 mins ago</Text>
  </View>

  <Text style={styles.issueTitle}>
    My printer is not getting connected to Wi-Fi
  </Text>

  <Text style={styles.location}>CSE Block 201</Text>

  <View style={styles.image}>
    <PrinterIcon width={48} height={48} />
  </View>

  <View style={styles.tagsRow}>
    <View style={styles.tag}>
      <Text style={styles.tagText}>Network</Text>
    </View>
    <View style={styles.tag}>
      <Text style={styles.tagText}>Hardware</Text>
    </View>

    <TouchableOpacity style={styles.raiseAgain}>
      <Text style={styles.raiseAgainText}>⟳ Raise again</Text>
    </TouchableOpacity>
  </View>
</View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistoryScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#103482",
    marginTop: 16,
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },

  emptyCard: {
    borderWidth: 1,
    borderColor: "#E5EAF5",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  emptyText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },

  raiseText: {
    fontSize: 14,
    color: "#8CABEC",
    fontWeight: "500",
  },

  issueCard: {
    borderWidth: 1,
    borderColor: "#E5EAF5",
    borderRadius: 16,
    padding: 16,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  issueId: {
    color: "#FF3B30",
    fontWeight: "600",
    fontSize: 14,
  },

  time: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  issueTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },

  location: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },

  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 12,
  },

  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    borderWidth: 1,
    borderColor: "#8CABEC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },

  tagText: {
    fontSize: 12,
    color: "#103482",
    fontWeight: "500",
  },

  raiseAgain: {
    marginLeft: "auto",
    backgroundColor: "#103482",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  raiseAgainText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});
