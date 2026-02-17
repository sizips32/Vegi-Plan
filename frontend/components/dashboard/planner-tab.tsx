"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { RECIPES } from "@/lib/recipes-data";
import { sumNutrition, getNutrientValue } from "@/lib/nutrients";
import { NutrientBar } from "@/components/shared/nutrient-bar";
import type { DayOfWeek, MealType, NutrientKey, Recipe } from "@/lib/types";
import { DAYS_OF_WEEK, MEAL_TYPES } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DAY_LABELS: Record<DayOfWeek, { en: string; ko: string }> = {
  mon: { en: "Mon", ko: "월" },
  tue: { en: "Tue", ko: "화" },
  wed: { en: "Wed", ko: "수" },
  thu: { en: "Thu", ko: "목" },
  fri: { en: "Fri", ko: "금" },
  sat: { en: "Sat", ko: "토" },
  sun: { en: "Sun", ko: "일" },
};

const MEAL_LABELS: Record<MealType, { en: string; ko: string }> = {
  breakfast: { en: "Breakfast", ko: "아침" },
  lunch: { en: "Lunch", ko: "점심" },
  dinner: { en: "Dinner", ko: "저녁" },
  snack: { en: "Snack", ko: "간식" },
};

const SUMMARY_NUTRIENTS: NutrientKey[] = [
  "calories",
  "protein",
  "carbs",
  "fat",
  "fiber",
];

function getRecipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}

// ---------------------------------------------------------------------------
// Animation
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

// ---------------------------------------------------------------------------
// Sub-component: Meal Slot
// ---------------------------------------------------------------------------

interface MealSlotProps {
  recipe: Recipe | undefined;
  onAdd: () => void;
  onRemove: () => void;
  mealLabel: string;
}

function MealSlot({ recipe, onAdd, onRemove, mealLabel }: MealSlotProps) {
  if (!recipe) {
    return (
      <button
        onClick={onAdd}
        className="flex h-12 w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
        aria-label={mealLabel}
      >
        <Plus className="size-3.5" />
        <span className="text-xs">{mealLabel}</span>
      </button>
    );
  }

  return (
    <div className="group relative flex h-12 items-center gap-2 rounded-lg bg-muted/50 px-2.5">
      <span className="text-base leading-none">{recipe.emoji}</span>
      <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
        {recipe.name.en}
      </span>
      <button
        onClick={onRemove}
        className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
        aria-label="Remove"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlannerTab() {
  const { t, locale } = useLanguage();
  const { settings, weeklyPlan, isLoaded, updateWeeklyPlan } = useAppState();

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    day: DayOfWeek;
    meal: MealType;
  } | null>(null);

  // Filter recipes for dialog
  const filteredRecipes = useMemo(() => {
    if (!selectedSlot) return [];
    return RECIPES.filter(
      (r) =>
        r.vegetarianType.includes(settings.vegetarianType) &&
        r.mealType.includes(selectedSlot.meal),
    );
  }, [selectedSlot, settings.vegetarianType]);

  // Weekly nutrition summary - sum all planned recipes
  const weeklyNutrition = useMemo(() => {
    const nutritions = DAYS_OF_WEEK.flatMap((day) =>
      MEAL_TYPES.map((meal) => {
        const slot = weeklyPlan.slots[day]?.[meal];
        if (!slot?.recipeId) return null;
        const recipe = getRecipeById(slot.recipeId);
        return recipe?.nutrition ?? null;
      }).filter(Boolean),
    ) as import("@/lib/types").NutritionFacts[];
    return sumNutrition(nutritions);
  }, [weeklyPlan]);

  // Handlers
  const handleOpenDialog = (day: DayOfWeek, meal: MealType) => {
    setSelectedSlot({ day, meal });
    setDialogOpen(true);
  };

  const handleSelectRecipe = (recipeId: string) => {
    if (!selectedSlot) return;
    updateWeeklyPlan(selectedSlot.day, selectedSlot.meal, recipeId);
    setDialogOpen(false);
    setSelectedSlot(null);
  };

  const handleRemoveRecipe = (day: DayOfWeek, meal: MealType) => {
    updateWeeklyPlan(day, meal, null);
  };

  // Loading
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-32 rounded-xl" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold text-foreground">
          {t.planner.weeklyPlan}
        </h2>
        <p className="text-sm text-muted-foreground">{t.planner.description}</p>
      </motion.div>

      {/* 7-day grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7"
      >
        {DAYS_OF_WEEK.map((day) => (
          <Card key={day} className="gap-0 py-3 shadow-sm">
            <CardHeader className="px-3 py-0 pb-2">
              <CardTitle className="text-center text-sm font-semibold">
                {DAY_LABELS[day][locale]}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-3">
              {MEAL_TYPES.map((meal) => {
                const slot = weeklyPlan.slots[day]?.[meal];
                const recipe = slot?.recipeId
                  ? getRecipeById(slot.recipeId)
                  : undefined;
                return (
                  <MealSlot
                    key={meal}
                    recipe={recipe}
                    mealLabel={MEAL_LABELS[meal][locale]}
                    onAdd={() => handleOpenDialog(day, meal)}
                    onRemove={() => handleRemoveRecipe(day, meal)}
                  />
                );
              })}
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Weekly nutrition summary */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">
              {t.planner.nutritionSummary}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SUMMARY_NUTRIENTS.map((key) => {
                const target = settings.nutrientTargets.find(
                  (nt) => nt.key === key,
                );
                if (!target) return null;
                // Weekly target = daily target * 7
                const weeklyTarget = target.min * 7;
                const current = getNutrientValue(weeklyNutrition, key);
                return (
                  <NutrientBar
                    key={key}
                    label={`${t.nutrients[key]} (${locale === "ko" ? "주간" : "weekly"})`}
                    current={Math.round(current)}
                    target={Math.round(weeklyTarget)}
                    unit={target.unit}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recipe selection dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[85vh] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.planner.addMeal}</DialogTitle>
            <DialogDescription>
              {selectedSlot
                ? `${DAY_LABELS[selectedSlot.day][locale]} - ${MEAL_LABELS[selectedSlot.meal][locale]}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[55vh]">
            <div className="space-y-2 pr-3">
              {filteredRecipes.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {t.common.noResults}
                </p>
              ) : (
                filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => handleSelectRecipe(recipe.id)}
                    className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-border hover:bg-muted/50"
                  >
                    <span className="text-2xl leading-none">
                      {recipe.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {recipe.name[locale]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {recipe.nutrition.calories} kcal &middot;{" "}
                        {recipe.nutrition.protein}g{" "}
                        {t.nutrients.protein.toLowerCase()}
                      </p>
                    </div>
                    <Badge variant="outline" className="shrink-0 text-xs">
                      {recipe.prepTime}
                      {t.recipes.minuteShort}
                    </Badge>
                  </button>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
