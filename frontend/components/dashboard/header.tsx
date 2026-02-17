"use client";

import { Cog } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useAppState } from "@/hooks/use-app-state";
import { VEGETARIAN_TYPE_EMOJI } from "@/lib/constants";
import { LanguageSelector } from "@/components/shared/language-selector";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface HeaderProps {
  onOpenSettings?: () => void;
}

export function Header({ onOpenSettings }: HeaderProps) {
  const { t } = useLanguage();
  const { settings, isLoaded } = useAppState();

  if (!isLoaded) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-56" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-8 rounded-md" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>
    );
  }

  const emoji = VEGETARIAN_TYPE_EMOJI[settings.vegetarianType] ?? "";
  const initials = settings.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const goalLabel: Record<typeof settings.goal, { en: string; ko: string }> = {
    maintain: { en: "Maintain", ko: "유지" },
    "muscle-gain": { en: "Muscle Gain", ko: "근육 증가" },
    "weight-loss": { en: "Weight Loss", ko: "체중 감량" },
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left: Greeting */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t.header.greeting}, {settings.name}{" "}
          <span className="inline-block">{emoji}</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {settings.vegetarianType.charAt(0).toUpperCase() +
            settings.vegetarianType.slice(1).replace("-", " ")}{" "}
          &middot; {goalLabel[settings.goal]?.en ?? settings.goal}
        </p>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <LanguageSelector />
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenSettings}
          aria-label={t.header.settings}
          className="text-muted-foreground hover:text-foreground"
        >
          <Cog className="size-4" />
        </Button>
        <Avatar className="size-9 border-2 border-background shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initials || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
