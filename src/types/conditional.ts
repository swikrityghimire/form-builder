export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal"
  | "is_empty"
  | "is_not_empty"
  | "is_true"
  | "is_false";

export interface ConditionRule {

  fieldId: string;

  operator: ConditionOperator;

  value?: string;
}

export interface FieldConditions {

  action: "show" | "hide";

  logic: "all" | "any";

  rules: ConditionRule[];
}

export interface OperatorInfo {
  value: ConditionOperator;
  label: string;
  requiresValue: boolean;

  fieldTypes: (
    | "text"
    | "number"
    | "boolean"
    | "choice"
    | "date"
    | "any"
  )[];
}

export const OPERATORS: OperatorInfo[] = [
  {
    value: "equals",
    label: "equals",
    requiresValue: true,
    fieldTypes: ["text", "number", "choice", "date", "any"],
  },
  {
    value: "not_equals",
    label: "does not equal",
    requiresValue: true,
    fieldTypes: ["text", "number", "choice", "date", "any"],
  },
  {
    value: "contains",
    label: "contains",
    requiresValue: true,
    fieldTypes: ["text", "any"],
  },
  {
    value: "not_contains",
    label: "does not contain",
    requiresValue: true,
    fieldTypes: ["text", "any"],
  },
  {
    value: "greater_than",
    label: "is greater than",
    requiresValue: true,
    fieldTypes: ["number"],
  },
  {
    value: "less_than",
    label: "is less than",
    requiresValue: true,
    fieldTypes: ["number"],
  },
  {
    value: "greater_or_equal",
    label: "is greater or equal to",
    requiresValue: true,
    fieldTypes: ["number"],
  },
  {
    value: "less_or_equal",
    label: "is less or equal to",
    requiresValue: true,
    fieldTypes: ["number"],
  },
  {
    value: "is_empty",
    label: "is empty",
    requiresValue: false,
    fieldTypes: ["text", "number", "date", "any"],
  },
  {
    value: "is_not_empty",
    label: "is not empty",
    requiresValue: false,
    fieldTypes: ["text", "number", "date", "any"],
  },
  {
    value: "is_true",
    label: "is checked",
    requiresValue: false,
    fieldTypes: ["boolean"],
  },
  {
    value: "is_false",
    label: "is not checked",
    requiresValue: false,
    fieldTypes: ["boolean"],
  },
];