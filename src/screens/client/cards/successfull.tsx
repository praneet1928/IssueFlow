import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const TICK_LENGTH = 60;

const Successfull: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const strokeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // Circle pop
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),

      // Tick draw
      Animated.timing(strokeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),

      // Small pause
      Animated.delay(700),

      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "ClientTabs" }],
      });
    });
  }, []);

  const strokeDashoffset = strokeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [TICK_LENGTH, 0],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Svg width={100} height={100} viewBox="0 0 100 100">
          <AnimatedCircle
            cx="50"
            cy="50"
            r="45"
            fill="#0B2C6F"
          />
          <AnimatedPath
            d="M30 52 L45 65 L70 38"
            stroke="#FFFFFF"
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            strokeDasharray={TICK_LENGTH}
            strokeDashoffset={strokeDashoffset}
          />
        </Svg>
      </Animated.View>

      <Text style={styles.text}>
        Your issue has been raised{"\n"}successfully
      </Text>
    </Animated.View>
  );
};

export default Successfull;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 30,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    fontWeight: "500",
  },
});
