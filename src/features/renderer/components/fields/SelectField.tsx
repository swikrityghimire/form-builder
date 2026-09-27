import { Controller, useFormContext } from "react-hook-form";
import { Check, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Field } from "@/types";

interface SelectFieldProps {
  field: Field;
}

export function SelectField({ field }: SelectFieldProps) {
  const { control, formState } = useFormContext();
  const error = formState.errors[field.name]?.message as string | undefined;
  const options = field.options ?? [];
  const placeholder = field.placeholder || "Select an option";

  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <p className="text-xs text-muted-foreground italic">
          No options configured for this field.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Label */}
      <Label
        htmlFor={field.name}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Description */}
      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <Controller
        name={field.name}
        control={control}
        render={({ field: rhfField }) => {
          const hasValue =
            rhfField.value !== undefined &&
            rhfField.value !== null &&
            rhfField.value !== "";

          const selectedOption = options.find(
            (opt) => opt.value === rhfField.value
          );

          return (
            <Select
              value={hasValue ? String(rhfField.value) : ""}
              onValueChange={rhfField.onChange}
              disabled={field.disabled}
            >
              {/* ══════════ TRIGGER (closed state) ══════════ */}
              <SelectTrigger
                id={field.name}
                className={cn(
                  // Base
                  "group w-full h-12 px-4 rounded-xl",
                  "bg-white dark:bg-gray-900",
                  "border-2 border-gray-200 dark:border-gray-700",
                  // Text
                  "text-sm text-left",
                  // Focus
                  "focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500",
                  // Hover
                  "hover:border-gray-300 dark:hover:border-gray-600",
                  // Transition
                  "transition-all duration-200",
                  // Error state
                  error &&
                    "border-red-500 focus:ring-red-500/20 focus:border-red-500",
                  // Disabled
                  field.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span
                  className={cn(
                    "flex-1 truncate",
                    hasValue
                      ? "text-gray-900 dark:text-gray-100 font-medium"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {selectedOption?.label || placeholder}
                </span>

                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0 ml-2" />
              </SelectTrigger>

              <SelectContent
                position="popper"
                sideOffset={6}
                className={cn(
                  "z-50 min-w-[var(--radix-select-trigger-width)]",
                  "max-h-72 overflow-hidden",
                  "rounded-xl border-2 border-gray-100 dark:border-gray-700",
                  "bg-white dark:bg-gray-900",
                  "shadow-xl shadow-black/5 dark:shadow-black/30"
                )}
              >

                <div className="p-1.5 max-h-64 overflow-y-auto">
                  {options.map((option) => {
                    const isSelected = rhfField.value === option.value;

                    return (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={cn(
                          "relative flex items-center gap-2",
                          "px-3 py-2.5 pl-9 rounded-lg cursor-pointer",
                          "text-sm font-medium",
                          "transition-colors",
                          // Selected state
                          isSelected &&
                            "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300",
                          // Hover
                          "hover:bg-gray-100 dark:hover:bg-gray-800",
                          // Focus (keyboard)
                          "focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none"
                        )}
                      >
                        {isSelected && (
                          <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                            <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                          </span>
                        )}
                        <span className="truncate">{option.label}</span>
                      </SelectItem>
                    );
                  })}
                </div>
              </SelectContent>
            </Select>
          );
        }}
      />

      {error && (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <span className="inline-block h-1 w-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}