import React from "react";
import { StyleSheet, Text, View } from "react-native";

// The Contract
interface PremiumCardProps {
  title: string;
  // 'React.ReactNode' simply means "any valid React UI elements"
  children: React.ReactNode;
}

export function PremiumCard({ title, children }: PremiumCardProps) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>

      {/* This is the hollow space where the other components will be injected */}
      <View style={styles.cardContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#1E1E24", // Premium dark grey, not harsh black
    borderRadius: 16, // Smooth, modern rounded corners
    padding: 20,
    marginVertical: 10,
    width: "100%",
    // Android Shadow
    elevation: 5,
    // iOS Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardTitle: {
    color: "#0a7ea4",
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  cardContent: {
    width: "100%",
  },
});
