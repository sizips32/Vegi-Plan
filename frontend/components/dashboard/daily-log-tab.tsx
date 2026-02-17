"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Utensils,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { NutrientBar } from "@/components/shared/nutrient-bar";
import { RECIPES } from "@/lib/recipes-data";
import { DEFAULT_NUTRIENT_TARGETS } from "@/lib/constants";
import { sumNutrition } from "@/lib/nutrients";
import type { MealType, MealLog, Recipe, NutrientKey } from "@/lib/types";
import { MEAL_TYPES } from "@/lib/types";

function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(dateString: string, locale: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const MEAL_EMOJIS: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌆",
  snack: "🍪",
};

export function DailyLogTab() {
  const { t, locale } = useLanguage();
  const { isLoaded, getMealLogsForDate, addMealLog, removeMealLog, settings } =
    useAppState();

  const [selectedDate, setSelectedDate] = useState(getTodayString);
  const [addMealDialogOpen, setAddMealDialogOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");

  const mealLogsForDate = useMemo(
    () => getMealLogsForDate(selectedDate),
    [getMealLogsForDate, selectedDate],
  );

  const goToPrevDay = useCallback(() => {
    setSelectedDate((prev) => addDays(prev, -1));
  }, []);

  const goToNextDay = useCallback(() => {
    setSelectedDate((prev) => addDays(prev, 1));
  }, []);

  const goToToday = useCallback(() => {
    setSelectedDate(getTodayString());
  }, []);

  const getMealLogsForType = useCallback(
    (mealType: MealType): MealLog[] => {
      return mealLogsForDate.filter((log) => log.mealType === mealType);
    },
    [mealLogsForDate],
  );

  const dailyNutrition = useMemo(() => {
    return sumNutrition(mealLogsForDate.map((log) => log.nutrition));
  }, [mealLogsForDate]);

  const handleOpenAddDialog = useCallback((mealType: MealType) => {
    setActiveMealType(mealType);
    setAddMealDialogOpen(true);
  }, []);

  const handleSelectRecipe = useCallback(
    (recipe: Recipe) => {
      addMealLog({
        date: selectedDate,
        mealType: activeMealType,
        recipeId: recipe.id,
        servings: 1,
        nutrition: recipe.nutrition,
      });
      setAddMealDialogOpen(false);
    },
    [addMealLog, selectedDate, activeMealType],
  );

  const handleRemoveMeal = useCallback(
    (logId: string) => {
      removeMealLog(logId);
    },
    [removeMealLog],
  );

  const isToday = selectedDate === getTodayString();

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: t.dailyLog.breakfast,
    lunch: t.dailyLog.lunch,
    dinner: t.dailyLog.dinner,
    snack: t.dailyLog.snack,
  };

  const filteredRecipes = useMemo(() => {
    return RECIPES.filter((recipe) => recipe.mealType.includes(activeMealType));
  }, [activeMealType]);

  const getRecipeName = useCallback(
    (recipeId: string): string => {
      const recipe = RECIPES.find((r) => r.id === recipeId);
      if (!recipe) return "Unknown";
      return locale === "ko" ? recipe.name.ko : recipe.name.en;
    },
    [locale],
  );

  const getRecipeEmoji = useCallback((recipeId: string): string => {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    return recipe?.emoji ?? "🍽️";
  }, []);

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Date Navigation */}
      <Card>
        <CardContent className="flex items-center justify-between py-1">
          <Button variant="ghost" size="icon" onClick={goToPrevDay}>
            <ChevronLeft className="size-5" />
          </Button>
          <button
            type="button"
            onClick={goToToday}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-sm font-semibold text-foreground">
              {formatDateDisplay(selectedDate, locale)}
            </span>
            {isToday && (
              <Badge variant="secondary" className="text-xs">
                {t.dailyLog.today}
              </Badge>
            )}
          </button>
          <Button variant="ghost" size="icon" onClick={goToNextDay}>
            <ChevronRight className="size-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Meal Sections */}
      {MEAL_TYPES.map((mealType) => {
        const logs = getMealLogsForType(mealType);

        return (
          <motion.div
            key={mealType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <span className="text-lg">{MEAL_EMOJIS[mealType]}</span>
                    {mealTypeLabels[mealType]}
                    {logs.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {logs.length}
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenAddDialog(mealType)}
                    className="gap-1 text-primary"
                  >
                    <Plus className="size-4" />
                    {t.dailyLog.addMeal}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="popLayout">
                  {logs.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-2 py-6 text-center"
                    >
                      <UtensilsCrossed className="size-8 text-muted-foreground/40" />
                      <p className="text-sm text-muted-foreground">
                        {t.dailyLog.noMeals}
                      </p>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <motion.div
                          key={log.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">
                              {getRecipeEmoji(log.recipeId)}
                            </span>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {getRecipeName(log.recipeId)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {log.nutrition.calories} kcal
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleRemoveMeal(log.id)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Daily Nutrition Summary */}
      {mealLogsForDate.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Utensils className="size-4" />
                {t.dailyLog.dailySummary}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["calories", "protein", "carbs", "fat"] as NutrientKey[]).map(
                (key) => {
                  const target = settings.nutrientTargets.find(
                    (nt) => nt.key === key,
                  ) ??
                    DEFAULT_NUTRIENT_TARGETS.find((nt) => nt.key === key) ?? {
                      key,
                      min: 0,
                      max: 0,
                      unit: "",
                    };
                  return (
                    <NutrientBar
                      key={key}
                      label={t.nutrients[key]}
                      current={dailyNutrition[key]}
                      target={target.min}
                      unit={target.unit}
                    />
                  );
                },
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Add Meal Dialog */}
      <Dialog open={addMealDialogOpen} onOpenChange={setAddMealDialogOpen}>
        <DialogContent className="max-h-[80vh] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{MEAL_EMOJIS[activeMealType]}</span>
              {t.dailyLog.addMeal} - {mealTypeLabels[activeMealType]}
            </DialogTitle>
            <DialogDescription>
              {t.scanner.description
                ? `${filteredRecipes.length} recipes available`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-2 pr-4">
              {filteredRecipes.map((recipe) => (
                <button
                  type="button"
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:bg-accent"
                >
                  <span className="text-2xl">{recipe.emoji}</span>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-foreground">
                      {locale === "ko" ? recipe.name.ko : recipe.name.en}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {recipe.prepTime}
                        {t.recipes.minuteShort}
                      </span>
                      <span>{recipe.nutrition.calories} kcal</span>
                      <span>
                        {recipe.nutrition.protein}g {t.nutrients.protein}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
