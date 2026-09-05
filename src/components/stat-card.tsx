import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  variant?: "hero" | "default";
  tone?: "good" | "warn" | "neutral";
  sub?: React.ReactNode;
  valueClassName?: string;
}

const TONE_ICON_CLASS: Record<"good" | "warn" | "neutral", string> = {
  good: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  warn: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  neutral: "bg-accent text-primary",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "default",
  tone = "neutral",
  sub,
  valueClassName,
}: StatCardProps) {
  const hero = variant === "hero";
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-sm",
        hero ? "bg-primary text-primary-foreground" : "border border-border/60 bg-card",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={cn("text-sm font-medium", hero ? "text-primary-foreground/75" : "text-muted-foreground")}>
          {label}
        </p>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl",
            hero ? "bg-white/15 text-primary-foreground" : TONE_ICON_CLASS[tone],
          )}
        >
          <Icon className="size-4.5" />
        </div>
      </div>
      <p className={cn("mt-3 text-2xl font-semibold", valueClassName)}>{value}</p>
      {sub && (
        <div className={cn("mt-1 text-xs", hero ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {sub}
        </div>
      )}
    </div>
  );
}
