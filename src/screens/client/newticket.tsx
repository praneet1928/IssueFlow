// NewTicket.tsx
import React, { useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
  Dimensions,
  Keyboard,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from '@react-navigation/native';


const priorities = ["Critical", "Moderate", "Low"] as const;
const issueTypes = ["Network", "Hardware", "Other"] as const;

type ImageKind = "product" | "issue";

async function requestGalleryPermission(): Promise<boolean> {
  try {
    const { status, granted, canAskAgain } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (granted || status === "granted") return true;
    if (!canAskAgain) {
      Alert.alert(
        "Permission required",
        "Gallery permission is denied and cannot be requested again. Please enable Photos/Media access in Settings."
      );
    }
    return false;
  } catch (e) {
    console.warn("Permission exception:", e);
    return false;
  }
}

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const NewTicket: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [selectedIssueType, setSelectedIssueType] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
	const navigation = useNavigation<any>();
	const route = useRoute();
  const [productImages, setProductImages] = useState<string[]>([]);
  const [issueImages, setIssueImages] = useState<string[]>([]);

  // Lightbox modal
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerList, setViewerList] = useState<string[]>([]);
  const flatRef = useRef<FlatList<string>>(null);

  const isFormValid = useMemo(
    () =>
      !!(
        selectedPriority &&
        selectedIssueType &&
        title &&
        location
      ),
    [selectedPriority, selectedIssueType, title, location, productImages]
  );

  const launchPicker = async (kind: ImageKind) => {
    const ok = await requestGalleryPermission();
    if (!ok) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (result.canceled) return;

      const uri = result.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("No image", "No image was returned from the gallery.");
        return;
      }

      if (kind === "product") setProductImages((prev) => [...prev, uri]);
      else setIssueImages((prev) => [...prev, uri]);
    } catch (e) {
      console.error("Picker error:", e);
      Alert.alert("Error", "Failed to open gallery.");
    }
  };

  const openViewer = (list: string[], index: number) => {
    setViewerList(list);
    setViewerIndex(index);
    setViewerVisible(true);
    setTimeout(() => {
      flatRef.current?.scrollToIndex({ index, animated: false });
    }, 0);
  };

  const removeImageAt = (kind: ImageKind, index: number) => {
    if (kind === "product")
      setProductImages((prev) => prev.filter((_, i) => i !== index));
    else setIssueImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSuccess = async() => {
      if (isFormValid) {
        Keyboard.dismiss();
        navigation.navigate('Successfull');
      }
    };

  const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / (SCREEN_W * 0.9));
    if (!Number.isNaN(i)) setViewerIndex(i);
  };

  return (
    <SafeAreaView style={styles.safearea}>
      {/* Completely hide the status bar for this screen */}

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 70 }}>
        {/* Title bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.closeCircle}
            onPress={() => {
              navigation.goBack?.();
            }}
          >
            <Text style={styles.closeX}>×</Text>
          </TouchableOpacity>
            <Text style={styles.bigTitle}>New Issue</Text>
        </View>

        <Text style={styles.label}>
          SELECT PRIORITY<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.row}>
          {priorities.map((item) => {
            const selected = selectedPriority === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.pill, selected && styles.pillSelected]}
                onPress={() => setSelectedPriority(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>
          ISSUE TYPE<Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.row}>
          {issueTypes.map((item) => {
            const selected = selectedIssueType === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.pill, selected && styles.pillSelected]}
                onPress={() => setSelectedIssueType(item)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, selected && styles.pillTextSelected]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>
          TITLE<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9CA3AF"
        />

        <TextInput
          style={styles.input}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#9CA3AF"
        />


        <Text style={styles.label}>ADD IMAGE</Text>
        <ImagesRow
          images={issueImages}
          onAdd={() => launchPicker("issue")}
          onPreview={(i) => openViewer(issueImages, i)}
          onRemove={(i) => removeImageAt("issue", i)}
        />

        <Text style={styles.label}>
          LOCATION<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={[styles.submitButton, !isFormValid && styles.buttonDisabled]}
          disabled={!isFormValid}
          onPress={handleSuccess}
        >
          <Text
            style={[styles.submitText, !isFormValid && styles.submitTextDisabled]}
          >
            Raise issue
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Lightbox modal */}
      <Modal
        visible={viewerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setViewerVisible(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.cardWrap} pointerEvents="box-none">
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardCounter}>
                {viewerIndex + 1} / {viewerList.length}
              </Text>
              <TouchableOpacity
                onPress={() => setViewerVisible(false)}
                style={styles.cardCloseBtn}
              >
                <Text style={styles.cardCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatRef}
              data={viewerList}
              keyExtractor={(u, i) => `${u}-${i}`}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumEnd}
              renderItem={({ item }) => (
                <View style={styles.page}>
                  <Image
                    source={{ uri: item }}
                    style={styles.zoomImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              initialScrollIndex={viewerIndex}
              getItemLayout={(_, index) => ({
                length: SCREEN_W * 0.9,
                offset: SCREEN_W * 0.9 * index,
                index,
              })}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NewTicket;

/** Row of circular thumbnails + circular “+” to add more */
const ImagesRow: React.FC<{
  images: string[];
  onAdd: () => void;
  onPreview: (index: number) => void;
  onRemove: (index: number) => void;
}> = ({ images, onAdd, onPreview, onRemove }) => {
  return (
    <View
      style={{
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      {images.map((uri, index) => (
        <View key={`${uri}-${index}`} style={{ alignItems: "center" }}>
          <TouchableOpacity onPress={() => onPreview(index)} activeOpacity={0.8}>
            <Image source={{ uri }} style={styles.circleThumb} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onRemove(index)}
            style={styles.removeChip}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          >
            <Text style={styles.removeX}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.addCircle}
        onPress={onAdd}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Text style={styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const CARD_W = SCREEN_W * 0.9;
const CARD_H = SCREEN_H * 0.7;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 20 },
  topBar: {
  position: "static",
  marginTop: 2,
  marginBottom: "18%",
  width: "100%",
  height: "8%"
},
  bigTitle: {
  marginTop: "15%",
  position: "absolute",
  left: 0,
  fontSize: 56,
  fontFamily: "Poppins-Regular",
  fontWeight: "600",
  color: "#081A41",
},
closeCircle: {
  position: "absolute",
  top: 10,
  right: 0,
  width: 36,
  height: 36,
  borderRadius: 18,
  borderColor: "#081A41",
  borderWidth: 1,
  alignItems: "center",
  justifyContent: "center",
},
  closeX: { fontSize: 22, color: "#081A41", lineHeight: 22 },

  label: { fontSize: 12, fontWeight: "700", color: "#5E5E5E", marginTop: 28 },
  required: { color: "#F97373" },

  row: { flexDirection: "row", marginTop: 10, gap: 12, flexWrap: "wrap" },
  pill: {
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
  },
  pillSelected: { backgroundColor: "#1A56D9", borderColor: "#1A56D9" },
  pillText: { fontSize: 14, color: "#A0A0A0", fontWeight: "400" },
  pillTextSelected: { color: "#fff" },
  safearea: {backgroundColor: "#fff",flex: 1},
  input: {
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 10,
    fontSize: 14,
    color: "#4B4B4B",
  },

  addCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#DADADA",
    justifyContent: "center",
    alignItems: "center",
  },
  plus: { fontSize: 24, color: "#5E5E5E", fontWeight: "600" },

  circleThumb: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#EEE" },

  submitButton: {
    backgroundColor: "#0D2B6C",
    borderRadius: 999,
    marginTop: 28,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#E8EBEF" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  submitTextDisabled: { color: "#9BA0A5" },

  // Lightbox modal styles
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  cardWrap: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SCREEN_W * 0.05,
  },
  card: {
    width: "100%",
    height: "75%",
    backgroundColor: "#000",
    borderRadius: 16,
    alignItems: "center",
    overflow: "hidden",
  },
  cardHeader: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardCounter: {
    color: "#fff",
    fontWeight: "700",
    backgroundColor: "rgba(255,255,255,0.14)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  cardCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCloseText: {
    color: "#fff",
    fontSize: 22,
    lineHeight: 22,
    fontWeight: "800",
  },
  page: {
    width: CARD_W,
    height: CARD_H,
    top: "4%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  zoomImage: {
    width: "80%",
    height: "90%",
  },
  removeChip: {
    position: "absolute",
    right: -6,
    top: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0A1448",
    alignItems: "center",
    justifyContent: "center",
  },
  removeX: { color: "#fff", fontSize: 12, lineHeight: 12, fontWeight: "700" },
});
