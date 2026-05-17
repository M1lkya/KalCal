import { api } from "@/convex/_generated/api";
import { useAppTheme } from "@/theme/ThemeContext";
import { useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect, useRef } from "react";

function getLocalDateString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function Layout() {
  const { colors, themeName } = useAppTheme();
  const { isLoaded, isSignedIn } = useUser();

  const ensureDailyLogForDate = useMutation(
    api.functions.food.ensureDailyLogForDate,
  );

  const hasCheckedDailyLogRef = useRef(false);

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;
    if (!hasCompletedOnboarding) return;
    if (hasCheckedDailyLogRef.current) return;

    hasCheckedDailyLogRef.current = true;

    const today = getLocalDateString();

    void ensureDailyLogForDate({
      date: today,
    });
  }, [isLoaded, isSignedIn, hasCompletedOnboarding, ensureDailyLogForDate]);

  if (!isLoaded || hasCompletedOnboarding === undefined) {
    return null;
  }

  if (!isSignedIn) {
    console.log("DASHBOARD-layout.tsx: user not signed in sending to /SignUp");
    return <Redirect href="/SignUp" />;
  }

  if (!hasCompletedOnboarding) {
    console.log(
      "DASHBOARD-layout.tsx: user has not completed onboarding sending to /onboarding",
    );
    return <Redirect href="/onboarding" />;
  }

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      tintColor={colors.primary}
      iconColor={{
        default: colors.muted,
        selected: colors.primary,
      }}
      labelStyle={{
        default: {
          color: colors.muted,
          fontSize: 11,
          fontWeight: "600",
        },
        selected: {
          color: colors.primary,
          fontSize: 11,
          fontWeight: "700",
        },
      }}
      shadowColor={colors.border}
      indicatorColor={colors.primary}
      rippleColor={colors.primarySoft}
      disableTransparentOnScrollEdge
      blurEffect={
        themeName === "dark" ? "systemMaterialDark" : "systemMaterialLight"
      }
    >
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="progress">
        <Label>Progress</Label>
        <Icon sf="progress.indicator" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gear" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add" role="search">
        <Label>Add</Label>
        <Icon sf="plus" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
