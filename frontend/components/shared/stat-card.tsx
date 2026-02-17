"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
}

const trendConfig = {
  up: {
    icon: TrendingUp,
    color: "text-emerald-600 dark:text-emerald-400",
  },
  down: {
    icon: TrendingDown,
    color: "text-red-600 dark:text-red-400",
  },
  neutral: {
    icon: Minus,
    color: "text-muted-foreground",
  },
};

export function StatCard({
  icon,
  label,
  value,
  subtitle,
  trend,
}: StatCardProps) {
  const TrendIcon = trend ? trendConfig[trend].icon : null;

  return (
    <Card className="gap-0 py-4">
      <CardContent className="flex items-start gap-3 px-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-xs font-medium text-muted-foreground">
            {label}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tabular-nums text-foreground">
              {value}
            </span>
            {TrendIcon && trend && (
              <TrendIcon className={cn("size-4", trendConfig[trend].color)} />
            )}
          </div>

          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
