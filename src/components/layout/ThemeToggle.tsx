import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "group relative inline-flex h-8 w-[68px] items-center rounded-full",
        "border border-border bg-background/60 backdrop-blur",
        "p-1 cursor-pointer",
        "transition-all hover:border-primary/40 hover:bg-background/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "shadow-sm"
      )}
    >
      {/* Sliding pill indicator */}
      <div
        className={cn(
          "absolute top-1 left-1 h-6 w-8 rounded-full",
          "bg-gradient-to-br from-primary to-primary/80",
          "shadow-sm transition-all duration-300 ease-out",
          isDark && "translate-x-[30px]"
        )}
      />

      {/* Sun icon */}
      <div
        className={cn(
          "relative z-10 flex h-6 w-8 items-center justify-center",
          "transition-colors duration-200",
          !isDark ? "text-primary-foreground" : "text-foreground/50"
        )}
      >
        <Sun className="h-3.5 w-3.5" />
      </div>

      {/* Moon icon */}
      <div
        className={cn(
          "relative z-10 flex h-6 w-8 items-center justify-center",
          "transition-colors duration-200",
          isDark ? "text-primary-foreground" : "text-foreground/50"
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </div>
    </button>
  );
}