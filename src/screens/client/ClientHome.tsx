import React, { useMemo } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { HomeScreenProps, IssueItem } from '../../types';
import BrandLogo from "../../../assets/images/brandlogo.svg";
import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";
import Home from "../../../assets/images/Category.svg";
import Raise from "../../../assets/images/raise.svg";
import TicketOutline from "../../../assets/images/TicketOutline.svg";

const primaryBlue = '#103482';
const inactiveBlue = '#7aa2ff';

const mockIssues: IssueItem[] = [
  { id: 'issue-1', code: '#AD677', priority: 'critical', timestampMinutesAgo: 20, title: 'My Wi-Fi is showing Red Light', location: 'CSE Block 201', categoryTags: [{ id: 'tag-hw', label: 'Hardware' }], Device: 'Wifi' },
  { id: 'issue-2', code: '#AD672', priority: 'moderate', timestampMinutesAgo: 40, title: 'My monitor is not getting ON', location: 'ECE Block 001', categoryTags: [{ id: 'tag-sw', label: 'Software' }, { id: 'tag-hw', label: 'Hardware' }], Device: 'Monitor' },
  { id: 'issue-3', code: '#AD565', priority: 'low', timestampMinutesAgo: 55, title: 'My printer is not getting connected to Wi-Fi and please check', location: 'CSE Block 201', categoryTags: [{ id: 'tag-sw', label: 'Software' }, { id: 'tag-nw', label: 'Network' }], Device: 'Printer' },
];

function AppHeader({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  return (
    <View style={styles.appHeader}>
      <View style={styles.brandRow}>
        <BrandLogo height={25} />
        <Text style={styles.brandText}>IssueFlow</Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          onPress={onOpenNotifications}
          accessibilityRole="button"
          accessibilityLabel="Open notifications"
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={22} color="#000000ff" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' }}
          style={styles.avatar}
          accessible
          accessibilityLabel="User profile image"
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
  const getDeviceIcon = (deviceName: string) => {
    switch (deviceName.toLowerCase()) {
      case "printer": return <PrinterIcon width={48} height={42} />;
      case "monitor": return <MonitorIcon width={48} height={40} />;
      case "wifi": return <WifiIcon width={48} height={40} />;
      default: return <GenericIcon width={48} height={40} />;
    }
  };

  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Issue ${item.title}`}>
      <View style={styles.issueRow}>
        <View style={styles.issueLeft}>
          <View style={styles.issueMeta}>
            <MaterialCommunityIcons name="ticket" size={23} color={getPriorityColor(item.priority)} />
            <Text style={[styles.issueCodeText, { color: getPriorityColor(item.priority) }]}>{item.code}</Text>
            <Text style={styles.issueTime}>{item.timestampMinutesAgo} mins ago</Text>
          </View>
          <View style={styles.issueMain}>
            <Text style={styles.issueTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.issueLocation}>{item.location}</Text>
            <View style={styles.issueImage}>{getDeviceIcon(item.Device)}</View>
            <View style={styles.tagRow}>
              {item.categoryTags.map(tag => (
                <View key={tag.id} style={styles.tagChip} accessible accessibilityLabel={`Tag ${tag.label}`}>
                  <Text style={styles.tagText}>{tag.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
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
  const navigation = useNavigation<any>();
  const route = useRoute();
  const currentRouteName = route.name;
  const getTint = (screen: string) => (currentRouteName === screen ? primaryBlue : inactiveBlue);
  const isActive = (screen: string) => currentRouteName === screen;

  const { width } = useWindowDimensions();
  const contentPadding = useMemo(() => (width < 360 ? 12 : 16), [width]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={[styles.centerBox, { paddingHorizontal: contentPadding }]}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={[styles.centerBox, { paddingHorizontal: contentPadding }]}>
          <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        <AppHeader onOpenNotifications={onOpenNotifications} />

        <ScrollView contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.greeting} accessibilityRole="header">Hello, {userName}!</Text>
          <Text style={styles.sectionTitle} accessibilityRole="header">Issues Raised by you</Text>

          <FlatList
            data={issues}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => <IssueCard item={item} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 8 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No issues yet.</Text>}
            accessibilityLabel="Your issues list"
          />
        </ScrollView>

        <View style={styles.bottomBarContainer} pointerEvents="box-none">
          <View style={styles.bottomBar}>
            <TouchableOpacity
              onPress={() => { if (!isActive('ClientHome')) navigation.navigate('ClientHome'); }}
              style={styles.bottomItem}
              accessibilityRole="button"
              accessibilityLabel="Go to Home"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {/* If your SVG uses fill for tint, change color= to fill= */}
              <Home width={24} color={getTint('Home')} />
              <Text style={[styles.bottomLabel, { color: getTint('Home') }]}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { if (!isActive('CreateIssue')) navigation.navigate('NewTicket'); }}
              style={styles.fabWrapper}
              accessibilityRole="button"
              accessibilityLabel="Create issue"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <View style={styles.fabCircle}>
                <Raise width={100} color={getTint('CreateIssue')} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { if (!isActive('Forgot')) navigation.navigate('Forgot'); }}
              style={styles.bottomItem}
              accessibilityRole="button"
              accessibilityLabel="Go to History"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <TicketOutline width={22} color={getTint('History')} />
              <Text style={[styles.bottomLabel, { color: getTint('History') }]}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ClientHomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  appHeader: { marginTop: "10%", paddingVertical: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 1, justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandText: { marginLeft: 6, fontSize: 22, fontWeight: '500', color: "#103482", fontFamily: 'Poppins-Bold', letterSpacing: 0.1 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8, borderRadius: 20, marginRight: 20 },
  avatar: { width: 36, height: 36, marginRight: 8, borderRadius: 16, backgroundColor: '#e2e8f0' },

  greeting: { fontSize: 18, color: '#4B4B4B', fontFamily:'Poppins-Regular', fontWeight:500, marginTop: "5%", marginBottom: 2 },
  sectionTitle: { fontSize: 50, color: '#103482', fontWeight: '500', marginBottom: 8 },

  card: { marginTop: 12, backgroundColor: '#ffffffff', borderRadius:12, padding: 8, borderColor: '#0000001A', borderWidth: 0.4, shadowColor: '#c1b9b9ff', shadowOpacity: 5, shadowRadius: 10, shadowOffset: { width: 3, height: 4 }, elevation: 2 },
  issueRow: { flexDirection: 'column' },
  issueLeft: { flex: 1, flexDirection: 'column', padding: 10 },
  issueCodeText: { fontWeight: '700', marginLeft:-168, fontFamily: 'Poppins-Regular', fontSize: 16 },
  issueMeta: { flex: 1, flexDirection:'row', justifyContent:'space-between', marginBottom:8 },
  issueTime: { fontSize: 12, color: '#A0A0A0', alignItems:'flex-end', marginBottom: 4 },
  issueTitle: { fontSize: 16, color: '#0f172a', fontWeight: '500', marginBottom: 4, fontFamily:'Poppins-Regular' },
  issueMain: { flexDirection: 'column', marginBottom: 4 },
  issueLocation: { fontSize: 13, color: '#A0A0A0', marginBottom:10 },
  issueImage: { width: 64, borderWidth: 0.5, borderColor: "#0000001A", borderRadius: 8, padding: 8, marginLeft: 10, alignItems: 'center', backgroundColor: '#ffffffff' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, gap: 8 } as any,
  tagChip: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#1A56D9', backgroundColor: '#fff' },
  tagText: { color: '#1A56D9', fontWeight: '600', fontSize: 12 },

  emptyText: { color: '#64748b', marginTop: 8 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#334155', fontSize: 14 },
  errorText: { color: '#b91c1c', fontWeight: '700' },

  bottomBarContainer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  bottomBar: {
    height: 84,
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  bottomItem: { alignItems: 'center', justifyContent: 'center' },
  bottomLabel: { marginTop: 6, fontSize: 12, color: '#0f172a' },
  fabWrapper: { alignItems: 'center', justifyContent: 'center' },
  fabCircle: {
   // borderRadius: 34,
    //backgroundColor: '#c5d7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});