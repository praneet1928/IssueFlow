import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import HelpCentre from "./../../../../assets/images/helpcentre.svg";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function TechnicianHelpCentre() {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How to raise a community alert?",
      answer:
        "Go to the Community section from the dashboard. Tap 'Raise Alert', add the required details and submit. The alert will be visible to all relevant users.",
    },
    {
      question: "How to comment?",
      answer:
        "Open the issue, scroll to the comments section, type your message and press the send icon to post your comment.",
    },
    {
      question: "How to change status of an issue?",
      answer:
        "Open the issue details page and use the action button at the bottom to update its status (for example, mark it as completed or discard it).",
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#081A41" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <HelpCentre />
          <Text style={styles.headerTitle}>Help Centre</Text>
        </View>

        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>
          FREQUENTLY ASKED QUESTIONS
        </Text>

        <View style={styles.card}>
          {faqs.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <View key={index}>
                <TouchableOpacity
                  style={styles.faqRow}
                  activeOpacity={0.8}
                  onPress={() => toggleItem(index)}
                >
                  <Text style={styles.faqQuestion}>
                    {item.question}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="#081A41"
                  />
                </TouchableOpacity>

                {isOpen && (
                  <Text style={styles.faqAnswer}>
                    {item.answer}
                  </Text>
                )}

                {index !== faqs.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </View>

        {/* CONTACT SECTION */}
        <Text style={[styles.sectionLabel, { marginTop: 30 }]}>
          HAVE MORE QUESTIONS?
        </Text>

        <Text style={styles.contactText}>
          If you have any other question reach us out on{" "}
          <Text
            style={styles.email}
            onPress={() =>
              Linking.openURL("mailto:info@issueflow.com")
            }
          >
            info@issueflow.com
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
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
    gap: 6,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
    fontFamily: "Poppins-Regular",
    color: "#081A41",
  },

  sectionLabel: {
    fontSize: 14,
    letterSpacing: 0.5,
    color: "#A0A0A0",
    fontFamily: "Poppins-Regular",
    marginBottom: 16,
    marginTop: 28,
  },

  card: {
    backgroundColor: "#FAFBFC",
    borderRadius: 20,
    paddingVertical: 6,
    marginBottom: 10,
  },

  faqRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
  },

  faqQuestion: {
    fontSize: 16,
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    fontWeight: "600",
  },

  faqAnswer: {
    fontSize: 14,
    color: "#4B4B4B",
    paddingHorizontal: 14,
    fontFamily: "Poppins-Regular",
    paddingBottom: 12,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },

  contactText: {
    fontSize: 16,
    color: "#4B4B4B",
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },

  email: {
    fontWeight: "600",
    color: "#081A41",
    fontFamily: "Poppins-Regular",
    textDecorationLine: "underline",
  },
});
