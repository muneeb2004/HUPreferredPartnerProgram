import type * as React from "react";
import { cn } from "@/lib/utils";

export interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({ children, className }: MetricGridProps): React.JSX.Element {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {children}
    </div>
  );
}

export interface AnalyticsCardProps {
  title: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export function AnalyticsCard({ title, value, trend, trendUp, className }: AnalyticsCardProps): React.JSX.Element {
  return (
    <div className={cn("p-6 rounded-xl border border-border bg-surface-card", className)}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-display font-bold text-foreground">{value}</span>
        {trend && (
          <span className={cn("text-sm font-medium", trendUp ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
