import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; // 1. Bring back the safety net tool

export default function RootLayout() {
  return (
    // 2. Wrap the entire app inside the safety net
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaProvider>
  );
}
