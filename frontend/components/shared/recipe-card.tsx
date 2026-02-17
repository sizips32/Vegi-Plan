"use client";

import { Heart, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Recipe, Locale } from "@/lib/types";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onSelect?: () => void;
  locale: Locale;
}

export function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
  onSelect,
  locale,
}: RecipeCardProps) {
  return (
    <Card
      className={cn(
        "group relative cursor-default overflow-hidden transition-all",
        onSelect &&
          "cursor-pointer hover:shadow-md hover:border-primary/30 active:scale-[0.98]",
      )}
      onClick={onSelect}
    >
      {onToggleFavorite && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={cn(
            "absolute right-3 top-3 z-10 transition-all",
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-muted-foreground opacity-0 hover:text-red-500 group-hover:opacity-100",
          )}
        >
          <Heart className={cn("size-4", isFavorite && "fill-current")} />
        </Button>
      )}

      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl leading-none" role="img" aria-hidden="true">
            {recipe.emoji}
          </span>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="truncate text-sm font-semibold text-foreground">
              {recipe.name[locale]}
            </h3>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {recipe.description[locale]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 text-xs">
            <Clock className="size-3" />
            {recipe.prepTime}m
          </Badge>
          <Badge variant="outline" className="gap-1 text-xs">
            <Users className="size-3" />
            {recipe.servings}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-xs tabular-nums">
            {Math.round(recipe.nutrition.calories)} kcal
          </Badge>
          <Badge variant="secondary" className="text-xs tabular-nums">
            {Math.round(recipe.nutrition.protein)}g protein
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
