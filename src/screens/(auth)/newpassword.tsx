// src/screens/HomeScreen.tsx
import React, { useMemo,useState,useEffect } from 'react';
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
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { HomeScreenProps, IssueItem, DeviceItem } from '../../types';
import BrandLogo from "../../../assets/images/brandlogo.svg";
import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";
import { SafeAreaView } from 'react-native-safe-area-context';


const primaryBlue = '#103482';

const mockIssues: IssueItem[] = [
  {
    id: 'issue-1',
    code: '#AD677',
    priority: 'critical',
    timestampMinutesAgo: 20,
    title: 'My Wi-Fi is showing Red Light',
    location: 'CSE Block 201',
    categoryTags: [
      { id: 'tag-hw', label: 'Hardware' },
    ],
    Device: 'Wifi',
  },
  {
    id: 'issue-2',
    code: '#AD672',
    priority: 'moderate',
    timestampMinutesAgo: 40,
    title: 'My monitor is not getting ON',
    location: 'ECE Block 001',
    categoryTags: [
      { id: 'tag-sw', label: 'Software' },
      { id: 'tag-hw', label: 'Hardware' },
    ],
    Device: 'Monitor',

  },
  {
    id: 'issue-3',
    code: '#AD565',
    priority: 'low',
    timestampMinutesAgo: 55,
    title: 'My printer is not getting connected to Wi-Fi and please check',
    location: 'CSE Block 201',
    categoryTags: [
      { id: 'tag-sw', label: 'Software' },
      { id: 'tag-nw', label: 'Network' },
      
    ],
    Device: 'Printer',
    },
];

const mockDevices: DeviceItem[] = [
  {
    id: 'device-1',
    name: 'HP printer',
    serialNumber: '19238432243275',
    imageUrl: 'https://images.unsplash.com/photo-1583225272834-0d9f3b6bd0e5?w=640&q=80',
    inWarranty: true,
  },
];


function AppHeader({
  onOpenNotifications,
}: {
  onOpenNotifications?: () => void;
}) {
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
          source={{
            uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
          }}
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
      case "critical":
        return '#FF3B30';
      case "moderate":
        return '#F68D2B';
      case "low":
        return "#8E8E93";
      default:
        return "#000";
    }};

    const getDeviceIcon = (deviceName: string) => {
  switch (deviceName.toLowerCase()) {
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

  
  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Issue ${item.title}`}>
      <View style={styles.issueRow}>
        <View style={styles.issueLeft}>
          <View style={styles.issueMeta}>
                <MaterialCommunityIcons name="ticket" size={23} color= {getPriorityColor(item.priority)} />
            <Text style={[styles.issueCodeText, { color: getPriorityColor(item.priority) }]}>{item.code}</Text>
            <Text style={styles.issueTime}>{item.timestampMinutesAgo} mins ago</Text>
            </View>
        <View style={styles.issueMain}>
            <Text style={styles.issueTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.issueLocation}>{item.location}</Text>
           <View style={styles.issueImage}>
            {getDeviceIcon(item.Device)}
           </View>
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



function DeviceCard({ item }: { item: DeviceItem }) {
  return (
    <View style={styles.card} accessibilityRole="summary" accessibilityLabel={`Device ${item.name}`}>
      <View style={styles.deviceRow}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.deviceImage}
          resizeMode="cover"
          accessible
          accessibilityLabel={`${item.name} image`}
        />
        <View style={styles.deviceMeta}>
          <Text style={styles.deviceTitle}>{item.name}</Text>
          <Text style={styles.deviceSerial}>Serial: {item.serialNumber}</Text>
          {item.inWarranty ? (
            <View style={styles.warrantyBadge} accessible accessibilityLabel="In warranty">
              <Feather name="check-circle" size={14} color="#065f46" />
              <Text style={styles.warrantyText}>In warranty</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  userName = 'john',
  issues = mockIssues,
  devices = mockDevices,
  isLoading = false,
  error = null,
  onRequestNewDevice,
  onOpenNotifications,
  onFabPress,
}) => {
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

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
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

          <View style={{ height: 24 }} />

          <Text style={styles.sectionSubTitle} accessibilityRole="header">Your devices</Text>
          <FlatList
            data={devices}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => <DeviceCard item={item} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingTop: 5 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No devices found.</Text>}
            accessibilityLabel="Your devices list"
          />

          <TouchableOpacity
            style={styles.requestButton}
            activeOpacity={0.9}
            onPress={onRequestNewDevice}
            accessibilityRole="button"
            accessibilityLabel="Request a new device"
          >
            <Feather name="plus" size={18} color="#2563eb" />
            <Text style={styles.requestButtonText}>Request a new device</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusHeaderBar: {
    height: 28,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  appHeader: {
    marginTop: "10%",
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 1,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    marginLeft: 6,
    fontSize: 22,
    fontWeight: '500',
    color: "#103482",
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0.1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 20,
  },
  avatar: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
  },
  greeting: {
    fontSize: 18,
    color: '#4B4B4B',
    fontFamily:'Poppins-Regular',
    fontWeight:500,
    marginTop: "5%",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 50,
    color: '#103482',
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionSubTitle: {
    marginTop: 10,
    fontSize: 18,
    color: '#000000ff',
    fontWeight: '500',
  },
  card: {
    marginTop: 12,
    backgroundColor: '#ffffffff',
    borderRadius:12,
    padding: 8,
    borderColor: '#0000001A',
    borderWidth: 0.4,
    shadowColor: '#c1b9b9ff',
    shadowOpacity: 5,
    shadowRadius: 10,
    shadowOffset: { width: 3, height: 4 },
    elevation: 2,
  },
  issueRow: {
    flexDirection: 'column',
    //alignItems: 'center',
  },
  issueLeft: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  issueCodeCircle: {
    width: 48,
    height: 15,
    //borderRadius: 24,
    //backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
   // borderWidth: 1,
   // borderColor: '#fecaca',
  },
  issueCodeText: {
    fontWeight: '700',
    marginLeft:-168,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  issueMeta: {
    flex: 1,
    flexDirection:'row',
    justifyContent:'space-between',
    marginBottom:8,
  },
  issueTime: {
    fontSize: 12,
    color: '#A0A0A0',
    //marginRight: 2,
    alignItems:'flex-end',
    marginBottom: 4,
  },
  issueTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily:'Poppins-Regular'
  },
  issueMain: {
    flexDirection: 'column',
    marginBottom: 4,
  },
  issueLocation: {
    fontSize: 13,
    color: '#A0A0A0',
    marginBottom:10,
  },
  issueImage: {
    width: 64,
    borderWidth: 0.5,
    borderColor: "#0000001A",
    borderRadius: 8,
    padding: 8,
    marginLeft: 10,
    alignItems: 'center',
    backgroundColor: '#ffffffff',
  },
  image:{
    flex: 1,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  } as any,
  tagChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A56D9',
    backgroundColor: '#fff',
  },
  tagText: {
    color: '#1A56D9',
    fontWeight: '600',
    fontSize: 12,
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
    marginRight: 12,
  },
  deviceMeta: {
    flex: 1,
  },
  deviceTitle: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  deviceSerial: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  warrantyBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#d1fae5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    gap: 6,
  } as any,
  warrantyText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '700',
  },
  requestButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: primaryBlue,
    backgroundColor: '#eff6ff',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  } as any,
  requestButtonText: {
    color: primaryBlue,
    fontWeight: '700',
  },
  emptyText: {
    color: '#64748b',
    marginTop: 8,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#334155',
    fontSize: 14,
  },
  errorText: {
    color: '#b91c1c',
    fontWeight: '700',
  },
});