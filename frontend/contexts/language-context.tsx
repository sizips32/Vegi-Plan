"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/types";
import type { Dictionary } from "@/i18n/types";
import en from "@/i18n/en";
import ko from "@/i18n/ko";

const STORAGE_KEY = "vegiplan-locale";

const dictionaries: Record<Locale, Dictionary> = { en, ko };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with "en" for SSR/hydration consistency
  const [locale, setLocaleState] = useState<Locale>("en");

  // Sync from localStorage after mount
  /* eslint-disable react-hooks/set-state-in-effect -- mount-time localStorage sync */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ko") {
        setLocaleState(stored);
      }
    } catch {
      // localStorage unavailable
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage may be unavailable
    }
  }, []);

  const t = dictionaries[locale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider",
    );
  }
  return ctx;
}
