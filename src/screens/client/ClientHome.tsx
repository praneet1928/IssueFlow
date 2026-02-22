import React, { useMemo, useEffect, useState,useCallback  } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  Platform,
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
import IssueFlow from "../../../assets/images/issueflow.svg";
import Bell from "../../../assets/images/BellOutline.svg";
import PrinterIcon from "../../../assets/images/printer.svg";
import MonitorIcon from "../../../assets/images/monitor.svg";
import WifiIcon from "../../../assets/images/wifirouter.svg";
import GenericIcon from "../../../assets/images/GenericIcon.svg";
import TicketFaded from "../../../assets/images/ticketfaded.svg";
import Raise from "../../../assets/images/raise.svg";
import Tick from "../../../assets/images/Tick.svg";
import {TabParamList ,RootStackParamList} from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNotifications } from "../../context/NotificationContext";





/* ================= HEADER ================= */

function AppHeader() {
  const navigation = useNavigation<any>();
  const { notifications } = useNotifications();

  const hasUnread = notifications.some(n => !n.read);

  return (
    <View style={styles.appHeader}>
      <View style={styles.brandRow}>
        <IssueFlow height={40} width={148} />
      </View>

      <View style={styles.headerRight}>

        {/* 🔔 Notifications */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("ClientNotifications")}
        >
          <View style={{ position: "relative" }}>
            <Bell height={24} width={24} />

            {hasUnread && <View style={styles.Dot} />}
          </View>
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
  const navigation = useNavigation();
    const {
      tickets,
      history,
      addComment,
      removeTicket,
      discardTicket,
      resolveTicket,
      assignTicket,
    } = useTickets();
  const confirmClose = () => {
    Alert.alert(
      "Close Issue",
      "Are you sure you want to close the issue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Close",
          style: "destructive",
          onPress: () => {
            discardTicket(item.id);
          },
        },
      ]
    );
  };
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const getStatusStyle = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "not started") return { bg: "#E3E3E3", text: "#A0A0A0" };
  if (s === "in progress") return { bg: "#B8D1FF", text: "#4D8CFF" };
  if (s === "completed") return { bg: "#A9DFBF", text: "#27AE60" };
  return { bg: "#EDF0F3", text: "#A0A0A0" };
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
  const statusStyle = getStatusStyle(item.status);
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
  <View style={styles.card}>

    {/* TIME */}
    <Text style={styles.timeText}>
      {getRelativeTime(item.createdAt)}
    </Text>

    {/* TITLE */}
    <Text style={styles.issueTitle}>
      {item.title}
    </Text>

    {/* DIVIDER */}
    <View style={styles.divider} />

    {/* STATUS SECTION */}
    <View style={styles.bottomRow}>
      
      <View>
        <Text style={styles.statusLabel}>
          Current status
        </Text>

        <View style={[styles.statusBadge,{ backgroundColor: statusStyle.bg }]}>
          <Text style={{ color: statusStyle.text , fontFamily:"Poppins-Regular", fontWeight: "600"}}>
          ●  {capitalize(item.status ?? "unknown")}
          </Text>
        </View>
      </View>

      {/* END ISSUE BUTTON */}
      <TouchableOpacity style={styles.endButton} onPress={confirmClose}>
        <Text style={styles.endButtonText}>
          End Issue
        </Text>
      </TouchableOpacity>

    </View>

  </View>
</TouchableOpacity>
  );
}


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
  const allIssues = [...tickets];
const isEmpty = allIssues.length === 0;
const insets = useSafeAreaInsets();
 
const tabBarHeight = 60; 
let bottomValue;

if (Platform.OS === "android") {
  if (insets.bottom > 0 && insets.bottom < 48) {
    bottomValue = insets.bottom-200;
  } else if (insets.bottom >= 48) {
    bottomValue = insets.bottom;
  } else {
    bottomValue = -300;
  }
} else {
  bottomValue = insets.bottom - 300;
}

const totalBottomOffset = tabBarHeight + bottomValue + 10;
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
        <AppHeader />

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
        Start by reporting an issue when something needs attention.
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
  <View style={[styles.hintWrapper,{bottom: totalBottomOffset} ]} pointerEvents="none">
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
         navigation.navigate("TicketDetailed", {
  issueId: item.id,
})
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
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 19,
  },

  sectionTitle: {
    fontSize: 28,
    color: "#081A41",
    fontWeight: "600",
    marginTop: 20,
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#CED6E0",
  },

  timeText: {
    fontSize: 12,
    color: "#A0A0A0",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },

  issueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    lineHeight: 22,
  },

  divider: {
    height: 0.9,
    backgroundColor: "#CED6E0",
    marginBottom: 12,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  statusLabel: {
    fontSize: 13,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    marginBottom: 6,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
    height: 32,
    width: "70%",
    paddingHorizontal: 4,
    paddingVertical: 4,
     marginBottom: 55,
    borderRadius: 16,
  },


  statusText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2563EB",
    fontFamily: "Poppins-Regular",
  },

  endButton: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    borderRadius: 24,
    width: 114,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
  },

  endButtonText: {
    color: "#FF3B30",
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
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

Dot: {
  position: "absolute",
  top: 0,
  right: 2,
  width: 5,
  height: 5,
  borderRadius: 18,
  backgroundColor: "#081A41",
}
});
