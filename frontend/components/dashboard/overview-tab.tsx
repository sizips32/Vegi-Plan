"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Flame,
  Drumstick,
  UtensilsCrossed,
  Zap,
  Lightbulb,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { RECIPES } from "@/lib/recipes-data";
import { NUTRIENT_COLORS, DEFAULT_NUTRIENT_TARGETS } from "@/lib/constants";
import { sumNutrition, getNutrientValue } from "@/lib/nutrients";
import type { NutrientKey, NutritionFacts } from "@/lib/types";
import { StatCard } from "@/components/shared/stat-card";
import { NutrientBar } from "@/components/shared/nutrient-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

/** Count consecutive days (up to today) that have at least 1 meal log. */
function calculateStreak(mealLogs: { date: string }[]): number {
  const loggedDates = new Set(mealLogs.map((l) => l.date));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const key = d.toISOString().split("T")[0];
    if (!loggedDates.has(key)) break;
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function findTarget(key: NutrientKey) {
  return DEFAULT_NUTRIENT_TARGETS.find((t) => t.key === key);
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 120, damping: 14 },
  },
};

// ---------------------------------------------------------------------------
// Macro donut chart colours
// ---------------------------------------------------------------------------

const MACRO_COLORS = {
  protein: NUTRIENT_COLORS.protein,
  carbs: NUTRIENT_COLORS.carbs,
  fat: NUTRIENT_COLORS.fat,
};

// ---------------------------------------------------------------------------
// Critical nutrient keys to show
// ---------------------------------------------------------------------------

const CRITICAL_KEYS: NutrientKey[] = [
  "vitaminB12",
  "iron",
  "calcium",
  "omega3",
  "zinc",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OverviewTab() {
  const { t, locale } = useLanguage();
  const { settings, mealLogs, isLoaded, getMealLogsForDate } = useAppState();

  // ----- Derived data ------
  const today = getToday();
  const todayLogs = useMemo(
    () => getMealLogsForDate(today),
    [getMealLogsForDate, today],
  );

  const todayNutrition: NutritionFacts = useMemo(
    () => sumNutrition(todayLogs.map((l) => l.nutrition)),
    [todayLogs],
  );

  const streak = useMemo(() => calculateStreak(mealLogs), [mealLogs]);

  // Macros for donut chart
  const macroData = useMemo(
    () => [
      {
        name: t.nutrients.protein,
        value: todayNutrition.protein,
        color: MACRO_COLORS.protein,
      },
      {
        name: t.nutrients.carbs,
        value: todayNutrition.carbs,
        color: MACRO_COLORS.carbs,
      },
      {
        name: t.nutrients.fat,
        value: todayNutrition.fat,
        color: MACRO_COLORS.fat,
      },
    ],
    [todayNutrition, t.nutrients],
  );

  const hasMacroData = macroData.some((d) => d.value > 0);

  // Next-meal suggestion: random recipe matching user's vegetarianType
  const suggestion = useMemo(() => {
    const matching = RECIPES.filter((r) =>
      r.vegetarianType.includes(settings.vegetarianType),
    );
    if (matching.length === 0) return null;
    // Deterministic-ish daily pick based on date
    const dayIndex = new Date().getDate() + new Date().getMonth() * 31;
    return matching[dayIndex % matching.length];
  }, [settings.vegetarianType]);

  // ----- Loading state ------
  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  // ----- Targets ------
  const calorieTarget = settings.dailyCalorieTarget;
  const proteinTarget = findTarget("protein");

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ---- Stat cards row ---- */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <StatCard
          icon={<Flame className="size-4" />}
          label={t.overview.totalCalories}
          value={todayNutrition.calories.toLocaleString()}
          subtitle={`/ ${calorieTarget.toLocaleString()} kcal`}
          trend={
            todayNutrition.calories >= calorieTarget * 0.8
              ? "up"
              : todayNutrition.calories > 0
                ? "neutral"
                : undefined
          }
        />
        <StatCard
          icon={<Drumstick className="size-4" />}
          label={t.overview.totalProtein}
          value={`${Math.round(todayNutrition.protein)}g`}
          subtitle={proteinTarget ? `/ ${proteinTarget.min}g` : undefined}
          trend={
            proteinTarget && todayNutrition.protein >= proteinTarget.min
              ? "up"
              : todayNutrition.protein > 0
                ? "neutral"
                : undefined
          }
        />
        <StatCard
          icon={<UtensilsCrossed className="size-4" />}
          label={t.overview.mealsToday}
          value={todayLogs.length}
        />
        <StatCard
          icon={<Zap className="size-4" />}
          label={t.overview.streak}
          value={streak}
          subtitle={streak > 0 ? "days" : undefined}
          trend={streak >= 3 ? "up" : streak > 0 ? "neutral" : undefined}
        />
      </motion.div>

      {/* ---- Donut + Critical nutrients ---- */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut chart card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>{t.overview.caloriesMacros}</CardTitle>
              <CardDescription>{t.overview.dailyIntake}</CardDescription>
            </CardHeader>
            <CardContent className="relative flex h-[260px] items-center justify-center">
              {hasMacroData ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={macroData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {macroData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val, name) => [
                          `${Math.round(Number(val))}g`,
                          name,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center label */}
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold tabular-nums text-foreground">
                      {todayNutrition.calories.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {calorieTarget.toLocaleString()} kcal
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t.dailyLog.noMeals}
                </p>
              )}
            </CardContent>
            {/* Legend */}
            {hasMacroData && (
              <div className="flex items-center justify-center gap-4 pb-4">
                {macroData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex items-center gap-1.5 text-xs"
                  >
                    <span
                      className="size-2.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-muted-foreground">
                      {entry.name} {Math.round(entry.value)}g
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Critical nutrients card */}
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {t.overview.criticalNutrients}
                <Badge variant="secondary" className="text-xs font-normal">
                  {t.overview.vegetarianFocus}
                </Badge>
              </CardTitle>
              <CardDescription>{t.overview.trackingLevels}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {CRITICAL_KEYS.map((key) => {
                const target = findTarget(key);
                if (!target) return null;
                const current = getNutrientValue(todayNutrition, key);
                return (
                  <NutrientBar
                    key={key}
                    label={t.nutrients[key]}
                    current={current}
                    target={target.min}
                    unit={target.unit}
                  />
                );
              })}
              <p className="flex items-start gap-1.5 pt-2 text-xs text-muted-foreground">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-amber-500" />
                {t.overview.supplementTip}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ---- Next meal suggestion ---- */}
      {suggestion && (
        <motion.div variants={itemVariants}>
          <Card className="border-none bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm dark:from-emerald-950/30 dark:to-teal-950/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="size-5 text-emerald-600 dark:text-emerald-400" />
                {t.overview.nextMeal}
              </CardTitle>
              <CardDescription>{t.overview.smartLeftover}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{suggestion.emoji}</span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {suggestion.name[locale]}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.nutrition.calories} kcal
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.nutrition.protein}g{" "}
                    {t.nutrients.protein.toLowerCase()}
                  </Badge>
                  {suggestion.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="default" className="shrink-0">
                {t.overview.viewRecipe}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
