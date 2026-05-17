const ConvertToMacros = (caloriesKcal: number) => {
  const proteinCalories = caloriesKcal * 0.3;
  const fatCalories = caloriesKcal * 0.25;
  const carbsCalories = caloriesKcal * 0.45;

  const proteinGrams = proteinCalories / 4;
  const fatGrams = fatCalories / 9;
  const carbsGrams = carbsCalories / 4;

  const fiberGrams = (caloriesKcal * 14) / 1000;
  const sugarGrams = (caloriesKcal * 0.1) / 4;

  const sodiumMg = 2300;

  return {
    proteinGrams: Math.round(proteinGrams),
    fatGrams: Math.round(fatGrams),
    carbsGrams: Math.round(carbsGrams),
    fiberGrams: Math.round(fiberGrams),
    sugarGrams: Math.round(sugarGrams),
    sodiumMg,
  };
};

export default ConvertToMacros;
