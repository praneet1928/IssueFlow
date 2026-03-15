import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import Path from "../../../../assets/images/path.svg";
import * as ImagePicker from "expo-image-picker";
import { useTickets } from "../../../context/TicketContext";
import type { RootStackParamList } from "../../../types/navigation";
import type { IssueItem } from "../../../types";
import { Keyboard, InteractionManager } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";

type RouteProps = RouteProp<RootStackParamList, "TicketDetailed">;

const { width } = Dimensions.get("window");

/* ================= HELPERS ================= */

const getStatusStyle = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "not started") return { bg: "#E3E3E3", text: "#A0A0A0" };
  if (s === "in progress") return { bg: "#B8D1FF", text: "#4D8CFF" };
  if (s === "completed") return { bg: "#A9DFBF", text: "#27AE60" };
 // if (s === "discarded") return { bg: "#D9D9D9", text: "#A0A0A0" };
  return { bg: "#EDF0F3", text: "#A0A0A0" };
};

const getIssueIdColor = (priority: IssueItem["priority"]) => {
  if (priority === "critical") return "#FF3B30";
  if (priority === "moderate") return "#FF9500";
  return "#8E8E93";
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/* ================= TYPES ================= */
type TimelineType = "done" | "waiting";

/* ================= SCREEN ================= */

const TechnicianTicketDetailed: React.FC = () => {
  const navigation = useNavigation();
  const {
    tickets,
    history,
    addComment,
    addTicket,
    removeTicket,
    assignTicket,
    resolveTicket,
    removeFromHistory,
  } = useTickets();
  const { user } = useAuth();
const { params } = useRoute<RouteProp<RootStackParamList, "TicketDetailed">>();
const issue =
  tickets.find(t => t.id === params.issueId) ||
  history.find(t => t.id === params.issueId);

  if (!issue) {
    return null; // safety guard
  }

  const ticketComments = issue.comments || [];



  const [message, setMessage] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"comments" | "timeline">(
  params?.openComments ? "comments" : "timeline"
);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const statusStyle = getStatusStyle(issue.status);
  const shouldShowBottomBar =
  issue.status !== "completed" &&
  issue.status !== "discarded";
  /* ================= ACTIONS ================= */

  const pickImages = async () => {
  Keyboard.dismiss(); // 👈 force hide keyboard before picker

  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.7,
  });

  if (!res.canceled) {
    setDraftImages(res.assets.map(a => a.uri));
  }

  // 👇 force layout recalculation after native screen returns
  InteractionManager.runAfterInteractions(() => {
    Keyboard.dismiss();
  });
};
const renderItems = (items: any[]) =>
  items.map((item, index) => (
    <TimelineItem
      key={index}
      title={item.title}
      date={item.date}
      type={item.type}
      isLast={index === items.length - 1}
    />
  ));
const renderTimeline = () => {
  const items: {
    title: string;
    date: string;
    type: TimelineType;
  }[] = [];


  items.push({
    title: "Created",
    date: formatDate(issue.createdAt),
    type: "done",
  });

  if (issue.status === "discarded") {
    items.push({
      title: "Discarded",
      date: formatDate(issue.completedAt),
      type: "done",
    });

    return renderItems(items);
  }

  // ⏳ NOT ASSIGNED YET
  if (!issue.assignedTo) {
    items.push({
      title: "Assigned",
      date: "Waiting to be assigned",
      type: "waiting",
    });

    return renderItems(items);
  }

  // ✅ ASSIGNED
  items.push({
    title: "Assigned",
    date: formatDate(issue.assignedAt),
    type: "done",
  });

  // 🟡 CASE 2 — IN PROGRESS (CURRENTLY ONGOING)
  if (issue.status === "in progress") {
    items.push({
      title: "In Progress",
      date: "Technician is working on your issue",
      type: "waiting",
    });

    return renderItems(items);
  }

  // 🟢 CASE 3 — COMPLETED (NO In Progress step)
  if (issue.status === "completed") {
    items.push({
      title: "Completed",
      date: formatDate(issue.completedAt),
      type: "done",
    });

    return renderItems(items);
  }

  return renderItems(items);
};

 const sendMessage = () => {
  if (!message.trim() && draftImages.length === 0) return;

  addComment(issue.id, {
  text: message,
  images: draftImages,
  author: user?.name || "Technician",
});

  setMessage("");
  setDraftImages([]);
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

  const confirmClose = () => {
  Alert.alert(
    "End Issue",
    "Are you sure you want to End the issue?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, End",
        style: "destructive",
        onPress: () => {
          removeTicket(issue.id);
          removeFromHistory(issue.id);
          navigation.goBack();
        },
      },
    ]
  );
};
const { raiseAgain} = useTickets();
  const hasActiveInstance = tickets.some(
  t =>
    t.title === issue.title &&
    t.status !== "completed" &&
    t.status !== "discarded"
);
const handleRaiseAgain = () => {
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
          const newId = raiseAgain(issue);

          navigation.navigate("Successfull");
        },
      },
    ]
  );
};
const TimelineItem = ({
  title,
  date,
  type,
  isLast
}: {
  title: string;
  date: string;
  type: "done" | "waiting";
  isLast?: boolean;
}) => {
  return (
    <View style={styles.timelineRow}>
      <View style={styles.timelineLeft}>
        <View style={[
          styles.timelineIcon,
          type === "done" && styles.timelineIconDone
        ]}>
          {type === "done" ? (
            <Ionicons name="checkmark" size={20} color="#192839"/>
          ) : (
            <Ionicons name="time-outline" size={21} color="#40566D"/>
          )}
        </View>

        {!isLast && <View style={styles.timelineLine} />}
      </View>

      <View>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDate}>{date}</Text>
      </View>
    </View>
  );
};
const isClosed =
  issue.status === "completed" ||
  issue.status === "discarded";

const isActiveStatus =
  issue.status === "in progress" ||
  issue.status === "not started" ||
  issue.status === "assigned";

  const isCompleted = issue.status === "completed";

let buttonText = "";
let buttonColor = "#1C2F6F";
let showButton = true;

const handleAction = () => {
  if (issue.status === "not started") {
    assignTicket(issue.id, user?.name || "");
  } else if (issue.status === "in progress") {
    resolveTicket(issue.id);
  }
};

if (issue.status === "not started") {
  buttonText = "Start Now";
} 
else if (issue.status === "in progress") {
  buttonText = "Finish";
} 
else {
  showButton = false;
}
 const insets = useSafeAreaInsets();
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  return (

    <SafeAreaView style={styles.safe}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>Issue details</Text>
        </View>
        <View style={{ width: 20 }} />
      </View>

      {/* ================= CONTENT ================= */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" :  "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 10 : 0}
        enabled
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>{issue.title}</Text>
<Text style={styles.sectionTitle}>DETAILS</Text>
<View style={styles.detailsCard}>
  {/* STATUS */}
  <View style={styles.detailRow}>
    <Text style={styles.label}>Status</Text>
    <View
      style={[
        styles.statusPill,
        { backgroundColor: statusStyle.bg },
      ]}
    >
      <Text style={[styles.statusText, { color: statusStyle.text }]}>
        ● {capitalize(issue.status ?? "unknown")}
      </Text>
    </View>
  </View>

  {/* ISSUE ID */}
  <View style={styles.detailRow}>
    <Text style={styles.label}>Issue ID</Text>
    <View style={styles.issueIdRow}>
      <MaterialCommunityIcons
        name="star-circle"
        size={22}
        color={getIssueIdColor(issue.priority)}
      />
      <Text
        style={[
          styles.issueIdText,
          { color: getIssueIdColor(issue.priority) },
        ]}
      >
      {issue.code}
      </Text>
    </View>
  </View>

  <View style={[styles.detailRow]}>
    <Text style={styles.label}>Time</Text>
    <Text style={styles.value}>
      {formatDate(issue.createdAt)}
    </Text>
  </View>
  {/* LOCATION */}
  <View style={styles.detailRow}>
    <Text style={styles.label}>Location</Text>
    <Text style={styles.value}>{issue.location}</Text>
  </View>

  {/* TECHNICIAN */}
  <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
    <Text style={styles.label}>Raised by</Text>
    <Text style={styles.value}>
      {issue.createdBy ?? "-"}
    </Text>
  </View>
</View>




          {/* ============ IMAGES SLIDER ============ */}
          {!!issue.images?.length && (
  <>
    <Text style={styles.sectionTitle}>IMAGES</Text>

   <FlatList
  data={issue.images}
      horizontal
      pagingEnabled
      keyExtractor={(u, i) => `${u}-${i}`}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <TouchableOpacity
         onPress={() => {
  setViewerImages(issue.images || []);
  setViewerIndex(index);
  setViewerVisible(true);
}}

        >
          <Image source={{ uri: item }} style={styles.sliderImage} />
        </TouchableOpacity>
      )}
    />
  </>
)}


          {/* ============ DESCRIPTION ============ */}
          {!!issue.description && (
  <>
    <Text style={styles.sectionTitle}>DESCRIPTION</Text>

    <View style={styles.infoCard}>
      <Text style={styles.descriptionText}>
        {issue.description}
      </Text>
    </View>
  </>
)}


          {/* ============ COMMENTS ============ */}
          <View style={styles.commentsCard}>
<View style={styles.tabWrapper}>
  <View style={styles.tabRow}>
    <TouchableOpacity
      style={styles.tabButton}
      onPress={() => setActiveTab("comments")}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === "comments" && styles.activeTabText,
        ]}
      >
        Comments
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.tabButton}
      onPress={() => setActiveTab("timeline")}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === "timeline" && styles.activeTabText,
        ]}
      >
        Timeline
      </Text>
    </TouchableOpacity>
  </View>

  {/* Divider */}
  <View style={styles.tabDivider}>
    <View
      style={[
        styles.activeUnderline,
        activeTab === "timeline" && { left: "37%" },
      ]}
    />
  </View>
</View>

{activeTab === "comments" && (
  <>
    {ticketComments.length === 0 ? (
      <Text style={styles.empty}>No comments yet</Text>
    ) : (
      (ticketComments || []).map(c => (
        <View key={c.id} style={styles.commentRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>
  {(c.author || "U").split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()}
</Text>
          </View>

          <View style={styles.commentContent}>
            <Text style={styles.commentAuthor}>
  {c.author || "Technician"}{" "}
  <Text style={{ color: "#081A41" }}>•</Text>{" "}
  {getRelativeTime(c.createdAt)}
</Text>

            {c.text && (
              <Text style={styles.commentMessage}>
                {c.text}
              </Text>
            )}
            {c.images?.length > 0 && (
  <View style={styles.commentImageGrid}>
  {c.images.slice(0, 4).map((uri, i) => {
    const remaining = c.images.length - 4;

    return (
      <TouchableOpacity
        key={i}
        activeOpacity={0.9}
        style={styles.imageWrapper}
        onPress={() => {
          setViewerImages(c.images || []);
          setViewerIndex(i);
          setViewerVisible(true);
        }}
      >
        <Image
          source={{ uri }}
          style={[
            styles.commentImageModern,
            c.images.length === 1 && styles.singleImage,
          ]}
        />

        {i === 3 && remaining > 0 && (
          <View style={styles.moreOverlay}>
            <Text style={styles.moreText}>+{remaining}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  })}
</View>

)}
          </View>
        </View>
      ))
    )}
  {draftImages.length > 0 && (
  <View style={{ flexDirection: "row", marginBottom: 10 }}>
    {draftImages.map((uri, i) => (
      <Image
        key={i}
        source={{ uri }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 10,
          marginRight: 8,
        }}
      />
    ))}
  </View>
)}

    {/* Input Bar */}
{shouldShowBottomBar && (
  <View style={styles.commentInputBar}>
    <TextInput
      placeholder="Add a comment"
      placeholderTextColor={"#4B4B4B"}
      value={message}
      onChangeText={setMessage}
      style={styles.commentInput}
    />
    <TouchableOpacity onPress={pickImages}>
          <Ionicons name="attach-outline" size={24} color="#6B7280" />
        </TouchableOpacity>

    <TouchableOpacity
      style={styles.commentSendBtn}
      onPress={sendMessage}
    >
      <Ionicons name="send" size={16} color="#FFF" />
    </TouchableOpacity>
  </View>
)}
  </>
)}

{activeTab === "timeline" && (
  <View style={styles.timelineContainer}>
    {renderTimeline()}
  </View>
)}
</View>
          <View style={{ height: 110 }} />
        </ScrollView>

      {/* ================= BOTTOM BAR ================= */}

  {showButton && (
  <View style={styles.bottomBar}>
    <TouchableOpacity
      style={[styles.closeBtn, { backgroundColor: buttonColor }]}
      onPress={handleAction}
    >
      <Text style={styles.closeText}>
        {buttonText}
      </Text>
    </TouchableOpacity>
  </View>
)}

</KeyboardAvoidingView>

      {/* ============ IMAGE VIEWER ============ */}
      <Modal visible={viewerVisible} transparent>
        <FlatList
          data={viewerImages}
          horizontal
          pagingEnabled
          initialScrollIndex={viewerIndex}
          getItemLayout={(_, i) => ({
            length: width,
            offset: width * i,
            index: i,
          })}
          renderItem={({ item }) => (
            <View style={styles.viewerPage}>
              <Image source={{ uri: item }} style={styles.viewerImage} />
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.viewerClose}
          onPress={() => setViewerVisible(false)}
        >
          <Ionicons name="close" size={28} color="#FFF" />
        </TouchableOpacity>

      </Modal>
    </SafeAreaView>
  );
};

export default TechnicianTicketDetailed;

/* ================= INFO ROW ================= */

const InfoRow = ({
  label,
  text,
  value,
  highlightColor,
}: {
  label: string;
  text?: string;
  value?: React.ReactNode;
  highlightColor?: string;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {text && (
      <Text style={[styles.infoValue, highlightColor && { color: highlightColor }]}>
        {text}
      </Text>
    )}
    {value}
  </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },

  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: "#E5E7EB",
  },

  headerTitle: { fontSize: 18, fontWeight: "600",fontFamily: "Poppins-Regular" },

  content: { padding: 16 ,paddingBottom: 0,},

  title: { fontSize: 20, fontWeight: "600", color: "#081A41",fontFamily: "Poppins-Medium", marginBottom: 24 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "90%",
    alignItems: "center",
    marginBottom: 18,
     gap: 10,
  },
  infoLabel: { marginLeft: 8,fontSize: 14, color: "#081A41", width: "35%",fontFamily :"Poppins-Regular" },
  infoValue: {fontWeight: "600",fontSize: 14, color: "#49454F", fontFamily :"Poppins-Regular" },

  sectionTitle: { fontSize: 13, fontWeight: "600",fontFamily: "Poppins-Regular", marginBottom: 8 , color: "#A0A0A0"},

  sliderImage: {
    width: width - 50,
    height: 200,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 24
  },


  empty: { textAlign: "center", color: "#a0a0a0", fontFamily: "Poppins-Regular", fontWeight: "500", marginTop: 60,marginBottom: 50, },


  assignedRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 28,
  height: 28,
  borderRadius: 14,
  marginLeft: -1,
  backgroundColor: "#0D2B6C",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
},

  /* ================= TABS ================= */

tabRow: {
  flexDirection: "row",
  gap: 24,
  marginTop: 2,
  marginLeft: 5,
},

tabText: {
  fontSize: 16,
  color: "#CED6E0",
  fontWeight: "600",
  fontFamily: "Poppins-Regular",
},


/* ================= COMMENTS ================= */

commentRow: {
  flexDirection: "row",
  marginBottom: 18,
},

commentAvatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#F1F5F9",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
},

commentAvatarText: {
  fontWeight: "700",
  color: "#0D2B6C"
},

commentContent: {
  flex: 1,
},

commentAuthor: {
  fontSize: 13,
  color: "#A0A0A0",
  fontFamily: "Poppins-Medium",
  marginBottom: 4,
},

commentMessage: {
  fontSize: 14,
   fontFamily: "Poppins-Regular",
  color: "#4B4B4B",
},

commentInputBar: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#CED6E0",
  backgroundColor: "#fff",
  borderRadius: 12,
  paddingHorizontal: 12,
  paddingVertical: 4,
  marginTop: 20,
},


commentInput: {
  flex: 1,
  fontSize: 14,
  fontWeight: "500",
  fontFamily: "Poppins-Regular"
},
headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
commentSendBtn: {
  width: 36,
  height: 36,
  borderRadius: 10,
  backgroundColor: "#0D2B6C",
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 8,
},

/* ================= TIMELINE ================= */

timelineContainer: {
  marginTop: 10,
},

timelineRow: {
  flexDirection: "row",
  marginBottom: 5,
},

timelineLeft: {
  alignItems: "center",
  marginRight: 12,
},

infoCard: {
  backgroundColor: "#FAFBFC",
  borderRadius: 8,
  padding: 16,
},

descriptionText: {
  fontSize: 14,
  lineHeight: 20,
  fontFamily: "Poppins-Regular",
  color: "#4B4B4B",
},
timelineIcon: {
  width: 26,
  height: 26,
  borderRadius: 13,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F4E8E0",
},

timelineIconDone: {
  backgroundColor: "#DFEEE6",
},

timelineLine: {
  width: 1.5,
  height: 30,
  backgroundColor: "#90A5BB",
  marginTop: 4,
},

timelineTitle: {
  fontWeight: "600",
  fontSize: 14,
  fontFamily: "Poppins-Regular",
  color: "#4B4B4B"
},

timelineDate: {
  fontSize: 13,
  color: "#A0A0A0",
  fontFamily: "Poppins-Regular",
  marginTop: 4
},

commentsCard: {
  backgroundColor: "#FAFBFC",
  borderRadius: 8,
  padding: 16,
  marginTop: 20,
  minHeight: 297, 
},

viewerPage: {
  width,
  height: "100%",
  backgroundColor: "#000",
  alignItems: "center",
  justifyContent: "center",
},

viewerImage: {
  width: width,
  height: "70%",
  resizeMode: "contain",
},

viewerClose: {
  position: "absolute",
  top: 60,
  right: 20,
  backgroundColor: "rgba(0,0,0,0.6)",
  width: 40,
  height: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
},

commentImageGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 6,
  marginTop: 8,
},

imageWrapper: {
  position: "relative",
},

commentImageModern: {
  width: (width - 80) / 2,
  height: (width - 80) / 2,
  borderRadius: 14,
},

singleImage: {
  width: width * 0.6,
  height: width * 0.6,
  borderRadius: 16,
},

moreOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  borderRadius: 14,
  alignItems: "center",
  justifyContent: "center",
},

moreText: {
  color: "#FFF",
  fontSize: 20,
  fontWeight: "700",
},

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },

  detailsCard: {
    backgroundColor: "#FAFBFC",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB", // stroke/divider
  },

  label: {
    fontSize: 14,
    color: "#081A41",
    fontFamily: "Poppins-Regular",
  },
raiseIcon: {
  marginRight: 6,
},
  value: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    color: "#49454F",
  },

  /* STATUS */
  statusPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 14,
     fontFamily: "Poppins-Medium",
    fontWeight: "600",
  },

  /* ISSUE ID */
  issueIdRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  issueIdText: {
    marginLeft: 2,
    fontWeight: "600",
    fontSize: 14,
  },

  tabWrapper: {
  },

  

  tabButton: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },


  activeTabText: {
    color: "#111827",
    fontWeight: "600",
  },

  /* Divider Line */
  tabDivider: {
    height: 1,
    marginTop: 6,
    backgroundColor: "#E5E7EB",
    position: "relative",
    marginBottom: 20
  },

  /* Active underline inside divider */
  activeUnderline: {
    position: "absolute",
    width: "36%",
    height: 2,
    backgroundColor: "#111827",
  },

  bottomBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingVertical:10,
  paddingHorizontal: 16,
  borderTopWidth: 0.5,
  borderColor: "#E5E7EB",
  backgroundColor: "#FFF",
},

closeBtn: {
  width: "96%",
  backgroundColor: "#EF4444", // red normal state
  paddingVertical: 14,
  borderRadius: 12,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
},

closeText: {
  color: "#FFF",
  fontSize: 16,
  fontFamily: "Poppins-Regular",
  fontWeight: "600",
},

raiseAgainText: {
  color: "#FFF",
  fontFamily: "Poppins-Regular",
},

raiseAgainBtn: {
  backgroundColor: "#1A56D9", 
},

disabledBtn: {
  backgroundColor: "#EDF0F3", 
},

disabledText: {
  fontFamily: "Poppins-Regular",
  color: "#A0A0A0",
},
});
