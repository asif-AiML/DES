import { useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Importing your Custom Lego Bricks (The Frames and Images)
import { PillToggle } from "../components/PillToggle";
import { PremiumCard } from "../components/PremiumCard";

// 2. Importing the Engine (The Back Room)
import { processDESCipher } from "../utils/desLogic";

export default function HomeScreen() {
  // ==========================================
  // THE BULLETIN BOARD (State / Sticky Notes)
  // ==========================================
  const [inputText, setInputText] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [mode, setMode] = useState<"ENCRYPT" | "DECRYPT">("ENCRYPT");
  const [outputMessage, setOutputMessage] = useState("");

  // THE NEW WORKER: Smoothly flips the switch
  const handleModeToggle = (newMode: "ENCRYPT" | "DECRYPT") => {
    setMode(newMode);
  };

  // ==========================================
  // THE TRIGGER (Calling the Engine)
  // ==========================================
  const handleExecute = () => {
    Keyboard.dismiss(); // Hide keyboard just like in the calculator!

    // Grab the sticky notes, throw them to the Engine, and catch the result
    const resultObject = processDESCipher(inputText, secretKey, mode);

    // Pin the result to the output sticky note
    setOutputMessage(resultObject.result);
  };

  // ==========================================
  // THE DUMB UI (The Mirrors & Frames)
  // ==========================================
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="always" // Fixing the double-tap bug!
      >
        <Text style={styles.headerTitle}>DES ENCRYPTION</Text>

        {/* FRAME 1: The Secret Message */}
        <PremiumCard title="1. SECRET MESSAGE">
          <TextInput
            style={styles.inputBox}
            placeholder="Type your message here..."
            placeholderTextColor="#555"
            value={inputText}
            onChangeText={setInputText}
            multiline={true} // Allows the box to grow tall for paragraphs
          />
          {/* This means: If inputText is NOT empty, draw the button. */}
          {inputText !== "" && (
            <Pressable
              style={styles.clearButton}
              onPress={() => setInputText("")} // Wipes the sticky note blank!
            >
              <Text style={styles.clearButtonText}>Clear Message</Text>
            </Pressable>
          )}
        </PremiumCard>

        {/* FRAME 2: The 8-Character Key */}
        <PremiumCard title="2. DES KEY (8 CHARACTERS)">
          <TextInput
            style={styles.inputBox}
            placeholder="e.g. MYSECRET"
            placeholderTextColor="#555"
            value={secretKey}
            onChangeText={setSecretKey}
            maxLength={8} // Forces the user to stop at 8 characters
          />
        </PremiumCard>

        {/* FRAME 3: The Toggle Switch */}
        <PremiumCard title="3. CIPHER SETTINGS">
          <PillToggle activeMode={mode} onToggle={handleModeToggle} />
        </PremiumCard>

        {/* THE ACTION BUTTON */}
        {/* THE ACTION BUTTON (Now with dynamic pressing feedback!) */}
        <Pressable
          onPress={handleExecute}
          style={({ pressed }) => [
            styles.executeButton,
            pressed && styles.executeButtonPressed, // If pressed, add this extra style!
          ]}
        >
          {({ pressed }) => (
            <Text
              style={[
                styles.executeButtonText,
                pressed && styles.executeButtonTextPressed, // If pressed, change text color!
              ]}
            >
              EXECUTE {mode}
            </Text>
          )}
        </Pressable>

        {/* FRAME 4: The Output (Only draws if there is actually a message to show) */}
        {outputMessage !== "" && (
          <PremiumCard title="OUTPUT RESULT">
            <Text style={styles.outputText} selectable={true}>
              {outputMessage}
            </Text>
          </PremiumCard>
        )}
        <Text style={styles.footerText}>Developed by Asif🫶</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ==========================================
// THE PAINT (Premium Styling)
// ==========================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F13", // A very dark, premium app background
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 500,
  },
  headerTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    letterSpacing: 2,
  },
  inputBox: {
    backgroundColor: "#111",
    color: "#FFF",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 50,
  },
  executeButton: {
    backgroundColor: "#0a7ea4", // The accent color
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 4,
  },
  executeButtonPressed: {
    backgroundColor: "#054b66", // A darker, pressed-in blue
    borderColor: "#00FF41", // Suddenly flashes a matrix green border!
    borderWidth: 2,
    transform: [{ scale: 0.95 }], // The physical squish: shrinks the button by 5%
  },
  executeButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  executeButtonTextPressed: {
    color: "#00FF41", // Text flashes green to match the border
  },
  outputText: {
    color: "#00FF41", // Matrix green for the encrypted text!
    fontSize: 16,
    fontFamily: "monospace", // Makes it look like computer code
  },
  clearButton: {
    alignSelf: "flex-end", // Pushes the button neatly to the right side
    marginTop: 8, // Gives a little breathing room from the text box
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearButtonText: {
    color: "#FF4136", // A subtle red warning color to indicate "delete"
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footerText: {
    color: "#888", // A subtle gray color so it doesn't distract from the math
    fontSize: 14, // Slightly smaller text
    textAlign: "center", // Centers it on the screen
    marginTop: 10, // Pushes it down 40 pixels away from whatever is above it
    fontStyle: "italic", // Gives it a nice signature look
  },
});
