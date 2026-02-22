import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import type { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../types/navigation";
import LockOpen from "../../../assets/images/lockopen.svg";
type NavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const PasswordCreatedScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#F6F7F9" />

      <View style={styles.container}>

        {/* ICON */}
        <View style={styles.iconWrapper}>
          <LockOpen width={64} height={64} />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          Password has been created
        </Text>

        {/* DESCRIPTION */}
        <Text style={styles.subtitle}>
          To login to your account, click the Login button and enter your email along with your new created password
        </Text>

        {/* PUSH BUTTON TO BOTTOM */}
        <View style={{ flex: 1 }} />

        {/* LOGIN BUTTON */}
       <TouchableOpacity
  style={styles.button}
  onPress={() =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }
>
  <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default PasswordCreatedScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F7F9",
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 52,
  },

  iconWrapper: {
    marginBottom: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#4B4B4B",
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#0D2B6C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 80,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
  },
});