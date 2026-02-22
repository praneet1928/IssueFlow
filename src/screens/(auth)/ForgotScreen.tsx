import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../types/navigation";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Lock from "../../../assets/images/lock.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "Forgot"
>;

const ForgotPassword: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const normalizedEmail = email.toLowerCase();
  const isFormValid = isValidEmail(normalizedEmail);

  const handleForgot = async () => {
    if (!isFormValid) {
      setError("Please enter a valid email");
      return;
    }

    try {
      setError(null);
      setLoading(true);
      Keyboard.dismiss();

      await new Promise((r) => setTimeout(r, 120));

      navigation.navigate("OtpScreen", {
        email: normalizedEmail,
      });
    } catch (e) {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.forgotPassword}>
      <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

          <View style={styles.view}>
            <View style={[styles.header]}>
        <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
             style={{left: -5}}
            color="#0F172A"
          />
        </TouchableWithoutFeedback>

      </View>
  {/* TOP CONTENT */}
  <View>
    <View style={[styles.topSection]}>
      <Lock width={64} height={64} />

      <Text style={styles.troubleLoggingIn}>
        Trouble logging in?
      </Text>

      <Text style={styles.wellSendA}>
        We’ll send a code to your email to reset your password.
      </Text>
    </View>

    <View style={styles.middleSection}>
      <View style={[ styles.userContainer, { borderColor: error ? "#D92D20" : focused ? "#4D8CFF" : "#CED6E0", }, ]} > 
        <TextInput style={styles.input} placeholder="Email address" placeholderTextColor="#A0A0A0" value={email} onChangeText={(t) => { setEmail(t); if (error) setError(null); }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" returnKeyType="done" />
    </View>
    </View>
  </View>
  {/* BOTTOM AREA */}
  <View style={styles.bottomWrapper}>
    <View style={styles.rememberTextContainer}>
      <Text>
        <Text style={styles.rememberYourPassword}>
          Remember your password?{" "}
        </Text>
        <Text onPress={handleLogin} style={styles.login}>
          Login
        </Text>
      </Text>
    </View>

    <Pressable
      style={[
        styles.loginButton,
        (!isFormValid || loading) &&
          styles.loginButtonDisabled,
      ]}
      onPress={handleForgot}
      disabled={!isFormValid || loading}
    >
      <Text
        style={[
          styles.loginButtonText,
          (!isFormValid || loading) &&
            styles.loginButtonTextDisabled,
        ]}
      >
        {loading ? "Sending..." : "Submit"}
      </Text>
    </Pressable>
  </View>
</View>


        </TouchableWithoutFeedback>
     </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  view: {
  flex: 1,
  paddingHorizontal: 20,
},

bottomWrapper: {
  position: "absolute",
  bottom: 10,
  left: 20,
  right: 20,
},
  header: {
    alignItems: "flex-start",
    paddingTop: 20,
    marginBottom: 50,
  },
  /* ---------- TOP ---------- */

  topSection: {
    marginBottom: 20,
  },

  troubleLoggingIn: {
    fontSize: 24,
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
    marginTop: 18,
    marginBottom: 12,
  },

  wellSendA: {
    fontSize: 14,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
  },

  /* ---------- INPUT ---------- */

  middleSection: {

  },

  userContainer: {
    width: "100%",
    height: 52,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#000",
  },

  errorText: {
    color: "#D92D20",
    marginTop: 8,
    fontSize: 13,
    fontFamily: "Poppins-Regular",
  },


  rememberTextContainer: {
    alignItems: "center",
    marginBottom: 12,
  },

  rememberYourPassword: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },

  login: {
    color: "#1A56D9",
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },

  loginButton: {
    width: "100%",
    height: 52,
    backgroundColor: "#0D2B6C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },

  loginButtonDisabled: {
    backgroundColor: "#EDF0F3",
  },

  loginButtonText: {
    color: "#ffff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
  },

  loginButtonTextDisabled: {
    color: "#A0A0A0",
  },
});


export default ForgotPassword;
