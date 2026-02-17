"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  // Always start with server-safe defaults for hydration consistency
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>(EMPTY_WEEKLY_PLAN);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync from localStorage after mount (avoids hydration mismatch)
  /* eslint-disable react-hooks/set-state-in-effect -- legitimate mount-time initialization from localStorage */
  useEffect(() => {
    setSettings(
      getStorageItem<UserSettings>(
        StorageKeys.USER_SETTINGS,
        DEFAULT_USER_SETTINGS,
      ),
    );
    setMealLogs(getStorageItem<MealLog[]>(StorageKeys.MEAL_LOGS, []));
    setWeeklyPlan(
      getStorageItem<WeeklyPlan>(StorageKeys.WEEKLY_PLAN, EMPTY_WEEKLY_PLAN),
    );
    setFavoriteRecipeIds(
      getStorageItem<string[]>(StorageKeys.FAVORITE_RECIPES, []),
    );
    setIsLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist to localStorage only after initial load from localStorage is complete
  useEffect(() => {
    if (!isLoaded) return;
    setStorageItem(StorageKeys.USER_SETTINGS, settings);
  }, [settings, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStorageItem(StorageKeys.MEAL_LOGS, mealLogs);
  }, [mealLogs, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStorageItem(StorageKeys.WEEKLY_PLAN, weeklyPlan);
  }, [weeklyPlan, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setStorageItem(StorageKeys.FAVORITE_RECIPES, favoriteRecipeIds);
  }, [favoriteRecipeIds, isLoaded]);

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
