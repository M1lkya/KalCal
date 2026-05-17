export const BmiKgCm = (weightKg: number, heightCm: number): number => {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error("Weight and height must be positive numbers.");
  }

  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

type Gender = "male" | "female" | "unspecified";

export const Bmr = (
  heightCm: number,
  gender: Gender,
  weightKg: number,
  age: number,
): number => {
  const genderOption = gender === "male" ? 5 : -161;

  return 10 * weightKg + 6.25 * heightCm - 5 * age + genderOption;
};

export const tdee = (bmr: number, activityMultiplier: number): number => {
  return Math.round(bmr * activityMultiplier);
};
