import type {
  UserSettings,
  NutrientTarget,
  DayOfWeek,
  MealType,
  WeeklyPlan,
  WeeklyPlanSlot,
  NutritionFacts,
} from "./types";
import { DAYS_OF_WEEK, MEAL_TYPES } from "./types";

export const DEFAULT_NUTRIENT_TARGETS: NutrientTarget[] = [
  { key: "calories", min: 1800, max: 2500, unit: "kcal" },
  { key: "protein", min: 50, max: 120, unit: "g" },
  { key: "carbs", min: 200, max: 350, unit: "g" },
  { key: "fat", min: 44, max: 78, unit: "g" },
  { key: "fiber", min: 25, max: 40, unit: "g" },
  { key: "vitaminB12", min: 2.4, max: 10, unit: "mcg" },
  { key: "iron", min: 8, max: 45, unit: "mg" },
  { key: "calcium", min: 1000, max: 2500, unit: "mg" },
  { key: "omega3", min: 1.1, max: 3, unit: "g" },
  { key: "zinc", min: 8, max: 40, unit: "mg" },
];

export const DEFAULT_USER_SETTINGS: UserSettings = {
  name: "User",
  vegetarianType: "lacto-ovo",
  goal: "maintain",
  dailyCalorieTarget: 2000,
  nutrientTargets: DEFAULT_NUTRIENT_TARGETS,
};

export const EMPTY_NUTRITION: NutritionFacts = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
  fiber: 0,
  vitaminB12: 0,
  iron: 0,
  calcium: 0,
  omega3: 0,
  zinc: 0,
};

function createEmptyWeeklyPlan(): WeeklyPlan {
  const emptySlot: WeeklyPlanSlot = { recipeId: null };
  const slots = {} as Record<DayOfWeek, Record<MealType, WeeklyPlanSlot>>;

  for (const day of DAYS_OF_WEEK) {
    slots[day] = {} as Record<MealType, WeeklyPlanSlot>;
    for (const meal of MEAL_TYPES) {
      slots[day][meal] = { ...emptySlot };
    }
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));

  return {
    weekStart: monday.toISOString().split("T")[0],
    slots,
  };
}

export const EMPTY_WEEKLY_PLAN = createEmptyWeeklyPlan();

export const NUTRIENT_COLORS: Record<string, string> = {
  calories: "#f59e0b",
  protein: "#10b981",
  carbs: "#3b82f6",
  fat: "#f472b6",
  fiber: "#8b5cf6",
  vitaminB12: "#ef4444",
  iron: "#dc2626",
  calcium: "#f8fafc",
  omega3: "#06b6d4",
  zinc: "#6366f1",
};

export const VEGETARIAN_TYPE_EMOJI: Record<string, string> = {
  vegan: "🌱",
  lacto: "🥛",
  ovo: "🥚",
  "lacto-ovo": "🧀",
  pescatarian: "🐟",
  flexitarian: "🥗",
};
