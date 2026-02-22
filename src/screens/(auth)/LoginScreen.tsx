import React, { useState } from "react";
import { RootStackParamList } from "../../types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import IssueFlow from "../../../assets/images/issueflow.svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { CommonActions } from "@react-navigation/native";


type LoginScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList, "Login">;


const LoginScreen: React.FC = () => {
const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState<
    "email" | "password" | null
  >(null);

  const isFormValid = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
  if (isFormValid) {
    Keyboard.dismiss();
    await new Promise((r) => setTimeout(r, 100));

    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "ClientTabs" }],
      })
    );
  }
};

  const handleForgot = async () => {
    Keyboard.dismiss();
    await new Promise((r) => setTimeout(r, 100));
    navigation.navigate("Forgot");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrapper}>
            
            {/* TOP CONTENT */}
            <View>
              <View style={styles.logoContainer}>
                <IssueFlow width={235} height={60} />
              </View>

              <Text style={styles.title}>Login to your account</Text>

              {/* EMAIL */}
              <View
                style={[
                  styles.inputBox,
                  focusedInput === "email" && styles.focused,
                ]}
              >
                <TextInput
                  placeholder="Employee ID or email address"
                  placeholderTextColor="#A0A0A0"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>

              {/* PASSWORD */}
              <View
                style={[
                  styles.inputBox,
                  focusedInput === "password" && styles.focused,
                ]}
              >
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#A0A0A0"
                  style={styles.input}
                  secureTextEntry={!passwordVisible}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={
                      passwordVisible ? "eye-outline" : "eye-off-outline"
                    }
                    size={20}
                    color="#CED6E0"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleForgot}>
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* BOTTOM SECTION */}
            <View style={styles.bottomSection}>
              <Text style={styles.footerText}>
                By signing up via your social profile or by email you agree
                with IssueFlow's{" "}
                <Text style={styles.link}>
                  Terms & Conditions
                </Text>{" "}
                and{" "}
                <Text style={styles.link}>
                  Privacy Policy
                </Text>
              </Text>

              <TouchableOpacity
                style={[
                  styles.loginBtn,
                  !isFormValid && styles.loginBtnDisabled,
                ]}
                onPress={handleLogin}
                disabled={!isFormValid}
              >
                <Text
                  style={[
                    styles.loginText,
                    !isFormValid &&
                      styles.loginTextDisabled,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFF",
  },

  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },

  logoContainer: {
    marginTop: 90,
    alignItems: "center",
    marginBottom: 60,
  },

  title: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    color: "#081A41",
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 16,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CED6E0",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
  },

  focused: {
    borderColor: "#4D8CFF",
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
  },

  forgotText: {
    alignSelf: "flex-end",
    color: "#A0A0A0",
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
  },

  bottomSection: {
    paddingBottom: 24,
    gap: 12,
  },

  footerText: {
    fontSize: 12,
    color: "#A0A0A0",
    fontFamily: "Poppins-Regular",
  },

  link: {
    color: "#4D8CFF",
  },

  loginBtn: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0D2B6C",
    justifyContent: "center",
    alignItems: "center",
  },

  loginBtnDisabled: {
    backgroundColor: "#E5E9F0",
  },

  loginText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
  },

  loginTextDisabled: {
    color: "#9CA3AF",
  },
});