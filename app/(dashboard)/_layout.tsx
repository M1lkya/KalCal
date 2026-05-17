import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { Redirect } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";

export default function Layout() {
  const { isLoaded, isSignedIn } = useUser();

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  if (!isLoaded || hasCompletedOnboarding === undefined) {
    return null;
  }

  if (!isSignedIn) {
    console.log("DASHBOARD-layout.tsx: user not signed in sending to /SignUp");
    return <Redirect href="/SignUp" />;
  }

  if (!hasCompletedOnboarding) {
    console.log(
      "DASHBOARD-layout.tsx: user has not Compleated OnBoarding sending to /onboarding",
    );
    return <Redirect href="/onboarding" />;
  }
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="progress">
        <label>Progress</label>
        <Icon sf="progress.indicator" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Label>Settings</Label>
        <Icon sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
