import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  size = "default",
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      wrapper: "py-8 px-4",
      iconWrap: "h-10 w-10 rounded-lg",
      icon: "h-5 w-5",
      title: "text-sm font-semibold",
      desc: "text-xs",
      gap: "gap-3",
    },
    default: {
      wrapper: "py-12 px-6",
      iconWrap: "h-14 w-14 rounded-2xl",
      icon: "h-6 w-6",
      title: "text-base font-semibold",
      desc: "text-sm",
      gap: "gap-4",
    },
    lg: {
      wrapper: "py-16 px-6",
      iconWrap: "h-16 w-16 rounded-2xl",
      icon: "h-7 w-7",
      title: "text-lg font-semibold",
      desc: "text-sm",
      gap: "gap-5",
    },
  }[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        sizeClasses.wrapper,
        className
      )}
    >
      <div className={cn("flex flex-col items-center", sizeClasses.gap)}>
        <div
          className={cn(
            "flex items-center justify-center bg-muted/50 border",
            sizeClasses.iconWrap
          )}
        >
          <Icon className={cn("text-muted-foreground", sizeClasses.icon)} />
        </div>

        <div className="space-y-1.5 max-w-sm">
          <h3 className={sizeClasses.title}>{title}</h3>
          {description && (
            <p className={cn("text-muted-foreground", sizeClasses.desc)}>
              {description}
            </p>
          )}
        </div>

        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}