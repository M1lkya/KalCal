import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { Redirect, Stack } from "expo-router";

export default function OnboardingLayout() {
  const { isLoaded, isSignedIn } = useUser();

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  if (!isLoaded || hasCompletedOnboarding === undefined) {
    return null;
  }

  if (!isSignedIn) {
    console.log("ONBOARDING-layout.tsx: user not signed in sending to /SignUp");
    return <Redirect href="/SignUp" />;
  }

  if (hasCompletedOnboarding) {
    console.log(
      "ONBOARDING-layout.tsx: user has Compleated OnBoarding sending to /home",
    );
    return <Redirect href="/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
