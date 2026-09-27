import { z } from "zod";
import type { Field, FormSchema } from "@/types";

function fieldToZod(field: Field): z.ZodTypeAny {
  let base: z.ZodTypeAny;

  switch (field.type) {
    case "number":
    case "slider":
    case "rating": {
      let num = z.coerce.number();
      const min =
        field.validation?.min !== undefined
          ? field.validation.min
          : field.type === "rating"
          ? 1
          : field.min;
      const max =
        field.validation?.max !== undefined
          ? field.validation.max
          : field.type === "rating"
          ? field.max ?? 5
          : field.max;

      if (min !== undefined) num = num.min(min);
      if (max !== undefined) num = num.max(max);
      base = num;
      break;
    }

    case "email":
      base = z.string().email("Invalid email address");
      break;

    case "url":
      base = z.string().url("Invalid URL");
      break;

    case "checkbox":
    case "switch":
      base = z.boolean();
      break;

    case "checkbox-group":
    case "multiselect":
      base = z.array(z.string());
      break;

    case "date":
    case "time":
    case "datetime":
      base = z.string();
      break;

    case "file":
    case "image":
      base = z.any();
      break;

    case "section":
    case "divider":
      // Layout-only — no validation
      base = z.any().optional();
      break;

    default: {
      let str = z.string();
      if (field.validation?.minLength !== undefined) {
        str = str.min(
          field.validation.minLength,
          `Min ${field.validation.minLength} characters`
        );
      }
      if (field.validation?.maxLength !== undefined) {
        str = str.max(
          field.validation.maxLength,
          `Max ${field.validation.maxLength} characters`
        );
      }
      if (field.validation?.pattern) {
        str = str.regex(new RegExp(field.validation.pattern), "Invalid format");
      }
      base = str;
    }
  }

  // Required handling
  if (field.required) {
    if (base instanceof z.ZodString) {
      return base.min(1, `${field.label} is required`);
    }
    if (base instanceof z.ZodArray) {
      return base.min(1, `${field.label} is required`);
    }
    return base;
  }

  // Optional handling
  if (base instanceof z.ZodString) {
    return base.optional().or(z.literal(""));
  }
  if (base instanceof z.ZodArray) {
    return base.optional();
  }
  if (base instanceof z.ZodNumber) {
    return base.optional();
  }
  if (base instanceof z.ZodBoolean) {
    return base.optional();
  }

  return base.optional();
}

export function buildZodSchema(schema: FormSchema) {
  const shape: Record<string, z.ZodTypeAny> = {};

  const addFields = (fields: Field[]) => {
    for (const field of fields) {
      // Skip layout-only fields
      if (field.type === "section" || field.type === "divider") continue;

      // Recurse into rows
      if (field.type === "row" && field.children) {
        addFields(field.children);
        continue;
      }

      shape[field.name] = fieldToZod(field);
    }
  };

  addFields(schema.fields);

  return z.object(shape);
}