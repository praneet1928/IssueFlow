import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { HomeScreenProps, IssueItem } from '../../types';
import BrandLogo from "../../../assets/images/brandlogo.svg";
import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";
import { SafeAreaView } from 'react-native-safe-area-context';

const mockIssues: IssueItem[] = [
  { id: 'issue-1', code: '#AD677', priority: 'critical', timestampMinutesAgo: 20, title: 'My Wi-Fi is showing Red Light', location: 'CSE Block 201', categoryTags: [{ id: 'tag-hw', label: 'Hardware' }], Device: 'Wifi' },
  { id: 'issue-2', code: '#AD672', priority: 'moderate', timestampMinutesAgo: 40, title: 'My monitor is not getting ON', location: 'ECE Block 001', categoryTags: [{ id: 'tag-sw', label: 'Software' }, { id: 'tag-hw', label: 'Hardware' }], Device: 'Monitor' },
  { id: 'issue-3', code: '#AD565', priority: 'low', timestampMinutesAgo: 55, title: 'My printer is not getting connected to Wi-Fi and please check', location: 'CSE Block 201', categoryTags: [{ id: 'tag-sw', label: 'Software' }, { id: 'tag-nw', label: 'Network' }], Device: 'Printer' },
  { id: 'issue-4', code: '#AD555', priority: 'moderate', timestampMinutesAgo: 15, title: 'My printer is not getting connected to computer', location: 'IT Block 101', categoryTags: [{ id: 'tag-hw', label: 'Hardware' }], Device: 'Printer' },
];

function AppHeader({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.brandRow}>
        <BrandLogo height={25} />
        <Text style={styles.brandText}>IssueFlow</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={onOpenNotifications} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' }}
          style={styles.avatar}
        />
      </View>
    </View>
  );
}

function IssueCard({ item }: { item: IssueItem }) {
  const getPriorityColor = (priority: IssueItem["priority"]) => {
    switch (priority) {
      case "critical": return '#FF3B30';
      case "moderate": return '#F68D2B';
      case "low": return "#8E8E93";
      default: return "#000";
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "printer": return <PrinterIcon width={48} height={42} />;
      case "monitor": return <MonitorIcon width={48} height={40} />;
      case "wifi": return <WifiIcon width={48} height={40} />;
      default: return <GenericIcon width={48} height={40} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.issueMeta}>
        <MaterialCommunityIcons name="ticket" size={22} color={getPriorityColor(item.priority)} />
        <Text style={[styles.issueCodeText, { color: getPriorityColor(item.priority) }]}>
          {item.code}
        </Text>
        <Text style={styles.issueTime}>{item.timestampMinutesAgo} mins ago</Text>
      </View>

      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text style={styles.issueLocation}>{item.location}</Text>

      <View style={styles.issueImage}>{getDeviceIcon(item.Device)}</View>

      <View style={styles.tagRow}>
        {item.categoryTags.map(tag => (
          <View key={tag.id} style={styles.tagChip}>
            <Text style={styles.tagText}>{tag.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const ClientHomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'john',
  issues = mockIssues,
  isLoading = false,
  error = null,
  onOpenNotifications,
}) => {
  const { width } = useWindowDimensions();
  const contentPadding = useMemo(() => (width < 360 ? 12 : 16), [width]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        <AppHeader onOpenNotifications={onOpenNotifications} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.greeting}>Hello, {userName}!</Text>
          <Text style={styles.sectionTitle}>Issues Raised by you</Text>

          <FlatList
            data={issues}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <IssueCard item={item} />}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ClientHomeScreen;
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  container: {
    flex: 1,
  },

  /* ================= HEADER ================= */

  appHeader: {
    marginTop: "1%",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandText: {
    marginLeft: 6,
    fontSize: 22,
    fontWeight: "600",
    color: "#103482",
    fontFamily: "Poppins-Bold",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconButton: {
    padding: 8,
    marginRight: 16,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E2E8F0",
  },

  /* ================= TEXT ================= */

  greeting: {
    fontSize: 18,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    marginTop: "5%",
  },

  sectionTitle: {
    fontSize: 42,
    color: "#103482",
    fontWeight: "600",
    marginBottom: 20,
  },

  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },

  /* ================= ISSUE CARD ================= */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 0.5,
    borderColor: "#0000001A",
    shadowColor: "#a7a7a7ff",
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
    color: "#0F172A",
    fontWeight: "500",
    marginBottom: 4,
    fontFamily: "Poppins-Regular",
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
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },

  /* ================= TAGS ================= */

  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1A56D9",
    backgroundColor: "#FFFFFF",
  },

  tagText: {
    color: "#1A56D9",
    fontWeight: "600",
    fontSize: 12,
  },
});
