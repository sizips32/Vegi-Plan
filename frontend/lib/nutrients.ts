import type { NutritionFacts, NutrientKey, NutrientTarget } from "./types";
import { EMPTY_NUTRITION } from "./constants";

export function sumNutrition(items: NutritionFacts[]): NutritionFacts {
  return items.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
      fiber: acc.fiber + item.fiber,
      vitaminB12: acc.vitaminB12 + item.vitaminB12,
      iron: acc.iron + item.iron,
      calcium: acc.calcium + item.calcium,
      omega3: acc.omega3 + item.omega3,
      zinc: acc.zinc + item.zinc,
    }),
    { ...EMPTY_NUTRITION },
  );
}

export function scaleNutrition(
  nutrition: NutritionFacts,
  servings: number,
): NutritionFacts {
  return {
    calories: Math.round(nutrition.calories * servings),
    protein: Math.round(nutrition.protein * servings * 10) / 10,
    carbs: Math.round(nutrition.carbs * servings * 10) / 10,
    fat: Math.round(nutrition.fat * servings * 10) / 10,
    fiber: Math.round(nutrition.fiber * servings * 10) / 10,
    vitaminB12: Math.round(nutrition.vitaminB12 * servings * 10) / 10,
    iron: Math.round(nutrition.iron * servings * 10) / 10,
    calcium: Math.round(nutrition.calcium * servings),
    omega3: Math.round(nutrition.omega3 * servings * 10) / 10,
    zinc: Math.round(nutrition.zinc * servings * 10) / 10,
  };
}

export function getNutrientPercentage(
  current: number,
  target: NutrientTarget,
): number {
  if (target.min === 0) return 100;
  return Math.min(Math.round((current / target.min) * 100), 150);
}

export type NutrientStatus = "low" | "good" | "high";

export function getNutrientStatus(
  current: number,
  target: NutrientTarget,
): NutrientStatus {
  if (current < target.min * 0.8) return "low";
  if (current > target.max) return "high";
  return "good";
}

export function getNutrientValue(
  nutrition: NutritionFacts,
  key: NutrientKey,
): number {
  return nutrition[key];
}

export function getStatusColor(status: NutrientStatus): string {
  switch (status) {
    case "low":
      return "text-red-500";
    case "good":
      return "text-emerald-500";
    case "high":
      return "text-amber-500";
  }
}

export function getStatusBgColor(status: NutrientStatus): string {
  switch (status) {
    case "low":
      return "bg-red-500";
    case "good":
      return "bg-emerald-500";
    case "high":
      return "bg-amber-500";
  }
}
