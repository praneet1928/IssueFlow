import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import Report from "./../../assets/images/report.svg";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/types/navigation";

export default function ReportIssueScreen() {

type NavProp = NativeStackNavigationProp<
  RootStackParamList,
  "ReportIssue"
>;

const navigation = useNavigation<NavProp>();


  const [selected, setSelected] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const issues = [
    "Unable to raise issue",
    "Unable to track",
    "App not working",
    "Technical glitch",
    "Unable to comment",
    "Other",
  ];
  const handleReport = async () => {
  navigation.reset({
    index: 0,
    routes: [
      {
        name: "ClientTabs",
        state: {
          index: 0, // 👈 This forces tab index to 0
          routes: [
            {
              name: "ClientHome",
              params: { showToast: true },
            },
            {
              name: "ClientHistory",
            },
          ],
        },
      },
    ],
  });
};

  const pickImage = async () => {
  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7,
    allowsMultipleSelection: true, // ✅ MULTI SELECT
    selectionLimit: 5, // optional limit
  });

  if (!result.canceled) {
    const selectedUris = result.assets.map((asset) => asset.uri);
    setImages((prev) => [...prev, ...selectedUris]);
  }
};


  const isValid =
    selected &&
    (selected !== "Other" || description.trim().length > 0);
const removeImage = (uri: string) => {
  setImages((prev) => prev.filter((img) => img !== uri));
};

  const Option = ({ label }: { label: string }) => {
    const isActive = selected === label;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.option,
          isActive && styles.optionActive,
        ]}
        onPress={() => setSelected(label)}
      >
        <Text
          style={[
            styles.optionText,
            isActive && styles.optionTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#081A41" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Report width={18} />
          <Text style={styles.headerTitle}>
            Report technical problem
          </Text>
        </View>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.heading}>
          What is the technical problem?
        </Text>

        <Text style={styles.descriptionText}>
          Report any bug, error, or unexpected behavior in the app.
          Provide details so we can investigate and resolve it quickly.
        </Text>

        {/* OPTIONS */}
        <View style={styles.optionsWrapper}>
          {issues.map((item, index) => (
            <Option key={index} label={item} />
          ))}
        </View>

        {/* DESCRIPTION ONLY FOR OTHER */}
        {selected === "Other" && (
          <View style={{ marginTop: 30 }}>
            <Text style={styles.subHeading}>
              Can you provide clarity on the problem?
            </Text>

            <TextInput
              style={styles.textArea}
              placeholder="Write your issue here..."
              multiline
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />
          </View>
        )}

        {/* SCREENSHOT FOR ALL OPTIONS */}
        <View style={{ marginTop: 30 }}>
  <Text style={styles.screenshotLabel}>
    ADD SCREENSHOT
  </Text>

  <View style={styles.imageGrid}>
    {/* Add Button */}
    <TouchableOpacity
      style={styles.imagePicker}
      onPress={pickImage}
    >
      <Ionicons name="add" size={18} color="#A0A0A0" />
    </TouchableOpacity>

    {/* Preview Selected Images */}
    {images.map((uri, index) => (
      <View key={index} style={styles.imageWrapper}>
        <Image source={{ uri }} style={styles.imagePreview} />

        {/* Remove Button */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeImage(uri)}
        >
          <Ionicons name="close" size={14} color="#FFF" />
        </TouchableOpacity>
      </View>
    ))}
  </View>
</View>

      </ScrollView>

      {/* REPORT BUTTON */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={!isValid}
        style={[
          styles.reportButton,
          !isValid && styles.reportButtonDisabled,
        ]} onPress={handleReport}
      >
        <Text style={[styles.reportText,!isValid && styles.reportTextDisabled]}>Report</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
  },

  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  headerTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    color: "#081A41",
  },

  heading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    marginTop: 18,
    marginBottom: 10,
  },

  descriptionText: {
    fontSize: 16,
    letterSpacing: 0.2,
    color: "#4B4B4B",
    lineHeight: 21,
    marginBottom: 20,
  },

  optionsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  option: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CED6E0",
  },

  optionActive: {
    backgroundColor: "#1A56D9",
    borderColor: "#1A56D9",
  },

  optionText: {
    fontSize: 16,
    color: "#A0A0A0",
  },

  optionTextActive: {
    color: "#FFFFFF",
  },

  subHeading: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#081A41",
    marginBottom: 10,
  },

  textArea: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    minHeight: 80,
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#081A41",
  },

  reportButton: {
    marginBottom: 30,
    marginTop: 10,
    backgroundColor: "#17377F",
    paddingVertical: 18,
    borderRadius: 35,
    alignItems: "center",
  },

  reportButtonDisabled: {
    backgroundColor: "#edf0f3",
  },

  reportText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "700",
  },
  reportTextDisabled: {
    color: "#A0A0A0",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "700",
  },
imageGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 12,
},

imageWrapper: {
  width: 42,
  height: 42,
},

imagePicker: {
  width: 42,
  height: 42,
  marginTop: 2,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "#CBD5E1",
  alignItems: "center",
  justifyContent: "center",
},

imagePreview: {
  width: "100%",
  height: "100%",
  borderRadius: 20,
},

removeButton: {
  position: "absolute",
  top: -6,
  right: -6,
  backgroundColor: "#EF4444",
  width: 20,
  height: 20,
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
},

screenshotLabel: {
  fontSize: 12,
  letterSpacing: 0.5,
  color: "#4B4B4B",
  marginBottom: 12,
},


});
