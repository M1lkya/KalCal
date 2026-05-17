import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();
  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/SignUp");
      return;
    }

    if (hasCompletedOnboarding === undefined) router.replace("/onboarding");
  }, [isLoaded, isSignedIn, user, hasCompletedOnboarding]);

  return (
    <SafeAreaView className="items-center">
      <Text>Hi this is the dashboard</Text>
      <Button className="bg-black">
        <Text className="text-white">Click me!!</Text>
      </Button>
    </SafeAreaView>
  );
}
