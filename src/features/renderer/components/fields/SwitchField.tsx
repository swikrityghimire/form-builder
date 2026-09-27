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
import { Switch } from "@/components/ui/switch";

export function SwitchField({ field }: { field: Field }) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={field.name}
      render={({ field: rhf }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5 flex-1">
            <FormLabel className="text-sm cursor-pointer">
              {field.label}
              {field.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </FormLabel>
            {field.description && (
              <FormDescription className="text-xs">
                {field.description}
              </FormDescription>
            )}
          </div>
          <FormControl>
            <Switch
              checked={!!rhf.value}
              onCheckedChange={rhf.onChange}
              disabled={field.disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}