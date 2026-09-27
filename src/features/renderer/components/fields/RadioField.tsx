import { Controller, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Field } from "@/types";

interface RadioFieldProps {
  field: Field;
}

export function RadioField({ field }: RadioFieldProps) {
  const { control, formState } = useFormContext();
  const error = formState.errors[field.name]?.message as string | undefined;
  const options = field.options ?? [];

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
    <div className="space-y-3">
      <Label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <Controller
        name={field.name}
        control={control}
        render={({ field: rhfField }) => (
          <RadioGroup
            value={rhfField.value ?? ""}
            onValueChange={rhfField.onChange}
            className="flex flex-col gap-2"
            disabled={field.disabled}
          >
            {options.map((option) => {
              const id = `${field.name}-${option.value}`;
              const isSelected = rhfField.value === option.value;

              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                      : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  } ${field.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <RadioGroupItem
                    value={option.value}
                    id={id}
                    disabled={field.disabled}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </RadioGroup>
        )}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}