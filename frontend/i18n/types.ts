export interface Dictionary {
  common: {
    appName: string;
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    confirm: string;
    search: string;
    noResults: string;
    close: string;
  };
  header: {
    greeting: string;
    subtitle: string;
    settings: string;
  };
  tabs: {
    overview: string;
    planner: string;
    dailyLog: string;
    recipes: string;
    scanner: string;
  };
  overview: {
    dailyIntake: string;
    caloriesMacros: string;
    criticalNutrients: string;
    vegetarianFocus: string;
    trackingLevels: string;
    supplementTip: string;
    nextMeal: string;
    smartLeftover: string;
    viewRecipe: string;
    totalCalories: string;
    totalProtein: string;
    mealsToday: string;
    streak: string;
  };
  planner: {
    title: string;
    description: string;
    weeklyPlan: string;
    addMeal: string;
    removeMeal: string;
    mealSlot: string;
    nutritionSummary: string;
    noMealPlanned: string;
  };
  scanner: {
    title: string;
    description: string;
    upload: string;
    dragDrop: string;
    analyzing: string;
    resultVegan: string;
    resultNonVegan: string;
    detectedIngredients: string;
    tryAnother: string;
  };
  dailyLog: {
    title: string;
    today: string;
    addMeal: string;
    removeMeal: string;
    breakfast: string;
    lunch: string;
    dinner: string;
    snack: string;
    dailySummary: string;
    noMeals: string;
  };
  recipes: {
    title: string;
    searchPlaceholder: string;
    allCategories: string;
    favorites: string;
    prepTime: string;
    servings: string;
    ingredients: string;
    nutrition: string;
    addToMeal: string;
    viewDetails: string;
    minuteShort: string;
  };
  settings: {
    title: string;
    profile: string;
    name: string;
    vegetarianType: string;
    goal: string;
    maintain: string;
    muscleGain: string;
    weightLoss: string;
    targets: string;
    dailyCalories: string;
    preferences: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    system: string;
    resetData: string;
    resetConfirm: string;
  };
  nutrients: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
    vitaminB12: string;
    iron: string;
    calcium: string;
    omega3: string;
    zinc: string;
  };
}
