import type { FieldType, FieldWidth, RowColumns } from "./field-type";
import type { FieldOption } from "./field-option";
import type { ValidationRules } from "./validation-rules";
import type { FieldConditions } from "./conditional";

export interface Field {
  // Identity
  id: string;
  type: FieldType;
  label: string;
  name: string;

  // Display
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;

  // State
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;

  // Validation
  validation?: ValidationRules;

  // Options
  options?: FieldOption[];

  // Layout
  width?: FieldWidth;
  columns?: RowColumns;
  children?: Field[];

  // Type-specific
  rows?: number;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  max?: number;
  step?: number;
  min?: number;

  // Conditional logic
  conditions?: FieldConditions;

  // Multi-step
  stepId?: string;
}