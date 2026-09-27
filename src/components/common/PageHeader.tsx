import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  badge,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8",
        className
      )}
    >
      <div className="flex items-start gap-3 min-w-0 flex-1">
        {icon && (
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            {icon}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {title}
            </h1>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-2 shrink-0 flex-wrap">{actions}</div>
      )}
    </div>
  );
}