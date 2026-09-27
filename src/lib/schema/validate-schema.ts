/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import type { FormSchema } from "@/types";

const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

const conditionRuleSchema = z.object({
  fieldId: z.string(),
  operator: z.string(),
  value: z.string().optional(),
});

const conditionsSchema = z.object({
  action: z.enum(["show", "hide"]),
  logic: z.enum(["all", "any"]),
  rules: z.array(conditionRuleSchema),
});

const fieldSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    type: z.string(),
    label: z.string(),
    name: z.string(),
    placeholder: z.string().optional(),
    description: z.string().optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    validation: z
      .object({
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        pattern: z.string().optional(),
        email: z.boolean().optional(),
      })
      .optional(),
    options: z.array(optionSchema).optional(),
    width: z.enum(["full", "1/2", "1/3", "1/4"]).optional(),
    columns: z.number().optional(),
    children: z.array(fieldSchema).optional(),
    conditions: conditionsSchema.optional(),
    stepId: z.string().optional(),
  })
);

const formStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
});

const multiStepSchema = z.object({
  enabled: z.boolean(),
  showProgress: z.boolean(),
  allowBackNavigation: z.boolean(),
  steps: z.array(formStepSchema),
});

const themeSchema = z.object({
  preset: z.enum(["default", "minimal", "rounded", "playful", "corporate"]),
  accentColor: z.string(),
  borderRadius: z.enum(["none", "small", "medium", "large"]),
  fontFamily: z.enum([
    "system",
    "arial",
    "times",
    "georgia",
    "verdana",
    "courier",
    "trebuchet",
    "tahoma",
    "inter",
    "roboto",
    "poppins",
    "serif",
    "mono",
  ]),
  layout: z.enum(["centered", "full-width"]),
});

const formSchemaValidator = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(fieldSchema),
  settings: z.object({
    submitLabel: z.string(),
    successMessage: z.string(),
    redirectUrl: z.string().optional(),
    multiStep: multiStepSchema.optional(),
    theme: themeSchema.optional(),
  }),
});

export function validateFormSchema(data: unknown): FormSchema {
  const result = formSchemaValidator.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(
      `Invalid form: ${firstError.path.join(".")} — ${firstError.message}`
    );
  }
  return result.data as FormSchema;
}