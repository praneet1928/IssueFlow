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
import * as ImagePicker from "expo-image-picker";
import { useTickets } from "../../../context/TicketContext";
import type { RootStackParamList } from "../../../types/navigation";
import type { IssueItem } from "../../../types";
import { Keyboard, InteractionManager } from "react-native";


type RouteProps = RouteProp<RootStackParamList, "TicketDetailed">;

const { width } = Dimensions.get("window");

/* ================= HELPERS ================= */

const getStatusStyle = (status?: string) => {
  const s = status?.toLowerCase();
  if (s === "not started") return { bg: "#f0f0f0", text: "#A0A0A0" };
  if (s === "in progress") return { bg: "#d1e0fb", text: "#4D8CFF" };
  if (s === "completed") return { bg: "#d7efe1", text: "#27AE60" };
  return { bg: "#E5E7EB", text: "#6B7280" };
};

const getIssueIdColor = (priority: IssueItem["priority"]) => {
  if (priority === "critical") return "#DC2626";
  if (priority === "moderate") return "#F97316";
  return "#6B7280";
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

const TicketDetailed: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProps>();

  const {
    tickets,
    history,
    addComment,
    removeTicket,
    resolveTicket,
    assignTicket,
  } = useTickets();

  // 👇 Always get fresh issue from context
  const issue =
    tickets.find(t => t.id === params.issue.id) ||
    history.find(t => t.id === params.issue.id);

  if (!issue) {
    return null; // safety guard
  }

  const ticketComments = issue.comments || [];
  

  const [message, setMessage] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"comments" | "timeline">("comments");
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const statusStyle = getStatusStyle(issue.status);

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

const renderTimeline = () => {
  const items: {
    title: string;
    date: string;
    type: TimelineType;
  }[] = [];

  // 🔹 1. CREATED (always done)
  items.push({
    title: "Created",
    date: formatDate(issue.createdAt),
    type: "done",
  });

  // 🔹 2. ASSIGNED
  if (!issue.assignedTo) {
    items.push({
      title: "Assigned",
      date: "Waiting to be assigned",
      type: "waiting",
    });

    // 🚫 STOP here (don't show further steps)
    return items.map((item, index) => (
      <TimelineItem
        key={index}
        title={item.title}
        date={item.date}
        type={item.type}
        isLast={index === items.length - 1}
      />
    ));
  }

  // ✅ If assigned
  items.push({
    title: "Assigned",
    date: formatDate(issue.assignedAt),
    type: "done",
  });

  // 🔹 3. STATUS LOGIC
  if (issue.status !== "completed") {
    items.push({
      title: "In process",
      date: "Technician is Working on your issue",
      type: "waiting",
    });
  } else {
    items.push({
      title: "Completed",
      date: formatDate(issue.completedAt),
      type: "done",
    });
  }

  return items.map((item, index) => (
    <TimelineItem
      key={index}
      title={item.title}
      date={item.date}
      type={item.type}
      isLast={index === items.length - 1}
    />
  ));
};


type Comment = {
  id: string;
  text?: string;
  createdAt: string;
};




 const sendMessage = () => {
  if (!message.trim()) return;

  addComment(issue.id, message);

  setMessage("");
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
    "Close Issue",
    "Are you sure you want to close the issue?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Close",
        style: "destructive",
        onPress: () => {
          removeTicket(issue.id);
          navigation.goBack();
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


  const resolveIssue = () => {
  Alert.alert(
    "Resolve Issue",
    "How did it happen?",
    [
      {
        text: "Did you fix it?",
        onPress: () => {
          resolveTicket(issue.id);
          navigation.goBack();
        },
      },
      {
        text: "Technician has fixed",
        onPress: () => {
          resolveTicket(issue.id);
          navigation.goBack();
        },
      },
      { text: "Cancel", style: "cancel" },
    ]
  );
};


  return (

    <SafeAreaView style={styles.safe}>
      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue details</Text>
        <Ionicons name="ellipsis-horizontal" size={22} />
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

          <InfoRow
            label="Status"
            value={
              <View style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}>
                <Text style={{ color: statusStyle.text }}>
                  ●  {capitalize(issue.status ?? "unknown")}
                </Text>
              </View>
            }
          />
          <InfoRow label="Time" text={formatDate(issue.createdAt)} />
          <InfoRow
  label="Assigned to"
  value={
    <View style={styles.assignedRow}>
  {issue.assignedTo ? (
    <>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {issue.assignedTo[0].toUpperCase()}
        </Text>
      </View>
      <Text>{issue.assignedTo}</Text>
    </>
  ) : (
    <Text>-</Text>
  )}
</View>
  }
/>
          <InfoRow label="Location" text={issue.location} />

          <InfoRow
  label="Issue ID"
  value={
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <MaterialCommunityIcons
            name="ticket"
            size={22}
            color={getIssueIdColor(issue.priority)}
          />

      <Text
        style={{
          marginLeft: 6,
          fontWeight: "700",
          color: getIssueIdColor(issue.priority),
        }}
      >
        {issue.code}
      </Text>
    </View>
  }
/>



          {/* ============ IMAGES SLIDER ============ */}
          {!!issue.images?.length && (
  <>
    <Text style={styles.sectionTitle}>Images</Text>

    <FlatList
      data={issue.images}
      horizontal
      pagingEnabled
      keyExtractor={(u, i) => `${u}-${i}`}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          onPress={() => {
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
    <Text style={styles.sectionTitle}>Description</Text>

    <View style={styles.infoCard}>
      <Text style={styles.descriptionText}>
        {issue.description}
      </Text>
    </View>
  </>
)}


          {/* ============ COMMENTS ============ */}
          <View style={styles.commentsCard}>
<View style={styles.tabRow}>
  <TouchableOpacity onPress={() => setActiveTab("comments")}>
    <Text style={[
      styles.tabText,
      activeTab === "comments" && styles.activeTabText
    ]}>
      Comments
    </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => setActiveTab("timeline")}>
    <Text style={[
      styles.tabText,
      activeTab === "timeline" && styles.activeTabText
    ]}>
      Timeline
    </Text>
  </TouchableOpacity>
</View>

<View style={styles.tabDivider} />


{activeTab === "comments" && (
  <>
    {ticketComments.length === 0 ? (
      <Text style={styles.empty}>No comments yet</Text>
    ) : (
      (ticketComments || []).map(c => (
        <View key={c.id} style={styles.commentRow}>
          <View style={styles.commentAvatar}>
            <Text style={styles.commentAvatarText}>AD</Text>
          </View>

          <View style={styles.commentContent}>
            <Text style={styles.commentAuthor}>
                Aakash Deep · {getRelativeTime(c.createdAt)}
            </Text>

            {c.text && (
              <Text style={styles.commentMessage}>
                {c.text}
              </Text>
            )}
          </View>
        </View>
      ))
    )}

    {/* Input Bar */}
    <View style={styles.commentInputBar}>
      <TextInput
        placeholder="Add a comment"
        value={message}
        onChangeText={setMessage}
        style={styles.commentInput}
      />

      <TouchableOpacity onPress={pickImages}>
        <Ionicons name="attach-outline" size={24} color="#6B7280"/>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.commentSendBtn}
        onPress={sendMessage}
      >
        <Ionicons name="send" size={16} color="#FFF"/>
      </TouchableOpacity>
    </View>
  </>
)}

{activeTab === "timeline" && (
  <View style={styles.timelineContainer}>
    {renderTimeline()}
  </View>
)}
</View>
          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================= BOTTOM BAR ================= */}
      <View style={styles.bottomBar}>

        <TouchableOpacity style={styles.closeBtn} onPress={confirmClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resolveBtn} onPress={resolveIssue}>
          <Text style={styles.resolveText}>Resolved</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={{
    backgroundColor: "#0D2B6C",
    paddingVertical: 13,
    paddingHorizontal: 22,
    margin: 10,
    borderRadius: 12,
  }}
  onPress={() => assignTicket(issue.id, "John")}
>
  <Text style={{ color: "#FFF", fontWeight: "600",fontFamily: "Poppins-Regular", fontSize: 16  }}>
    Assign
  </Text>
</TouchableOpacity>
      </View>

      {/* ============ IMAGE VIEWER ============ */}
      <Modal visible={viewerVisible} transparent>
        <FlatList
          data={issue.images}
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

export default TicketDetailed;

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

  headerTitle: { fontSize: 16, fontWeight: "600" },

  content: { padding: 16 ,paddingBottom: 0,},

  title: { fontSize: 22, fontWeight: "600", color: "#081A41", marginBottom: 16, marginLeft: 4 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "70%",
    alignItems: "center",
    marginBottom: 12,
     gap: 10,
  },
  infoLabel: { marginLeft: 5,fontSize: 13, color: "#64748B", width: "35%" },
  infoValue: {fontWeight: "700", },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 13,
    marginLeft: -2,
  },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 12 },

  sliderImage: {
    width: width - 50,
    height: 200,
    borderRadius: 16,
    marginRight: 10,
  },

  description: { fontSize: 14, lineHeight: 20 },

  empty: { textAlign: "center", color: "#a0a0a0", fontFamily: "Poppins-Regular", fontWeight: "500", marginTop: 60,marginBottom: 50, },

  comment: { flexDirection: "row", marginBottom: 12 },
  bubble: {
    backgroundColor: "#F3F4F6",
    padding: 10,
    borderRadius: 12,
    flex: 1,
  },

  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  avatarText: { fontWeight: "600", color: "#fff" },

  commentImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginTop: 8,
  },

  draftImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 8,
    marginTop: 8,
  },

  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 12,
    padding: 7,
    marginTop: 12,
  },
  input: { flex: 1, marginRight: 8 },

  sendBtn: {
    backgroundColor: "#1157ee",
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  bottomBar: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : 0,
    left: 0,
    right: 0,
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },

  closeBtn: {
    borderWidth: 1,
    borderColor: "#0D2B6C",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
  },
  closeText: { color: "#0D2B6C", fontWeight: "600",fontFamily: "Poppins-Regular", fontSize: 16 },

  resolveBtn: {
    backgroundColor: "#0D2B6C",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0D2B6C",
  },
  resolveText: { color: "#ffff", fontWeight: "600" ,fontFamily: "Poppins-Regular", fontSize: 16 },
  assignedRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 28,
  height: 28,
  borderRadius: 14,
  marginLeft: -1,
  backgroundColor: "#4D8CFF",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 8,
},

  viewerPage: {
    width,
    height: "100%",
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  viewerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  viewerClose: {
    position: "absolute",
    top: 40,
    right: 20,
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

activeTabText: {
  color: "#081A41",
  borderBottomWidth: 2,
  borderBottomColor: "#1E293B",
  paddingBottom: 5,
},

tabDivider: {
  height: 1,
  backgroundColor: "#E5E7EB",
  marginTop: 6,
  marginBottom: 16,
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
  marginRight: 10,
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
  marginBottom: 4,
},

commentMessage: {
  fontSize: 14,
  color: "#4B4B4B",
},

commentInputBar: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#CED6E0",
  backgroundColor: "#fff",
  borderRadius: 12,
  position: "fixed",
  paddingHorizontal: 12,
  paddingVertical: 4,
  marginTop: 30,

},

commentInput: {
  flex: 1,
  fontSize: 14,
  fontWeight: "500",
  fontFamily: "Poppins-Regular"
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
  backgroundColor: "#F8FAFC",
  borderRadius: 16,
  padding: 16,
  marginTop: 8,
},

descriptionText: {
  fontSize: 14,
  lineHeight: 22,
  color: "#334155",
},
timelineIcon: {
  width: 26,
  height: 26,
  borderRadius: 13,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f7ebe2",
},

timelineIconDone: {
  backgroundColor: "#dcf0e6",
},

timelineLine: {
  width: 1.5,
  height: 30,
  backgroundColor: "#90A5BB",
  marginTop: 4,
},

timelineTitle: {
  fontWeight: "700",
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
  backgroundColor: "#F8FAFC",
  borderRadius: 8,
  padding: 16,
  marginTop: 20,
  minHeight: 297, // 🔥 minimum height even if no comments
},



});
