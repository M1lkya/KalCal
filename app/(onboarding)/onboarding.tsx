import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/expo";
import { useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import GenderPage from "./gender";
import GoalPage from "./goal";
import MetricsPage from "./metrics";
import UnitsPage from "./units";

type Gender = "male" | "female" | "unspecified";

type PreferredUnits = "imperial" | "metric";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "athlete";

type GoalType = "maintain" | "lose" | "gain";

type NutritionTargetsForm = {
  caloriesKcal: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
  fiberGrams: number | null;
  sodiumMg: number | null;
  sugarGrams: number | null;
};

type OnboardingForm = {
  convexUserId: string | null;

  birthDate: string | null;

  heightCm: number | null;

  currentWeightKg: number | null;
  goalWeightKg: number | null;

  goalRateKgPerWeek: number | null;

  currentBmi: number | null;

  currentBmrKcalPerDay: number | null;
  currentTdeeKcalPerDay: number | null;

  dailyCalorieAdjustmentKcal: number | null;

  activityMultiplier: number | null;

  nutritionTargets: NutritionTargetsForm;

  gender: Gender | null;

  preferredUnits: PreferredUnits | null;

  activityLevel: ActivityLevel | null;

  goalType: GoalType | null;

  createdAt: number | null;
  updatedAt: number | null;
};

export default function Onboarding() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [step, setStep] = useState(0);

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const [form, setForm] = React.useState<OnboardingForm>({
    convexUserId: null,

    // added as age
    birthDate: null,

    //added
    heightCm: null,

    //added
    currentWeightKg: null,

    goalWeightKg: null,

    goalRateKgPerWeek: null,

    currentBmi: null,

    currentBmrKcalPerDay: null,
    currentTdeeKcalPerDay: null,

    dailyCalorieAdjustmentKcal: null,

    activityMultiplier: null,

    nutritionTargets: {
      caloriesKcal: null,
      proteinGrams: null,
      carbsGrams: null,
      fatGrams: null,
      fiberGrams: null,
      sodiumMg: null,
      sugarGrams: null,
    },

    //added
    gender: null,

    //done
    preferredUnits: null,

    activityLevel: null,

    //done
    goalType: null,

    createdAt: null,
    updatedAt: null,
  });

  React.useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn || !user) {
      router.replace("/SignUp");
      return;
    }

    if (hasCompletedOnboarding === undefined) return;

    if (hasCompletedOnboarding) {
      router.replace("/home");
      return;
    }

    setForm((prev) => ({
      ...prev,
      convexUserId: user.id,
      updatedAt: Date.now(),
    }));
  }, [isLoaded, isSignedIn, user, hasCompletedOnboarding]);

  return (
    <View style={{ flex: 1 }}>
      {step === 0 && (
        <GoalPage
          goal={form.goalType}
          onChange={(goalType) =>
            setForm((prev) => ({
              ...prev,
              goalType,
              updatedAt: Date.now(),
            }))
          }
          onNext={next}
        />
      )}

      {step === 1 && (
        <UnitsPage
          preferredUnits={form.preferredUnits}
          onChange={(preferredUnits) =>
            setForm((prev) => ({
              ...prev,
              preferredUnits,
              updatedAt: Date.now(),
            }))
          }
          onNext={next}
        />
      )}

      {step === 2 && (
        <MetricsPage
          preferredUnits={form.preferredUnits}
          onNext={({ birthDate, heightCm, currentWeightKg }) => {
            setForm((prev) => ({
              ...prev,
              birthDate,
              heightCm,
              currentWeightKg,
              updatedAt: Date.now(),
            }));

            next();
          }}
        />
      )}

      {step === 3 && (
        <GenderPage
          gender={form.gender}
          onChange={(gender) =>
            setForm((prev) => ({
              ...prev,
              gender,
              updatedAt: Date.now(),
            }))
          }
          onNext={next}
        />
      )}
      {step === 4 && <Text>Step 5</Text>}
      {step === 5 && <Text>Step 6</Text>}
      {step === 6 && <Text>Step 7</Text>}
    </View>
  );
}
