import { useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Field } from "@/types";

interface TextFieldProps {
  field: Field;
}

export function TextField({ field }: TextFieldProps) {
  const { register, formState } = useFormContext();
  const error = formState.errors[field.name]?.message as string | undefined;

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "tel"
        ? "tel"
        : field.type === "url"
          ? "url"
          : field.type === "password"
            ? "password"
            : "text";

  return (
    <div className="space-y-2">
      <Label
        htmlFor={field.name}
        className="text-sm font-medium text-gray-700 dark:text-gray-200"
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {field.description && (
        <p className="text-xs text-muted-foreground">{field.description}</p>
      )}

      <Input
        id={field.name}
        type={inputType}
        placeholder={field.placeholder}
        disabled={field.disabled}
        {...register(field.name)}
        className={`h-11 rounded-lg border-gray-300 dark:border-gray-700 focus-visible:ring-2 focus-visible:ring-indigo-500 ${
          error ? "border-red-500 focus-visible:ring-red-500" : ""
        }`}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}