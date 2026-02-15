import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import Profile from "../../../assets/images/Profile.svg";
import Password from "../../../assets/images/Password.svg";
import HelpCentre from "../../../assets/images/helpcentre.svg";
import Report from "../../../assets/images/report.svg";
import Logout from "../../../assets/images/logout.svg";
import Terms from "../../../assets/images/Terms.svg";
export default function SettingsScreen() {
  const navigation = useNavigation();

  
const handleLogout = () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes, Logout",
        style: "destructive",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ],
    { cancelable: true }
  );
};

  const Row = ({
  label,
  onPress,
  icon,
  danger = false,
  isLast = false,   // 👈 add this
}: {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  isLast?: boolean;
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.row,
      isLast && { borderBottomWidth: 0 }, // 👈 remove divider
    ]}
  >
    <View style={styles.rowContent}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text
        style={[
          styles.rowText,
          danger && { color: "#081A41" },
        ]}
      >
        {label}
      </Text>
    </View>

    {!danger && (
      <Ionicons
        name="chevron-forward"
        size={18}
        color="#9CA3AF"
      />
    )}
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <StatusBar style="dark" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={24}
            color="#0F172A"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Settings</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* GENERAL */}

      {/* HELP & SUPPORT */}
      <Text style={styles.sectionTitle}>HELP & SUPPORT</Text>
      <View style={styles.section}>
        <Row label="Terms of use & Privacy policy" icon={
    <Terms height={22}
    />
  } onPress={() => navigation.navigate("TermsPrivacy")} />
        <Row label="Help Centre" icon={
    <HelpCentre height={22} width={22}
    />
  } onPress={() => navigation.navigate("HelpCentre")}/>
        <Row label="Report technical problem" isLast icon={
    <Report width={22}
    />
  } onPress={() => navigation.navigate("ReportIssue")}/>
      </View>
      <Text style={[styles.sectionTitle, {marginTop: 40}]}>GENERAL</Text>
      <View style={styles.section}>
        <Row
          label="Account settings"
          icon={
    <Profile width={22} />
  }
          onPress={() => navigation.navigate("NewTicket")}
        />
      <View style={styles.section}>
        <Row
          label="Change Password"
          icon={
    <Password width={22}
    />
  }
          onPress={() => navigation.navigate("NewTicket")}
        />

      {/* ACTIONS */}
      <View style={styles.section}>
        <Row
  label="Logout"
  danger
  isLast
  icon={
    <Logout width={22} />
  }
  onPress={handleLogout}
/>
      </View>
      </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#081A41",
  },

  /* SECTION */
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#A0A0A0",
    fontFamily:"Poppins-Regular",
    marginTop: 24,
    marginBottom: 16,
  },
  section: {
    backgroundColor: "#FAFBFC",
    borderRadius: 20,
    marginTop: 2,
    marginBottom: 2,
    overflow: "hidden",
  },

  /* ROW */
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  icon: {
    marginRight: 16,
  },
  rowText: {
    fontSize: 16,
    color: "#081A41",
    fontFamily:"Poppins-Regular",
  },
});
