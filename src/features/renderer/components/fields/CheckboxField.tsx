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

export function CheckboxField({ field }: { field: Field }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => (
        <FormItem className="flex flex-row items-start gap-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={!!rhf.value}
              onCheckedChange={rhf.onChange}
              disabled={field.disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}