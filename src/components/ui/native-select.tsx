/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NativeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

/**
 * Native HTML select — works 100% consistently across all browsers.
 * Styled to match shadcn design.
 */
export const NativeSelect = React.forwardRef<
  HTMLSelectElement,
  NativeSelectProps
>(({ className, children, invalid, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          // Base styles
          "appearance-none w-full h-9 rounded-md border px-3 pr-9 text-sm",
          "bg-background text-foreground",
          "cursor-pointer",
          "transition-colors",
          // Focus
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
          "focus:ring-offset-background",
          // Border
          invalid
            ? "border-destructive"
            : "border-input hover:border-foreground/30",
          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </select>

      {/* Chevron icon */}
      <ChevronDown
        className={cn(
          "absolute right-3 top-1/2 -translate-y-1/2",
          "h-4 w-4 text-muted-foreground pointer-events-none"
        )}
      />
    </div>
  );
});
NativeSelect.displayName = "NativeSelect";

export interface NativeSelectOptionProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {}

export const NativeSelectOption = React.forwardRef<
  HTMLOptionElement,
  NativeSelectOptionProps
>(({ className, ...props }, ref) => (
  <option ref={ref} className={cn("bg-background", className)} {...props} />
));
NativeSelectOption.displayName = "NativeSelectOption";

export interface NativeSelectOptGroupProps
  extends React.OptgroupHTMLAttributes<HTMLOptGroupElement> {}

export const NativeSelectOptGroup = React.forwardRef<
  HTMLOptGroupElement,
  NativeSelectOptGroupProps
>(({ className, ...props }, ref) => (
  <optgroup ref={ref} className={className} {...props} />
));
NativeSelectOptGroup.displayName = "NativeSelectOptGroup";