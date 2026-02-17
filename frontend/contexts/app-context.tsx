"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  UserSettings,
  MealLog,
  WeeklyPlan,
  DayOfWeek,
  MealType,
} from "@/lib/types";
import { DEFAULT_USER_SETTINGS, EMPTY_WEEKLY_PLAN } from "@/lib/constants";
import {
  StorageKeys,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
} from "@/lib/storage";

interface AppContextValue {
  settings: UserSettings;
  mealLogs: MealLog[];
  weeklyPlan: WeeklyPlan;
  favoriteRecipeIds: string[];
  isLoaded: boolean;

  updateSettings: (settings: Partial<UserSettings>) => void;
  addMealLog: (log: Omit<MealLog, "id" | "timestamp">) => void;
  removeMealLog: (id: string) => void;
  getMealLogsForDate: (date: string) => MealLog[];
  updateWeeklyPlan: (
    day: DayOfWeek,
    meal: MealType,
    recipeId: string | null,
  ) => void;
  toggleFavorite: (recipeId: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() =>
    getStorageItem<UserSettings>(
      StorageKeys.USER_SETTINGS,
      DEFAULT_USER_SETTINGS,
    ),
  );
  const [mealLogs, setMealLogs] = useState<MealLog[]>(() =>
    getStorageItem<MealLog[]>(StorageKeys.MEAL_LOGS, []),
  );
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(() =>
    getStorageItem<WeeklyPlan>(StorageKeys.WEEKLY_PLAN, EMPTY_WEEKLY_PLAN),
  );
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>(() =>
    getStorageItem<string[]>(StorageKeys.FAVORITE_RECIPES, []),
  );
  const [isLoaded] = useState(true);

  // Track whether initial load is complete to avoid persisting defaults on SSR
  const hasLoadedRef = useRef(typeof window !== "undefined");

  // Persist settings to localStorage
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      return;
    }
    setStorageItem(StorageKeys.USER_SETTINGS, settings);
  }, [settings]);

  // Persist mealLogs to localStorage
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    setStorageItem(StorageKeys.MEAL_LOGS, mealLogs);
  }, [mealLogs]);

  // Persist weeklyPlan to localStorage
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    setStorageItem(StorageKeys.WEEKLY_PLAN, weeklyPlan);
  }, [weeklyPlan]);

  // Persist favoriteRecipeIds to localStorage
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    setStorageItem(StorageKeys.FAVORITE_RECIPES, favoriteRecipeIds);
  }, [favoriteRecipeIds]);

  const updateSettings = useCallback((partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const addMealLog = useCallback((log: Omit<MealLog, "id" | "timestamp">) => {
    const newLog: MealLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setMealLogs((prev) => [...prev, newLog]);
  }, []);

  const removeMealLog = useCallback((id: string) => {
    setMealLogs((prev) => prev.filter((log) => log.id !== id));
  }, []);

  const getMealLogsForDate = useCallback(
    (date: string): MealLog[] => {
      return mealLogs.filter((log) => log.date === date);
    },
    [mealLogs],
  );

  const updateWeeklyPlan = useCallback(
    (day: DayOfWeek, meal: MealType, recipeId: string | null) => {
      setWeeklyPlan((prev) => ({
        ...prev,
        slots: {
          ...prev.slots,
          [day]: {
            ...prev.slots[day],
            [meal]: { recipeId },
          },
        },
      }));
    },
    [],
  );

  const toggleFavorite = useCallback((recipeId: string) => {
    setFavoriteRecipeIds((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  }, []);

  const resetAllData = useCallback(() => {
    removeStorageItem(StorageKeys.USER_SETTINGS);
    removeStorageItem(StorageKeys.MEAL_LOGS);
    removeStorageItem(StorageKeys.WEEKLY_PLAN);
    removeStorageItem(StorageKeys.FAVORITE_RECIPES);

    setSettings(DEFAULT_USER_SETTINGS);
    setMealLogs([]);
    setWeeklyPlan(EMPTY_WEEKLY_PLAN);
    setFavoriteRecipeIds([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        settings,
        mealLogs,
        weeklyPlan,
        favoriteRecipeIds,
        isLoaded,
        updateSettings,
        addMealLog,
        removeMealLog,
        getMealLogsForDate,
        updateWeeklyPlan,
        toggleFavorite,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
