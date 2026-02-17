export type VegetarianType =
  | "vegan"
  | "lacto"
  | "ovo"
  | "lacto-ovo"
  | "pescatarian"
  | "flexitarian";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export const DAYS_OF_WEEK: DayOfWeek[] = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
];

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export type NutrientKey =
  | "calories"
  | "protein"
  | "carbs"
  | "fat"
  | "fiber"
  | "vitaminB12"
  | "iron"
  | "calcium"
  | "omega3"
  | "zinc";

export interface NutrientTarget {
  key: NutrientKey;
  min: number;
  max: number;
  unit: string;
}

export interface NutritionFacts {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  vitaminB12: number;
  iron: number;
  calcium: number;
  omega3: number;
  zinc: number;
}

export interface UserSettings {
  name: string;
  vegetarianType: VegetarianType;
  goal: "maintain" | "muscle-gain" | "weight-loss";
  dailyCalorieTarget: number;
  nutrientTargets: NutrientTarget[];
}

export interface Recipe {
  id: string;
  emoji: string;
  name: { en: string; ko: string };
  description: { en: string; ko: string };
  mealType: MealType[];
  vegetarianType: VegetarianType[];
  prepTime: number;
  servings: number;
  nutrition: NutritionFacts;
  ingredients: { en: string[]; ko: string[] };
  tags: string[];
}

export interface MealLog {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  mealType: MealType;
  recipeId: string;
  servings: number;
  nutrition: NutritionFacts;
  timestamp: number;
}

export interface WeeklyPlanSlot {
  recipeId: string | null;
}

export interface WeeklyPlan {
  weekStart: string; // ISO date YYYY-MM-DD (Monday)
  slots: Record<DayOfWeek, Record<MealType, WeeklyPlanSlot>>;
}

export interface AppState {
  settings: UserSettings;
  mealLogs: MealLog[];
  weeklyPlan: WeeklyPlan;
  favoriteRecipeIds: string[];
}

export type Locale = "en" | "ko";
