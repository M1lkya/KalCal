type goalType = "lose" | "maintain" | "gain";

const KCAL_PER_KG = 7700;

export const caloireAdjustment = (
  tdee: number,
  goalType: goalType,
  kgPerWeek: number,
): { calorieChange: number; targetCalories: number } => {
  if (goalType === "maintain") {
    return {
      calorieChange: 0,
      targetCalories: tdee,
    };
  }
  const calorieChange = Math.round((kgPerWeek * KCAL_PER_KG) / 7);

  const targetCalories =
    goalType === "lose" ? tdee - calorieChange : tdee + calorieChange;

  return {
    calorieChange,
    targetCalories: Math.round(targetCalories),
  };
};
