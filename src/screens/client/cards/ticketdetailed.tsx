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
import { Ionicons } from "@expo/vector-icons";
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
  if (s === "in progress") return { bg: "#CFE0FF", text: "#4D8CFF" };
  if (s === "in review") return { bg: "#D6E0FF", text: "#1A56D9" };
  if (s === "completed") return { bg: "#DFF5EA", text: "#27AE60" };
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

type Comment = {
  id: string;
  text?: string;
  images?: string[];
};

/* ================= SCREEN ================= */

const TicketDetailed: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProps>();
  const { issue } = params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState("");
  const [draftImages, setDraftImages] = useState<string[]>([]);

  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const { removeTicket } = useTickets();
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




  const sendMessage = () => {
    if (!message.trim() && draftImages.length === 0) return;

    setComments(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: message || undefined,
        images: draftImages.length ? draftImages : undefined,
      },
    ]);

    setMessage("");
    setDraftImages([]);
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


  const resolveIssue = () => {
  Alert.alert(
    "Resolve Issue",
    "How did it happen?",
    [
      {
        text: "Did you fix it?",
        onPress: () => {
          removeTicket(issue.id);
          navigation.goBack();
        },
      },
      {
        text: "Technician has fixed",
        onPress: () => {
          removeTicket(issue.id);
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
                  ● {capitalize(issue.status ?? "unknown")}
                </Text>
              </View>
            }
          />

          <InfoRow label="Location" text={issue.location} />

          <InfoRow
            label="Issue ID"
            text={`★ ${issue.code}`}
            highlightColor={getIssueIdColor(issue.priority)}
          />
          <InfoRow label="Time" text={formatDate(issue.createdAt)} />

<InfoRow
  label="Assigned to"
  value={
    <View style={styles.assignedRow}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {issue.assignedTo?.[0]?.toUpperCase() ?? "?"}
        </Text>
      </View>
      <Text>{issue.assignedTo ?? "Unassigned"}</Text>
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
              <Text style={styles.description}>{issue.description}</Text>
            </>
          )}

          {/* ============ COMMENTS ============ */}
          <Text style={styles.sectionTitle}>Comments</Text>

          {comments.length === 0 && (
            <Text style={styles.empty}>No comments yet</Text>
          )}

          {comments.map(c => (
            <View key={c.id} style={styles.comment}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarText}>U</Text>
              </View>
              <View style={styles.bubble}>
                {c.text && <Text>{c.text}</Text>}
                {c.images?.map((img, i) => (
                  <Image key={i} source={{ uri: img }} style={styles.commentImage} />
                ))}
              </View>
            </View>
          ))}

          {draftImages.length > 0 && (
            <FlatList
              data={draftImages}
              horizontal
              keyExtractor={(u, i) => `${u}-${i}`}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={styles.draftImage} />
              )}
            />
          )}

          {/* INPUT */}
          <View style={styles.inputBar}>
            <TextInput
              placeholder="Add a comment"
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />
            <TouchableOpacity onPress={pickImages}>
              <Ionicons name="attach-outline" size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
              <Ionicons name="send" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={{ height: 80 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ================= BOTTOM BAR ================= */}
      <View style={styles.bottomBar}>
        <Text style={{ flex: 1, fontWeight: "600" }}>Time 04:48</Text>

        <TouchableOpacity style={styles.closeBtn} onPress={confirmClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resolveBtn} onPress={resolveIssue}>
          <Text style={styles.resolveText}>Resolved</Text>
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

  title: { fontSize: 22, fontWeight: "700", marginBottom: 16 },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: { fontSize: 13, color: "#64748B" },
  infoValue: { fontWeight: "700" },

  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },

  sectionTitle: { fontSize: 16, fontWeight: "700", marginVertical: 12 },

  sliderImage: {
    width: width - 50,
    height: 200,
    borderRadius: 16,
    marginRight: 10,
  },

  description: { fontSize: 14, lineHeight: 20 },

  empty: { textAlign: "center", color: "#9CA3AF" },

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
  avatarText: { fontWeight: "700", color: "#4B5563" },

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
    borderColor: "#000",
    borderRadius: 10,
    padding: 8,
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
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFF",
  },

  closeBtn: {
    borderWidth: 1,
    borderColor: "#1E3A8A",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    marginRight: 10,
  },
  closeText: { color: "#1E3A8A", fontWeight: "600" },

  resolveBtn: {
    backgroundColor: "#1E3A8A",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  resolveText: { color: "#FFF", fontWeight: "600" },
  assignedRow: {
  flexDirection: "row",
  alignItems: "center",
},

avatar: {
  width: 28,
  height: 28,
  borderRadius: 14,
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
});
