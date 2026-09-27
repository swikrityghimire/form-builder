import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description?: string;
  trend?: string;
  color?: "primary" | "blue" | "green" | "amber" | "rose" | "purple" | "cyan";
  className?: string;
}

const COLOR_MAP = {
  primary: {
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "ring-primary/20",
    accent: "bg-primary",
  },
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/20",
    accent: "bg-blue-500",
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-600 dark:text-green-400",
    ring: "ring-green-500/20",
    accent: "bg-green-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/20",
    accent: "bg-amber-500",
  },
  rose: {
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
    ring: "ring-rose-500/20",
    accent: "bg-rose-500",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-500/20",
    accent: "bg-purple-500",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-600 dark:text-cyan-400",
    ring: "ring-cyan-500/20",
    accent: "bg-cyan-500",
  },
};

export function StatCard({
  icon: Icon,
  label,
  value,
  description,
  trend,
  color = "primary",
  className,
}: StatCardProps) {
  const colors = COLOR_MAP[color];

  return (
    <Card
      className={cn(
        "relative overflow-hidden group transition-all",
        "hover:shadow-md hover:border-primary/20",
        className
      )}
    >
      {/* Top accent bar */}
      <div className={cn("absolute top-0 left-0 right-0 h-0.5", colors.accent)} />

      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div
            className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ring-1 transition-transform group-hover:scale-110",
              colors.bg,
              colors.ring
            )}
          >
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>

          {trend && (
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              {trend}
            </span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold tracking-tight leading-none">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground pt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}