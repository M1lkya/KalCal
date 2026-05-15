import { AppThemeProvider, useAppTheme } from "@/theme/ThemeContext";
import "../global.css";

import { ClerkProvider, useAuth } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

const publishableKey = getEnv("EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
const convexUrl = getEnv("EXPO_PUBLIC_CONVEX_URL");

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

function RootStack() {
  const { themeName, colors } = useAppTheme();

  return (
    <>
      <StatusBar style={themeName === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <AppThemeProvider>
          <RootStack />
        </AppThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
