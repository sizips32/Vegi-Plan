"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { getStorageItem, setStorageItem } from "@/lib/storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [isLoaded, setIsLoaded] = useState(false);

  const storedValue = useSyncExternalStore(
    subscribe,
    () => {
      if (!isLoaded) setIsLoaded(true);
      return JSON.stringify(getStorageItem<T>(key, initialValue));
    },
    () => JSON.stringify(initialValue),
  );

  const parsed = JSON.parse(storedValue) as T;

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      const current = getStorageItem<T>(key, initialValue);
      const nextValue = value instanceof Function ? value(current) : value;
      setStorageItem(key, nextValue);
      window.dispatchEvent(new StorageEvent("storage"));
    },
    [key, initialValue],
  );

  return [parsed, setValue, isLoaded] as const;
}
