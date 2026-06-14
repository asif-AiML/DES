import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";

interface PillToggleProps {
  activeMode: "ENCRYPT" | "DECRYPT";
  onToggle: (mode: "ENCRYPT" | "DECRYPT") => void;
}

export function PillToggle({ activeMode, onToggle }: PillToggleProps) {
  // 1. THE TIMELINE VALUE
  // We create a dedicated memory slot for a number. 0 means Encrypt, 1 means Decrypt.
  const slideAnim = useRef(
    new Animated.Value(activeMode === "ENCRYPT" ? 0 : 1),
  ).current;

  // 2. THE ENGINE (useEffect)
  // Every time 'activeMode' changes, this engine turns on and smoothly slides the number.
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeMode === "ENCRYPT" ? 0 : 1, // Target number
      duration: 250, // Take exactly 250 milliseconds
      useNativeDriver: false, // Required when animating layout percentages
    }).start();
  }, [activeMode]);

  // 3. THE TRANSLATOR
  // This takes our 0-to-1 number and translates it into physical left/right percentages.
  const leftPosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "50%"],
  });

  return (
    <View style={styles.container}>
      {/* 4. THE ANIMATED VIEW
          Notice we changed <View> to <Animated.View>. 
          This is a special box that knows how to read our moving timeline number. */}
      <Animated.View
        style={[
          styles.bluePuck,
          { left: leftPosition }, // We bind the puck to the timeline!
        ]}
      />

      <Pressable
        style={styles.invisibleButton}
        onPress={() => onToggle("ENCRYPT")}
      >
        <Text
          style={[styles.text, activeMode === "ENCRYPT" && styles.activeText]}
        >
          ENCRYPT
        </Text>
      </Pressable>

      <Pressable
        style={styles.invisibleButton}
        onPress={() => onToggle("DECRYPT")}
      >
        <Text
          style={[styles.text, activeMode === "DECRYPT" && styles.activeText]}
        >
          DECRYPT
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 30,
    marginVertical: 20,
    padding: 5,
    position: "relative",
  },
  bluePuck: {
    position: "absolute",
    top: 5,
    bottom: 5,
    width: "50%",
    backgroundColor: "#0a7ea4",
    borderRadius: 25,
  },
  invisibleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    zIndex: 1,
  },
  text: {
    color: "#666",
    fontWeight: "bold",
  },
  activeText: {
    color: "#fff",
  },
});
