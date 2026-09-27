import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Star } from "lucide-react";
import type { Field } from "@/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

export function RatingField({ field }: { field: Field }) {
  const { control } = useFormContext();
  const [hovered, setHovered] = useState(0);
  const maxRating = field.max ?? 5;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => {
        const value = Number(rhf.value) || 0;

        return (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            <FormControl>
              <div
                className="flex items-center gap-1"
                onMouseLeave={() => setHovered(0)}
              >
                {Array.from({ length: maxRating }, (_, i) => i + 1).map(
                  (star) => {
                    const filled = star <= (hovered || value);
                    return (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHovered(star)}
                        onClick={() => rhf.onChange(star)}
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm transition-transform hover:scale-110"
                        disabled={field.disabled}
                        aria-label={`Rate ${star} of ${maxRating}`}
                      >
                        <Star
                          className={cn(
                            "h-7 w-7 transition-colors",
                            filled
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/40"
                          )}
                        />
                      </button>
                    );
                  }
                )}
                {value > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {value} / {maxRating}
                  </span>
                )}
              </div>
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}