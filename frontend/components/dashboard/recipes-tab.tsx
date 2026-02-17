"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Clock, Users, Heart, Plus, ChefHat, Leaf } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { NutrientBar } from "@/components/shared/nutrient-bar";
import { RECIPES } from "@/lib/recipes-data";
import {
  DEFAULT_NUTRIENT_TARGETS,
  VEGETARIAN_TYPE_EMOJI,
} from "@/lib/constants";
import type { MealType, Recipe, NutrientKey } from "@/lib/types";
import { MEAL_TYPES } from "@/lib/types";

type FilterCategory = "all" | MealType | "favorites";

const MEAL_TYPE_EMOJIS: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌆",
  snack: "🍪",
};

export function RecipesTab() {
  const { t, locale } = useLanguage();
  const { isLoaded, favoriteRecipeIds, toggleFavorite, addMealLog } =
    useAppState();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [mealTypeDialogOpen, setMealTypeDialogOpen] = useState(false);
  const [recipeToAdd, setRecipeToAdd] = useState<Recipe | null>(null);

  const mealTypeLabels: Record<MealType, string> = useMemo(
    () => ({
      breakfast: t.dailyLog.breakfast,
      lunch: t.dailyLog.lunch,
      dinner: t.dailyLog.dinner,
      snack: t.dailyLog.snack,
    }),
    [t],
  );

  const filterCategories: { key: FilterCategory; label: string }[] = useMemo(
    () => [
      { key: "all", label: t.recipes.allCategories },
      { key: "breakfast", label: t.dailyLog.breakfast },
      { key: "lunch", label: t.dailyLog.lunch },
      { key: "dinner", label: t.dailyLog.dinner },
      { key: "snack", label: t.dailyLog.snack },
      { key: "favorites", label: t.recipes.favorites },
    ],
    [t],
  );

  const filteredRecipes = useMemo(() => {
    let recipes = RECIPES;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      recipes = recipes.filter(
        (recipe) =>
          recipe.name.en.toLowerCase().includes(query) ||
          recipe.name.ko.includes(query),
      );
    }

    // Filter by category
    if (activeFilter === "favorites") {
      recipes = recipes.filter((recipe) =>
        favoriteRecipeIds.includes(recipe.id),
      );
    } else if (activeFilter !== "all") {
      recipes = recipes.filter((recipe) =>
        recipe.mealType.includes(activeFilter),
      );
    }

    return recipes;
  }, [searchQuery, activeFilter, favoriteRecipeIds]);

  const handleRecipeClick = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setDetailDialogOpen(true);
  }, []);

  const handleAddToMeal = useCallback((recipe: Recipe) => {
    setRecipeToAdd(recipe);
    setDetailDialogOpen(false);
    setMealTypeDialogOpen(true);
  }, []);

  const handleSelectMealType = useCallback(
    (mealType: MealType) => {
      if (!recipeToAdd) return;

      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      const dateStr = `${year}-${month}-${day}`;

      addMealLog({
        date: dateStr,
        mealType,
        recipeId: recipeToAdd.id,
        servings: 1,
        nutrition: recipeToAdd.nutrition,
      });

      setMealTypeDialogOpen(false);
      setRecipeToAdd(null);
    },
    [addMealLog, recipeToAdd],
  );

  const handleToggleFavorite = useCallback(
    (recipeId: string, e?: React.MouseEvent) => {
      e?.stopPropagation();
      toggleFavorite(recipeId);
    },
    [toggleFavorite],
  );

  const getRecipeName = useCallback(
    (recipe: Recipe): string => {
      return locale === "ko" ? recipe.name.ko : recipe.name.en;
    },
    [locale],
  );

  const getRecipeDescription = useCallback(
    (recipe: Recipe): string => {
      return locale === "ko" ? recipe.description.ko : recipe.description.en;
    },
    [locale],
  );

  const getRecipeIngredients = useCallback(
    (recipe: Recipe): string[] => {
      return locale === "ko" ? recipe.ingredients.ko : recipe.ingredients.en;
    },
    [locale],
  );

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t.recipes.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Chips */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-1">
          {filterCategories.map((cat) => (
            <Button
              key={cat.key}
              variant={activeFilter === cat.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter(cat.key)}
              className="shrink-0 rounded-full"
            >
              {cat.key === "favorites" && <Heart className="size-3.5" />}
              {cat.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3 py-12 text-center"
        >
          <ChefHat className="size-12 text-muted-foreground/40" />
          <p className="text-muted-foreground">{t.common.noResults}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredRecipes.map((recipe, index) => {
              const isFavorite = favoriteRecipeIds.includes(recipe.id);

              return (
                <motion.div
                  key={recipe.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  <Card
                    className="cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => handleRecipeClick(recipe)}
                  >
                    <CardContent className="relative p-4">
                      {/* Favorite Button */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleFavorite(recipe.id, e)}
                        className="absolute right-4 top-4 rounded-full p-1 transition-colors hover:bg-muted"
                      >
                        <Heart
                          className={`size-4 ${
                            isFavorite
                              ? "fill-red-500 text-red-500"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>

                      {/* Recipe Info */}
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{recipe.emoji}</span>
                        <div className="flex-1 overflow-hidden">
                          <h3 className="truncate text-sm font-semibold text-foreground">
                            {getRecipeName(recipe)}
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                            {getRecipeDescription(recipe)}
                          </p>
                        </div>
                      </div>

                      {/* Meta */}
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {recipe.prepTime}
                          {t.recipes.minuteShort}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="size-3" />
                          {recipe.servings} {t.recipes.servings}
                        </span>
                        <span>{recipe.nutrition.calories} kcal</span>
                      </div>

                      {/* Tags */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {recipe.vegetarianType.slice(0, 3).map((vt) => (
                          <Badge
                            key={vt}
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {VEGETARIAN_TYPE_EMOJI[vt]} {vt}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Recipe Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-lg">
          {selectedRecipe && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedRecipe.emoji}</span>
                  <div>
                    <DialogTitle>{getRecipeName(selectedRecipe)}</DialogTitle>
                    <DialogDescription>
                      {getRecipeDescription(selectedRecipe)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-4 pr-4">
                  {/* Meta Row */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Clock className="size-3" />
                      {selectedRecipe.prepTime}
                      {t.recipes.minuteShort}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Users className="size-3" />
                      {selectedRecipe.servings} {t.recipes.servings}
                    </Badge>
                    {selectedRecipe.vegetarianType.map((vt) => (
                      <Badge key={vt} variant="secondary" className="gap-1">
                        <Leaf className="size-3" />
                        {vt}
                      </Badge>
                    ))}
                  </div>

                  <Separator />

                  {/* Ingredients */}
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                      {t.recipes.ingredients}
                    </h4>
                    <ul className="grid grid-cols-2 gap-1.5">
                      {getRecipeIngredients(selectedRecipe).map(
                        (ingredient) => (
                          <li
                            key={ingredient}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                            {ingredient}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <Separator />

                  {/* Nutrition */}
                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                      {t.recipes.nutrition}
                    </h4>
                    <div className="space-y-2.5">
                      {(
                        [
                          "calories",
                          "protein",
                          "carbs",
                          "fat",
                          "fiber",
                          "vitaminB12",
                          "iron",
                          "calcium",
                          "omega3",
                          "zinc",
                        ] as NutrientKey[]
                      ).map((key) => {
                        const target = DEFAULT_NUTRIENT_TARGETS.find(
                          (nt) => nt.key === key,
                        );
                        if (!target) return null;

                        return (
                          <NutrientBar
                            key={key}
                            label={t.nutrients[key]}
                            current={selectedRecipe.nutrition[key]}
                            target={target.min}
                            unit={target.unit}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter>
                <Button
                  onClick={() => handleAddToMeal(selectedRecipe)}
                  className="w-full gap-2"
                >
                  <Plus className="size-4" />
                  {t.recipes.addToMeal}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Meal Type Selection Dialog */}
      <Dialog open={mealTypeDialogOpen} onOpenChange={setMealTypeDialogOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader>
            <DialogTitle>{t.recipes.addToMeal}</DialogTitle>
            <DialogDescription>
              {recipeToAdd ? getRecipeName(recipeToAdd) : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {MEAL_TYPES.map((mealType) => (
              <Button
                key={mealType}
                variant="outline"
                onClick={() => handleSelectMealType(mealType)}
                className="flex h-auto flex-col gap-1 py-3"
              >
                <span className="text-lg">{MEAL_TYPE_EMOJIS[mealType]}</span>
                <span className="text-xs">{mealTypeLabels[mealType]}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
