import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const CurvedArrow = () => {
  return (
    <View pointerEvents="none" style={styles.container}>
      <Svg width={220} height={380} viewBox="0 0 220 380" fill="none">
        <Path
          d="
            M 110 30
            C 95 110,
              130 190,
              115 260
            C 108 300,
              110 330,
              112 350
          "
          stroke="#123F8C"
          strokeWidth={8}
          strokeLinecap="round"
        />

        <Path
          d="
            M 112 350
            L 95 325
            M 112 350
            L 145 330
          "
          stroke="#123F8C"
          strokeWidth={8}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
};

export default CurvedArrow;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 290,
    left: 90, // lines up with Edit FAB
  },
});
