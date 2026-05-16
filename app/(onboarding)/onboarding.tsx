import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import GoalPage from "./goal";

export default function Onboarding() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [step, setStep] = useState(0);

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const goalType: ("lose" | "maintain" | "gain")[] = [
    "lose",
    "maintain",
    "gain",
  ];

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/SignUp");
      return;
    }

    if (hasCompletedOnboarding == undefined) return;

    if (hasCompletedOnboarding) {
      router.replace("/home");
      return;
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <>
      <SafeAreaView className="h-full">
        <View
          className="bg-red-600 h-full"
          style={{ marginHorizontal: scale(10) }}
        >
          {step === 0 && <GoalPage />}
          {step === 1 && <Text>Step 2</Text>}
          {step === 2 && <Text>Step 3</Text>}
          {step === 3 && <Text>Step 4</Text>}
          {step === 4 && <Text>Step 5</Text>}
          {step === 5 && <Text>Step 6</Text>}
          {step === 6 && <Text>Step 7</Text>}
        </View>
      </SafeAreaView>
    </>
  );
}
