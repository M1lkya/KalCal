import { api } from "@/convex/_generated/api";
import { caloireAdjustment } from "@/functions/calculateAdjustment";
import ConvertToMacros from "@/functions/caloriesToMacro";
import { useUser } from "@clerk/expo";
import { useMutation, useQuery } from "convex/react";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { BmiKgCm, Bmr, tdee } from "../../functions/calculations";
import ActivityPage from "./activity";
import WeightPerWeekPage from "./fast";
import GenderPage from "./gender";
import GoalPage from "./goal";
import GoalWeightPage from "./goalWeight";
import MetricsPage from "./metrics";
import UnitsPage from "./units";

type Gender = "male" | "female" | "unspecified";

type PreferredUnits = "imperial" | "metric";

type ActivityLevel = "sedentary" | "light" | "moderate" | "athlete";

type GoalType = "maintain" | "lose" | "gain";

type OnboardingForm = {
  age: number | null;

  heightCm: number | null;

  currentWeightKg: number | null;
  goalWeightKg: number | null;

  goalRateKgPerWeek: number | null;

  currentBmi: number | null;

  currentBmrKcalPerDay: number | null;
  currentTdeeKcalPerDay: number | null;

  dailyCalorieAdjustmentKcal: number | null;

  activityMultiplier: number | null;

  caloriesKcal: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
  fiberGrams: number | null;
  sodiumMg: number | null;
  sugarGrams: number | null;

  gender: Gender | null;

  preferredUnits: PreferredUnits | null;

  activityLevel: ActivityLevel | null;

  goalType: GoalType | null;

  createdAt: number | null;
  updatedAt: number | null;
};

export default function Onboarding() {
  const { isSignedIn, user, isLoaded } = useUser();
  const createUser = useMutation(api.functions.user.createUser);
  const [step, setStep] = useState(0);

  const hasCompletedOnboarding = useQuery(
    api.functions.user.hasUserCompletedOnboarding,
  );

  const next = () => setStep((s) => Math.min(s + 1, 6));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const [form, setForm] = React.useState<OnboardingForm>({
    // added as age
    age: null,

    //added
    heightCm: null,

    //added
    currentWeightKg: null,

    //added
    goalWeightKg: null,

    //added
    goalRateKgPerWeek: null,

    //calculated in submit form
    currentBmi: null,

    // calculated in submit form and set
    currentBmrKcalPerDay: null,
    // calculated in the submit form and set
    currentTdeeKcalPerDay: null,

    // example is like if your losing this would be like -500 calorie deficit or gaining + 500 calorie deficit
    //calculated and set in the submit form
    dailyCalorieAdjustmentKcal: null,

    //added
    activityMultiplier: null,

    // added and set in the submit forrm
    caloriesKcal: null,
    proteinGrams: null,
    carbsGrams: null,
    fatGrams: null,
    fiberGrams: null,
    sodiumMg: null,
    sugarGrams: null,

    //added
    gender: null,

    //added
    preferredUnits: null,

    //added
    activityLevel: null,

    //added
    goalType: null,

    createdAt: null,
    updatedAt: null,
  });

  // onSubmit
  const onSubmit = async () => {
    if (
      form.currentWeightKg === null ||
      form.heightCm === null ||
      form.age === null ||
      form.gender === null ||
      form.activityMultiplier === null ||
      form.goalType === null ||
      form.goalRateKgPerWeek === null
    ) {
      console.log("Missing required fields:", form);
      return;
    }

    const bmi = BmiKgCm(form.currentWeightKg, form.heightCm);

    const bmr = Bmr(form.heightCm, form.gender, form.currentWeightKg, form.age);

    const TDEE = tdee(bmr, form.activityMultiplier);

    const adjustment = caloireAdjustment(
      TDEE,
      form.goalType,
      form.goalRateKgPerWeek,
    );

    const macros = ConvertToMacros(adjustment.targetCalories);

    const updatedForm: OnboardingForm = {
      ...form,

      currentBmi: bmi,
      currentBmrKcalPerDay: bmr,
      currentTdeeKcalPerDay: TDEE,
      dailyCalorieAdjustmentKcal: adjustment.calorieChange,

      caloriesKcal: adjustment.targetCalories,
      proteinGrams: macros.proteinGrams,
      carbsGrams: macros.carbsGrams,
      fatGrams: macros.fatGrams,
      fiberGrams: macros.fiberGrams,
      sodiumMg: macros.sodiumMg,
      sugarGrams: macros.sugarGrams,

      updatedAt: Date.now(),
    };

    setForm(updatedForm);

    console.log("Updated onboarding form:", updatedForm);

    try {
      const account = await createUser({
        age: String(updatedForm.age),

        heightCm: form.heightCm,

        currentWeightKg: form.currentWeightKg,
        goalWeightKg: updatedForm.goalWeightKg ?? undefined,

        goalRateKgPerWeek: updatedForm.goalRateKgPerWeek ?? undefined,

        currentBmi: updatedForm.currentBmi ?? undefined,

        currentBmrKcalPerDay: updatedForm.currentBmrKcalPerDay ?? undefined,
        currentTdeeKcalPerDay: updatedForm.currentTdeeKcalPerDay ?? undefined,

        dailyCalorieAdjustmentKcal:
          updatedForm.dailyCalorieAdjustmentKcal ?? undefined,

        activityMultiplier: updatedForm.activityMultiplier ?? undefined,

        nutritionTargets: {
          caloriesKcal: updatedForm.caloriesKcal!,
          proteinGrams: updatedForm.proteinGrams!,
          carbsGrams: updatedForm.carbsGrams!,
          fatGrams: updatedForm.fatGrams!,
          fiberGrams: updatedForm.fiberGrams ?? undefined,
          sodiumMg: updatedForm.sodiumMg ?? undefined,
          sugarGrams: updatedForm.sugarGrams ?? undefined,
        },

        gender: form.gender,

        preferredUnits: updatedForm.preferredUnits!,

        activityLevel: updatedForm.activityLevel!,

        goalType: form.goalType,
      });
      router.replace("/home");
    } catch (error) {}
  };

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
          onNext={({ age, heightCm, currentWeightKg }) => {
            setForm((prev) => ({
              ...prev,
              age,
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
      {step === 4 && (
        <GoalWeightPage
          goalType={form.goalType}
          goalWeightKg={form.goalWeightKg}
          currentWeightKg={form.currentWeightKg}
          unitPreference={form.preferredUnits}
          onChange={(goalWeightKg) =>
            setForm((prev) => ({
              ...prev,
              goalWeightKg,
              updatedAt: Date.now(),
            }))
          }
          onNext={next}
        />
      )}
      {step === 5 && (
        <ActivityPage
          activityLevel={form.activityLevel}
          activityMultiplier={form.activityMultiplier}
          onChangeActivityLevel={(activityLevel) =>
            setForm((prev) => ({
              ...prev,
              activityLevel,
              updatedAt: Date.now(),
            }))
          }
          onChangeActivityMultiplier={(activityMultiplier) =>
            setForm((prev) => ({
              ...prev,
              activityMultiplier,
              updatedAt: Date.now(),
            }))
          }
          onNext={next}
        />
      )}
      {step === 6 && (
        <WeightPerWeekPage
          goalRateKgPerWeek={form.goalRateKgPerWeek}
          preferredUnits={form.preferredUnits}
          onChange={(goalRateKgPerWeek) =>
            setForm((prev) => ({
              ...prev,
              goalRateKgPerWeek,
              updatedAt: Date.now(),
            }))
          }
          onSubmit={onSubmit}
        />
      )}
    </View>
  );
}
