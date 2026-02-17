"use client";

import { useAppContext } from "@/contexts/app-context";

export function useAppState() {
  return useAppContext();
}
