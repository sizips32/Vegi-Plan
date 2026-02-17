"use client";

import { useState, useCallback } from "react";
import {
  User,
  Target,
  Palette,
  Trash2,
  AlertTriangle,
  Sun,
  Moon,
  Monitor,
  Globe,
} from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { useAppState } from "@/hooks/use-app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VegetarianType, Locale } from "@/lib/types";
import { VEGETARIAN_TYPE_EMOJI } from "@/lib/constants";
import type { Theme } from "@/contexts/theme-context";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VEGETARIAN_TYPES: VegetarianType[] = [
  "vegan",
  "lacto",
  "ovo",
  "lacto-ovo",
  "pescatarian",
  "flexitarian",
];

const GOAL_OPTIONS = ["maintain", "muscle-gain", "weight-loss"] as const;

const LANGUAGES: { code: Locale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ko", label: "한국어" },
];

const THEME_OPTIONS: { value: Theme; icon: typeof Sun }[] = [
  { value: "light", icon: Sun },
  { value: "dark", icon: Moon },
  { value: "system", icon: Monitor },
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { t, locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { isLoaded, settings, updateSettings, resetAllData } = useAppState();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const goalLabels: Record<string, string> = {
    maintain: t.settings.maintain,
    "muscle-gain": t.settings.muscleGain,
    "weight-loss": t.settings.weightLoss,
  };

  const themeLabels: Record<Theme, string> = {
    light: t.settings.light,
    dark: t.settings.dark,
    system: t.settings.system,
  };

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateSettings({ name: e.target.value });
    },
    [updateSettings],
  );

  const handleVegetarianTypeChange = useCallback(
    (value: string) => {
      updateSettings({ vegetarianType: value as VegetarianType });
    },
    [updateSettings],
  );

  const handleGoalChange = useCallback(
    (value: string) => {
      updateSettings({
        goal: value as "maintain" | "muscle-gain" | "weight-loss",
      });
    },
    [updateSettings],
  );

  const handleCalorieTargetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(e.target.value, 10);
      if (!isNaN(val) && val > 0) {
        updateSettings({ dailyCalorieTarget: val });
      }
    },
    [updateSettings],
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
      setLocale(value as Locale);
    },
    [setLocale],
  );

  const handleThemeChange = useCallback(
    (value: string) => {
      setTheme(value as Theme);
    },
    [setTheme],
  );

  const handleResetData = useCallback(() => {
    resetAllData();
    setResetConfirmOpen(false);
  }, [resetAllData]);

  if (!isLoaded) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {t.settings.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Configure your VegiPlan preferences
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Section: Profile */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.settings.profile}
                </h3>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="settings-name">{t.settings.name}</Label>
                <Input
                  id="settings-name"
                  value={settings.name}
                  onChange={handleNameChange}
                  placeholder={t.settings.name}
                />
              </div>

              {/* Vegetarian Type */}
              <div className="space-y-2">
                <Label htmlFor="settings-veg-type">
                  {t.settings.vegetarianType}
                </Label>
                <Select
                  value={settings.vegetarianType}
                  onValueChange={handleVegetarianTypeChange}
                >
                  <SelectTrigger id="settings-veg-type" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VEGETARIAN_TYPES.map((vt) => (
                      <SelectItem key={vt} value={vt}>
                        <span className="flex items-center gap-2">
                          <span>{VEGETARIAN_TYPE_EMOJI[vt]}</span>
                          <span className="capitalize">{vt}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Goal */}
              <div className="space-y-2">
                <Label htmlFor="settings-goal">{t.settings.goal}</Label>
                <Select value={settings.goal} onValueChange={handleGoalChange}>
                  <SelectTrigger id="settings-goal" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_OPTIONS.map((goal) => (
                      <SelectItem key={goal} value={goal}>
                        {goalLabels[goal]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Section: Targets */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.settings.targets}
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settings-calories">
                  {t.settings.dailyCalories} (kcal)
                </Label>
                <Input
                  id="settings-calories"
                  type="number"
                  min={500}
                  max={10000}
                  step={50}
                  value={settings.dailyCalorieTarget}
                  onChange={handleCalorieTargetChange}
                />
              </div>
            </div>

            <Separator />

            {/* Section: Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.settings.preferences}
                </h3>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <Label
                  htmlFor="settings-language"
                  className="flex items-center gap-2"
                >
                  <Globe className="size-3.5" />
                  {t.settings.language}
                </Label>
                <Select value={locale} onValueChange={handleLanguageChange}>
                  <SelectTrigger id="settings-language" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Theme */}
              <div className="space-y-2">
                <Label>{t.settings.theme}</Label>
                <div className="flex gap-2">
                  {THEME_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = theme === opt.value;

                    return (
                      <Button
                        key={opt.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleThemeChange(opt.value)}
                        className="flex-1 gap-1.5"
                      >
                        <Icon className="size-3.5" />
                        {themeLabels[opt.value]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Separator />

            {/* Section: Data */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Trash2 className="size-4 text-destructive" />
                <h3 className="text-sm font-semibold text-foreground">
                  {t.settings.resetData}
                </h3>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setResetConfirmOpen(true)}
              >
                <Trash2 className="size-4" />
                {t.settings.resetData}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-destructive" />
              {t.settings.resetData}
            </DialogTitle>
            <DialogDescription>{t.settings.resetConfirm}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setResetConfirmOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={handleResetData}>
              {t.common.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
