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
import { Input } from "@/components/ui/input";

export function TimeField({ field }: { field: Field }) {
  const { control } = useFormContext();

  const inputType =
    field.type === "datetime"
      ? "datetime-local"
      : field.type === "time"
      ? "time"
      : "date";

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => (
        <FormItem>
          <FormLabel>
            {field.label}
            {field.required && (
              <span className="text-destructive ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>
            <Input {...rhf} type={inputType} disabled={field.disabled} />
          </FormControl>
          {field.description && (
            <FormDescription>{field.description}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}