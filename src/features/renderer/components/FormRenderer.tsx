/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { FormSchema, Field } from "@/types";
import { buildZodSchema } from "@/lib/schema/zod-builder";
import { FieldRenderer } from "./FieldRenderer";
import { StepProgress } from "./StepProgress";
import { shouldShowField } from "@/lib/conditions/evaluate";
import { useMultiStep } from "@/hooks/useMultiStep";
import { getThemeCssVars } from "@/lib/theme/apply-theme";

interface FormRendererProps {
  schema: FormSchema;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitLabel?: string;
  hideHeader?: boolean;
}

function collectDefaultValues(fields: Field[]): Record<string, unknown> {
  const values: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.type === "section" || field.type === "divider") continue;

    if (field.type === "row" && field.children) {
      Object.assign(values, collectDefaultValues(field.children));
      continue;
    }

    if (field.type === "checkbox" || field.type === "switch") {
      values[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : false;
    } else if (
      field.type === "multiselect" ||
      field.type === "checkbox-group"
    ) {
      values[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : [];
    } else if (
      field.type === "number" ||
      field.type === "slider" ||
      field.type === "rating"
    ) {
      values[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    } else {
      values[field.name] =
        field.defaultValue !== undefined ? field.defaultValue : "";
    }
  }

  return values;
}

function flattenFields(fields: Field[]): Field[] {
  const result: Field[] = [];
  for (const f of fields) {
    if (f.type === "row" && f.children) {
      result.push(...flattenFields(f.children));
    } else if (f.type !== "section" && f.type !== "divider") {
      result.push(f);
    }
  }
  return result;
}

export function FormRenderer({
  schema,
  onSubmit,
  submitLabel,
  hideHeader = false,
}: FormRendererProps) {
  const zodSchema = buildZodSchema(schema);
  const defaultValues = collectDefaultValues(schema.fields);

  const methods = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const watchedValues = useWatch({ control: methods.control });
  const formValues = (watchedValues ?? methods.getValues()) as Record<
    string,
    unknown
  >;

  const allFields = flattenFields(schema.fields);
  const multiStep = useMultiStep(schema);

  const themeVars = getThemeCssVars(schema.settings.theme);
  const theme = schema.settings.theme;
  const isFullWidth = theme?.layout === "full-width";
  const isMinimal = theme?.preset === "minimal";

  const submitAll = methods.handleSubmit(
    (data) => {
      const visibleData: Record<string, unknown> = {};
      for (const field of allFields) {
        if (shouldShowField(field, data, allFields)) {
          visibleData[field.name] = data[field.name];
        }
      }

      if (onSubmit) {
        onSubmit(visibleData);
      } else {
        console.log("Form submitted:", visibleData);
      }
      toast.success(schema.settings.successMessage);
    },
    (errors) => {
      console.warn("Validation errors:", errors);
      toast.error("Please fix the errors above");
    }
  );

  const handleNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!multiStep.currentStep) return;

    const currentStepFieldNames = multiStep.currentStep.fields
      .filter((f) => f.type !== "section" && f.type !== "divider")
      .map((f) => f.name);

    if (currentStepFieldNames.length === 0) {
      multiStep.nextStep();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const isValid = await methods.trigger(currentStepFieldNames, {
      shouldFocus: true,
    });

    if (!isValid) {
      toast.error("Please fix the errors in this step");
      return;
    }

    multiStep.nextStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    multiStep.prevStep();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fieldsToRender = multiStep.enabled
    ? multiStep.currentStep?.fields ?? []
    : schema.fields;

  const isSubmitting = methods.formState.isSubmitting;

  // THEMED STYLES (inline overrides)

  const themedSubmitStyle: React.CSSProperties = {
    backgroundColor: theme?.accentColor,
    color: "#ffffff",
  };

  return (
    <FormProvider {...methods}>
      <div
        style={themeVars}
        className={isFullWidth ? "w-full" : "mx-auto"}
        data-theme-preset={theme?.preset ?? "default"}
      >
        <form
          onSubmit={submitAll}
          onKeyDown={(e) => {
            if (multiStep.enabled && e.key === "Enter" && !multiStep.isLastStep) {
              e.preventDefault();
            }
          }}
          className="space-y-4"
          style={{
            fontFamily: "var(--form-font)",
            maxWidth: isFullWidth ? "100%" : "640px",
            margin: isFullWidth ? "0" : "0 auto",
          }}
        >
          {!hideHeader && (
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">
                {schema.title}
              </h1>
              {schema.description && (
                <p className="text-sm text-muted-foreground">
                  {schema.description}
                </p>
              )}
            </div>
          )}

          {multiStep.enabled && schema.settings.multiStep?.showProgress && (
            <StepProgress
              steps={multiStep.steps}
              currentIndex={multiStep.currentStepIndex}
              onStepClick={
                schema.settings.multiStep?.allowBackNavigation
                  ? (index) => {
                      multiStep.goToStep(index);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  : undefined
              }
            />
          )}

          <div className="space-y-3">
            {fieldsToRender.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                {multiStep.enabled
                  ? "This step has no fields."
                  : "This form has no fields yet."}
              </div>
            ) : (
              <ConditionalFieldList
                fields={fieldsToRender}
                formValues={formValues}
                allFields={allFields}
                isMinimal={isMinimal}
              />
            )}
          </div>

          {multiStep.enabled ? (
            <div className="flex justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleBack}
                disabled={
                  multiStep.isFirstStep ||
                  !schema.settings.multiStep?.allowBackNavigation ||
                  isSubmitting
                }
                style={{
                  borderRadius: "var(--form-radius)",
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>

              {multiStep.isLastStep ? (
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  style={{
                    ...themedSubmitStyle,
                    borderRadius: "var(--form-radius)",
                  }}
                >
                  <Send className="h-4 w-4 mr-1.5" />
                  {isSubmitting
                    ? "Submitting..."
                    : submitLabel ?? schema.settings.submitLabel ?? "Submit"}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  style={{
                    ...themedSubmitStyle,
                    borderRadius: "var(--form-radius)",
                  }}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              )}
            </div>
          ) : (
            fieldsToRender.length > 0 && (
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
                style={{
                  ...themedSubmitStyle,
                  borderRadius: "var(--form-radius)",
                }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : submitLabel ?? schema.settings.submitLabel ?? "Submit"}
              </Button>
            )
          )}
        </form>
      </div>
    </FormProvider>
  );
}

function ConditionalFieldList({
  fields,
  formValues,
  allFields,
  isMinimal,
}: {
  fields: Field[];
  formValues: Record<string, unknown>;
  allFields: Field[];
  isMinimal?: boolean;
}) {
  return (
    <>
      {fields.map((field) => {
        const visible = shouldShowField(field, formValues, allFields);
        if (!visible) return null;
        return (
          <div
            key={field.id}
            data-field
            data-minimal={isMinimal ? "true" : "false"}
            style={
              isMinimal
                ? {
                    // Minimal theme: remove borders via CSS overrides
                    ["--tw-shadow" as any]: "none",
                  }
                : undefined
            }
          >
            <FieldRenderer field={field} />
          </div>
        );
      })}
    </>
  );
}