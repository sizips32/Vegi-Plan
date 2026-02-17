"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface NutrientBarProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color?: string;
}

export function NutrientBar({
  label,
  current,
  target,
  unit,
  color,
}: NutrientBarProps) {
  const ratio = target > 0 ? current / target : 0;
  const percentage = Math.min(ratio * 100, 100);

  const statusColor = color
    ? color
    : ratio >= 0.8
      ? "text-emerald-600 dark:text-emerald-400"
      : ratio >= 0.6
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const barColor = color
    ? color
    : ratio >= 0.8
      ? "[&_[data-slot=progress-indicator]]:bg-emerald-500 dark:[&_[data-slot=progress-indicator]]:bg-emerald-400"
      : ratio >= 0.6
        ? "[&_[data-slot=progress-indicator]]:bg-amber-500 dark:[&_[data-slot=progress-indicator]]:bg-amber-400"
        : "[&_[data-slot=progress-indicator]]:bg-red-500 dark:[&_[data-slot=progress-indicator]]:bg-red-400";

  const trackColor =
    ratio >= 0.8
      ? "bg-emerald-500/15 dark:bg-emerald-400/15"
      : ratio >= 0.6
        ? "bg-amber-500/15 dark:bg-amber-400/15"
        : "bg-red-500/15 dark:bg-red-400/15";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className={cn("tabular-nums text-xs", statusColor)}>
          {Math.round(current)} / {target} {unit}
        </span>
      </div>
      <Progress
        value={percentage}
        className={cn("h-2", color ? "" : trackColor, color ? "" : barColor)}
      />
    </div>
  );
}
