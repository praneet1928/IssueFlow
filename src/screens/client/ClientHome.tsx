import React, { useMemo, useEffect, useState,useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRoute ,RouteProp,useNavigation} from "@react-navigation/native";
import type { HomeScreenProps, IssueItem } from "../../types";
import { useTickets } from "../../context/TicketContext";
import BrandLogo from "../../../assets/images/brandlogo.svg";
import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import Raise from "../../../assets/images/raise.svg";
import Tick from "../../../assets/images/Tick.svg";
import {TabParamList ,RootStackParamList} from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


/* ================= MOCK DATA ================= */

const mockIssues: IssueItem[] = [
];


/* ================= HEADER ================= */

function AppHeader({ onOpenNotifications }: { onOpenNotifications?: () => void }) {
  const navigation = useNavigation();
  return (
    <View style={styles.appHeader}>
      <View style={styles.brandRow}>
        <BrandLogo height={25} />
        <Text style={styles.brandText}>IssueFlow</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity onPress={onOpenNotifications} style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={22} color="#081A41" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ClientProfile")}
        >
        <Avatar name="Rishi Sayal" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= ISSUE CARD ================= */

function IssueCard({
  item,
  onPress,
}: {
  item: IssueItem;
  onPress: () => void;
}) {
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

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.issueMeta}>
          <MaterialCommunityIcons
            name="ticket"
            size={22}
            color={getPriorityColor(item.priority)}
          />

          <Text
            style={[
              styles.issueCodeText,
              { color: getPriorityColor(item.priority) },
            ]}
          >
            {item.code}
          </Text>

          <Text style={styles.issueTime}>
            {item.timestampMinutesAgo}1 mins ago
          </Text>
        </View>

        <Text style={styles.issueTitle}>{item.title}</Text>
        <Text style={styles.issueLocation}>{item.location}</Text>

        <View style={styles.issueImage}>
          {getDeviceIcon(item.Device)}
        </View>

        <View style={styles.tagRow}>
          {item.categoryTags.map((tag) => (
            <View key={tag.id} style={styles.tagChip}>
              <Text style={styles.tagText}>{tag.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

};

function Avatar({ name }: { name: string }) {
  const letter = name.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={[styles.avatarCircle]}>
      <Text style={styles.avatarText}>{letter}</Text>
    </View>
  );
}

/* ================= MAIN SCREEN ================= */

const ClientHomeScreen: React.FC<HomeScreenProps> = ({
  
  userName = "Rishi Sayal",
  issues = mockIssues,
  isLoading = false,
  error = null,
  onOpenNotifications,
}) => {
 type HomeNavProp = NativeStackNavigationProp<
  RootStackParamList
>;

const navigation = useNavigation<HomeNavProp>();
  const { width } = useWindowDimensions();
  const [showToast, setShowToast] = useState(false);
type ClientHomeRouteProp = RouteProp<
  TabParamList,
  "ClientHome"
>;
const route = useRoute<ClientHomeRouteProp>();
  const contentPadding = useMemo(() => (width < 360 ? 12 : 16), [width]);
  const { tickets } = useTickets();
  const allIssues = [...tickets, ...issues];
const isEmpty = allIssues.length === 0;

const [showTutorial, setShowTutorial] = useState(false);
const [disableTutorial, setDisableTutorial] = useState(false);

useEffect(() => {
  let timer: ReturnType<typeof setTimeout>;

  if (route.params?.showToast) {
    setShowToast(true);

    // Remove the param completely
    navigation.setParams({});
    
    timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [route.params?.showToast]);




useEffect(() => {
  if (isEmpty && !showToast && !disableTutorial) {
    const showTimer = setTimeout(() => {
      setShowTutorial(true);

      const hideTimer = setTimeout(() => {
        setShowTutorial(false);
      }, 5100);

      return () => clearTimeout(hideTimer);
    }, 2000);

    return () => clearTimeout(showTimer);
  }
}, [isEmpty, showToast]);


  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={[styles.container, { paddingHorizontal: contentPadding }]}>
        <AppHeader onOpenNotifications={onOpenNotifications} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Raised Issues</Text>

{isEmpty ? (
  <>
    {/* EMPTY STATE */}
    <View style={styles.emptyContainer}>
      {/* Illustration */}
      <View style={styles.illustrationWrapper}>
        <TicketFaded
          width={150}
          height={82}
        />
      </View>

      <Text style={styles.emptyTitle}>
        No active issues
      </Text>

      <Text style={styles.emptySubtitle}>
        Start by reporting an issue when{"\n"}
        something needs attention.
      </Text>

      {/* PRIMARY CTA */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.primaryButton}
        onPress={() => navigation.navigate("NewTicket")}
      >
        <Text style={styles.primaryButtonText}>Raise an issue</Text>
      </TouchableOpacity>
    </View>

    {/* FLOATING TUTORIAL HINT */}
{isEmpty && showTutorial && !showToast && (
  <View style={styles.hintWrapper} pointerEvents="none">
    <View style={styles.hintBubble}>
      <View style={styles.hintIcon}>
        <Raise width={32} height={42} color="#1E40AF" />
      </View>
      <Text style={styles.hintText}>
        Start by reporting an issue
      </Text>
    </View>
    <View style={styles.hintNotch} />
  </View>
)}


  </>
) : (
  <FlatList
    data={allIssues}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <IssueCard
        item={item}
        onPress={() =>
          navigation.navigate("TicketDetailed", { issue: item })
        }
      />
    )}
    scrollEnabled={false}
  />
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

export default ClientHomeScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",

  },
  container: {
    flex: 1,
  },

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

  sectionTitle: {
    fontSize: 28,
    color: "#081A41",
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 20,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 20,
  },
avatarCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#0D2B6C",
  alignItems: "center",
  justifyContent: "center",
},

avatarText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "700",
  fontFamily: "Poppins-Bold",
},

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
  /* ===== EMPTY STATE ===== */

emptyContainer: {
  marginTop: 120,
  alignItems: "center",
  paddingHorizontal: 32,
},

illustrationWrapper: {
  marginBottom: 24,
  opacity: 0.8,
},

emptyTitle: {
  fontSize: 20,
  fontWeight: "600",
  fontFamily: "Poppins-Regular",
  color: "#081A41",
  textAlign: "center",
  marginBottom: 8,
},

emptySubtitle: {
  fontSize: 16,
  color: "#6B7280",
  textAlign: "center",
  fontFamily: "Poppins-Regular",
  lineHeight: 22,
  marginBottom: 24,
},

/* PRIMARY BUTTON */

primaryButton: {
  backgroundColor: "#0B2C6F",
  paddingVertical: 12,
  paddingHorizontal: 26,
  borderRadius: 10,
},

primaryButtonText: {
  color: "#ffffff",
  fontSize: 14,
  fontFamily: "Poppins-Regular",
  fontWeight: "600",
},



  issueTitle: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
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
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
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
  /* ===== FLOATING TUTORIAL HINT (EXACT SHAPE) ===== */

hintWrapper: {
  position: "absolute",
  top: "135%", // adjust to sit above FAB
  width: "100%",
  alignItems: "center",
},

hintBubble: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#EEF2FF",
  paddingVertical: 12,
  paddingHorizontal: 18,
  borderRadius: 12,
},

hintIcon: {
  width: 28,
  height: 28,
  borderRadius: 14,
  backgroundColor: "#DBEAFE",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 10,
},

hintText: {
  fontSize: 14,
  fontWeight: "600",
  fontFamily: "Poppins-Regular",
  color: "#0B2C6F",
},

/* This creates the *integrated* pointer */
hintNotch: {
  width: 16,
  height: 16,
  backgroundColor: "#EEF2FF",
  transform: [{ rotate: "45deg" }],
  marginTop: -9,           // pulls into bubble
},

toast: {
  position: "absolute",
  top: "89%",
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
  backgroundColor: "#103482",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

toastText: {
  flex: 1,
  color: "#103482",
  fontFamily: "Poppins-Regular",
  fontSize: 12,
  fontWeight: "500",
},


});
