"use client";

import { X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { MealLog, MealType } from "@/lib/types";

interface MealCardProps {
  log: MealLog;
  recipeName: string;
  emoji: string;
  onRemove?: () => void;
}

const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const mealTypeColors: Record<MealType, string> = {
  breakfast:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  lunch:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  dinner:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
  snack: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
};

export function MealCard({ log, recipeName, emoji, onRemove }: MealCardProps) {
  return (
    <Card className="group relative flex-row items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/50">
      <span className="text-2xl leading-none" role="img" aria-hidden="true">
        {emoji}
      </span>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">
            {recipeName}
          </span>
          <Badge variant="secondary" className={mealTypeColors[log.mealType]}>
            {mealTypeLabels[log.mealType]}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="tabular-nums">
            {Math.round(log.nutrition.calories)} kcal
          </span>
          {log.servings !== 1 && (
            <span className="tabular-nums">
              {log.servings} serving{log.servings > 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {onRemove && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onRemove}
          aria-label={`Remove ${recipeName}`}
          className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
        >
          <X className="size-3.5" />
        </Button>
      )}
    </Card>
  );
}
