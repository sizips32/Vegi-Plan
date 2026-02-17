export const StorageKeys = {
  USER_SETTINGS: "vegiplan-settings",
  MEAL_LOGS: "vegiplan-meal-logs",
  WEEKLY_PLAN: "vegiplan-weekly-plan",
  FAVORITE_RECIPES: "vegiplan-favorites",
  LOCALE: "vegiplan-locale",
  THEME: "vegiplan-theme",
} as const;

export function getStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full or unavailable
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
