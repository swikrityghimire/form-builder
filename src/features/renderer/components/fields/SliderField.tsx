import { useFormContext } from "react-hook-form";
import type { Field } from "@/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

export function SliderField({ field }: { field: Field }) {
  const { control } = useFormContext();
  const min = field.min ?? 0;
  const max = field.max ?? 100;
  const step = field.step ?? 1;

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => {
        const value = Number(rhf.value) || min;

        return (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              <span>
                {field.label}
                {field.required && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </span>
              <span className="text-sm font-mono text-muted-foreground">
                {value}
              </span>
            </FormLabel>
            <FormControl>
              <Slider
                value={[value]}
                min={min}
                max={max}
                step={step}
                onValueChange={([v]) => rhf.onChange(v)}
                disabled={field.disabled}
              />
            </FormControl>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{min}</span>
              <span>{max}</span>
            </div>
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