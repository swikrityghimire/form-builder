/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import type { Field, FormSchema, FormStep } from "@/types";

interface StepInfo {
  step: FormStep;
  index: number;
  fields: Field[];
}

export function useMultiStep(schema: FormSchema) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const multiStep = schema.settings.multiStep;
  const enabled = multiStep?.enabled ?? false;
  const steps = multiStep?.steps ?? [];

  const stepInfo: StepInfo[] = useMemo(() => {
    if (!enabled) return [];

    return steps.map((step, index) => {
      const fieldsForStep: Field[] = [];

      const collect = (fields: Field[]) => {
        for (const f of fields) {
          if (f.type === "row" && f.children) {
            if ((f.stepId ?? steps[0]?.id) === step.id) {
              fieldsForStep.push(f);
            } else {
              collect(f.children);
            }
          } else {
            const fieldStepId = f.stepId ?? steps[0]?.id;
            if (fieldStepId === step.id) {
              fieldsForStep.push(f);
            }
          }
        }
      };

      collect(schema.fields);

      return { step, index, fields: fieldsForStep };
    });
  }, [schema.fields, steps, enabled]);

  const totalSteps = enabled ? steps.length : 1;
  const currentStep = enabled ? stepInfo[currentStepIndex] : null;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const nextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((i) => i - 1);
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  };

  const reset = () => setCurrentStepIndex(0);

  return {
    enabled,
    steps,
    stepInfo,
    totalSteps,
    currentStepIndex,
    currentStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
  };
}