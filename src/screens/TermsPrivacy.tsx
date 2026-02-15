import React from "react";
import {
  View,
  Text,
  Linking,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons,MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import Terms from "../../assets/images/Terms.svg";
export default function TermsPrivacyScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.TermsIcon}>
        <Terms />
    </View>
        <Text style={styles.headerTitle}>
          Terms of use & Privacy policy
        </Text>

        <View style={{ width: 22 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* ---------------- TERMS ---------------- */}
        <Text style={styles.mainHeading}>Terms of use</Text>

        <Text style={styles.paragraph}>
          These Terms of Use (“Terms”) govern your access to and use of our
          website, mobile application, and related services.
        </Text>

        <Text style={[styles.paragraph, {marginBottom: 10}]}>
          By accessing or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
        </Text>

        <Text style={styles.sectionHeading}>1. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 18 years old (or the legal age in your country)
          to use the Service.
        </Text>
        <Text style={styles.paragraph}>
          By using the Service, you confirm that you meet this requirement.
        </Text>

        <Text style={styles.sectionHeading}>2. Your Account</Text>
        <Text style={styles.paragraph}>
          To use certain features, you may need to create an account. 
        </Text>
        <Text style={styles.paragraph}>
          You agree to:
        </Text>
        <Text style={styles.bullet}>•  Provide accurate and complete information.</Text>
        <Text style={styles.bullet}>•  Keep your login credentials secure.</Text>
        <Text style={styles.bullet}>•  Notify us immediately of any unauthorized use.</Text>
        <Text style={styles.paragraph}>
          You are responsible for all activity under your account.
        </Text>
        <Text style={styles.sectionHeading}>3. Use of the Service</Text>

        <Text style={styles.paragraph}>
          You agree to use the Service only for lawful purposes.
        </Text>

        <Text style={styles.bullet}>
          •  Violate any applicable laws or regulations.
        </Text>
        <Text style={styles.bullet}>
          •  Upload harmful code or attempt to disrupt the Service.
        </Text>
        <Text style={styles.bullet}>
          •  Access data that does not belong to you.
        </Text>
        <Text style={styles.bullet}>
          •  Use the Service to harass, abuse, or harm others.
        </Text>
        <Text style={styles.paragraph}>
          We reserve the right to suspend or terminate accounts that violate these rules.
        </Text>

        
    <Text style={styles.sectionHeading}>4. User Content</Text>
  <Text style={styles.paragraph}>
    You may upload or submit content such as text, files,
    comments, or other materials (“User Content”).
  </Text>

  <Text style={styles.paragraph}>
    You retain ownership of your content.
  </Text>

  <Text style={styles.paragraph}>
    By submitting content, you grant us a limited,
    non-exclusive license to host, store, and display it
    solely to operate and improve the Service.
  </Text>

  <Text style={styles.paragraph}>
    You are responsible for the content you upload.
  </Text>


<Text style={styles.sectionHeading}>5. Intellectual Property</Text>
  <Text style={styles.paragraph}>
    All rights, title, and interest in the Service
    (excluding User Content), including design, branding,
    features, and software, belong to us or our licensors.
  </Text>

  <Text style={styles.paragraph}>
    You may not copy, modify, distribute, or reverse
    engineer any part of the Service without written permission.
  </Text>


<Text style={styles.sectionHeading}>6. Disclaimer</Text>
  <Text style={styles.paragraph}>
    The Service is provided “as is” and “as available”.
    We do not guarantee that it will be uninterrupted,
    secure, or error-free.
  </Text>

<Text style={styles.sectionHeading}>7. Changes to These Terms</Text>
  <Text style={styles.paragraph}>
    We may update these Terms from time to time.
    If changes are material, we will provide notice
    through the Service. Continued use after updates means you accept
    the revised Terms.
  </Text>



        {/* ---------------- PRIVACY ---------------- */}

        <Text style={[styles.mainHeading, { marginTop: 30 }]}>
          Privacy policy
        </Text>

        <Text style={styles.sectionHeading}>Information We Collect</Text>

        <Text style={styles.subTitle}>A. Information You Provide</Text>
        <Text style={styles.bullet}>•  Name</Text>
        <Text style={styles.bullet}>•  Email address</Text>
        <Text style={styles.bullet}>•  Account credentials</Text>
        <Text style={styles.bullet}>•  Content you upload</Text>

        <Text style={styles.subTitle}>B. Information Collected Automatically</Text>
        <Text style={styles.bullet}>•  IP address</Text>
        <Text style={styles.bullet}>•  Device information</Text>
        <Text style={styles.bullet}>•  Browser type </Text>
        <Text style={styles.bullet}>•  Usage data (pages visited, actions taken, timestamps)</Text>
        
        <Text style={styles.subTitle}>C. Cookies and Tracking Technologies</Text>
        <Text style={styles.paragraph}>We use cookies and similar technologies to:</Text>
        <Text style={styles.bullet}>•  Keep you logged in</Text>
        <Text style={styles.bullet}>•  Understand usage patterns </Text>
        <Text style={styles.bullet}>•  Improve performance</Text>
        <Text style={styles.paragraph}>You can control cookies through your browser settings.</Text>

        <Text style={styles.sectionHeading}>Contact</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms,
          contact us at:
        </Text>
        <View style={styles.linkbox}> 
        <Text style={[styles.paragraph]}>
          Email:   
        </Text>
        <Text style={[styles.link]} onPress={() => Linking.openURL('mailto:info@issueflow.com')}>
           info@issueflow.com
        </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "Poppins-Regular",
    paddingVertical: 18,
  },

  TermsIcon: {
width: 28,
  height: 28,
  justifyContent: "center",
  marginLeft: 35,
  },
  headerTitle: {
    fontSize: 16,
    marginRight: 30,
    letterSpacing: 0.1,
    fontWeight: "400",
    color: "#081A41",
  },

  /* HEADINGS */

  mainHeading: {
    fontSize: 22,
    letterSpacing: 0.2,
    fontWeight: "700",
    fontFamily: "Poppins-Regular",
    color: "#081A41",
    marginBottom: 10,
    marginTop: 8,
  },

  sectionHeading: {
    fontSize: 18,
    letterSpacing: 0.1,
    fontWeight: "600",
    fontFamily: "Poppins-Regular",
    color: "#081A41",
    marginTop: 18,
    marginBottom: 6,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.1,
    fontFamily: "Poppins-Regular",
    color: "#4B4B4B",
    marginTop: 10,
    marginBottom: 4,
  },

  /* TEXT */
  paragraph: {
    fontSize: 16,
    color: "#4B4B4B",
    letterSpacing: 0.1,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    lineHeight: 21,
    marginTop: 8,
    //marginBottom: 6,
  },
  link: {
    fontSize: 16,
    color: "#081A41",
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
    lineHeight: 21,
    marginTop: 7,
    textDecorationLine: "underline",
    //marginBottom: 6,
  },
  linkbox: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "55%",
  },
  bullet: {
    fontSize: 16,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    letterSpacing: 0.1,
    lineHeight: 20,
    marginLeft: 8,
    marginBottom: 4,
  },
});
