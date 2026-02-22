import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { RootStackParamList } from "../types/navigation";
import { useNavigation, useRoute } from "@react-navigation/native";
import Component from "../../../assets/images/back.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "NewPassword"
>;

const SetNewPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [focusedInput, setFocusedInput] = useState<
    "new" | "confirm" | null
  >(null);

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isErrorNew, setIsErrorNew] = useState(false);
const [isErrorConfirm, setIsErrorConfirm] = useState(false);
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, "NewPassword">>();
const insets = useSafeAreaInsets();

  const isButtonEnabled =
    newPassword.length >= 8 && confirmPassword.length >= 8;

  const handleSubmit = () => {
  setSubmitted(true);

  const passwordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{6,}$/;

  const passwordValid = passwordRegex.test(newPassword);
  const match = newPassword === confirmPassword;

  setIsErrorNew(!passwordValid);
  setIsErrorConfirm(!match);

  if (passwordValid && match) {
    navigation.reset({
  index: 0,
  routes: [{ name: "PasswordCreated" }],
});
  }
};

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#FFF" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons
                          name="chevron-back"
                          size={24}
                           style={{left: -5}}
                          color="#0F172A"
                        />
            </TouchableOpacity>

            <Text style={styles.title}>Set a new password</Text>
            <Text style={styles.subtitle}>
              Your password must be at least 8 characters and should include a combination of numbers, letters and special characters (!$@%)
            </Text>

            <View style={styles.form}>
              {/* New Password */}
              <Text style={styles.label}>New password</Text>
              <View
  style={[
    styles.inputBox,
    focusedInput === "new" && !isErrorNew && styles.inputFocused,
    isErrorNew && styles.inputBoxError,
  ]}
>
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showNew}
                  style={[
  styles.input,
  isErrorNew && styles.inputTextError
]}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  onFocus={() => setFocusedInput("new")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                  <Ionicons
                    name={showNew ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              {/* Password Rule Error */}
              {isErrorNew && (
  <View style={styles.errorRow}>
    <Text style={styles.errorIcon}>ⓘ</Text>
    <Text style={styles.errorText}>
      Password must contain atleast a number and special character
    </Text>
  </View>
)}

              {/* Confirm Password */}
              <Text style={styles.label}>Confirm new password</Text>
              <View
  style={[
    styles.inputBox,
    focusedInput === "confirm" && !isErrorConfirm && styles.inputFocused,
    isErrorConfirm && styles.inputBoxError,
  ]}
>
                <TextInput
                  placeholder="Confirm new password"
                  placeholderTextColor="#A0A0A0"
                  secureTextEntry={!showConfirm}
                  style={[
  styles.input,
  isErrorConfirm && styles.inputTextError
]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedInput("confirm")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                >
                  <Ionicons
                    name={
                      showConfirm ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>

              {/* Match Error */}
              {isErrorConfirm && (
  <View style={styles.errorRow}>
    <Text style={styles.errorIcon}>ⓘ</Text>
    <Text style={styles.errorText}>
      Passwords do not match
    </Text>
  </View>
)}
            </View>

            <View style={styles.bottom}>
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={!isButtonEnabled}
                style={[
                  styles.button,
                  !isButtonEnabled && styles.buttonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.buttonText,
                    !isButtonEnabled &&
                      styles.buttonTextDisabled,
                  ]}
                >
                  Change password
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SetNewPasswordScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    marginTop: 26,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 2,
  },

  form: {

  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
    marginBottom: 12,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 14,
    marginBottom: 4,
    justifyContent: "space-between",
  },

  inputFocused: {
    borderColor: "#4D8CFF",
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    fontWeight: "600"
  },

  error: {
    color: "#D92D20",
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    marginTop: 4,
  },

  bottom: {
    marginTop: "auto",
    paddingBottom: 20,
  },

  button: {
    height: 54,
    backgroundColor: "#0D2B6C",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#EDF0F3",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
  },

  buttonTextDisabled: {
    color: "#A0A0A0",
  },
  inputBoxError: {
  borderColor: "#D92D20",
},

inputTextError: {
  color: "#D92D20",
},

errorRow: {
  flexDirection: "row",
  alignItems: "center",
  width: "92%"
},

errorIcon: {
  fontSize: 14,
  color: "#D92D20",
  marginRight: 2,
},

errorText: {
  fontSize: 12,
  color: "#D92D20",
  fontStyle: "italic",
  fontFamily: "Poppins-Regular",
},
});