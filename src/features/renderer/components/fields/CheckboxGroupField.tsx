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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function CheckboxGroupField({ field }: { field: Field }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => {
        const selected: string[] = Array.isArray(rhf.value)
          ? rhf.value
          : [];

        const toggle = (value: string) => {
          if (selected.includes(value)) {
            rhf.onChange(selected.filter((v) => v !== value));
          } else {
            rhf.onChange([...selected, value]);
          }
        };

        return (
          <FormItem>
            <FormLabel>
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2.5">
                {(field.options ?? []).map((opt) => (
                  <div
                    key={opt.value}
                    className="flex items-center gap-2.5"
                  >
                    <Checkbox
                      id={`${field.id}-${opt.value}`}
                      checked={selected.includes(opt.value)}
                      onCheckedChange={() => toggle(opt.value)}
                      disabled={field.disabled}
                    />
                    <Label
                      htmlFor={`${field.id}-${opt.value}`}
                      className="text-sm cursor-pointer font-normal"
                    >
                      {opt.label}
                    </Label>
                  </div>
                ))}
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