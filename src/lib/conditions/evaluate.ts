import type { ConditionRule } from "@/types/conditional";
import type { Field } from "@/types";
import { findFieldById } from "@/lib/field-tree";

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

function evaluateRule(
  rule: ConditionRule,
  formValues: Record<string, unknown>,
  allFields: Field[]
): boolean {
  // Look up the source field by ID
  const sourceField = findFieldById(allFields, rule.fieldId);

  if (!sourceField) {
    console.warn(`[Condition] Field not found for ID: ${rule.fieldId}`);
    return false;
  }

  //  Read value using field's NAME (not ID)
  const fieldValue = formValues[sourceField.name];
  const compareValue = rule.value;

  switch (rule.operator) {
    case "equals":
      return String(fieldValue ?? "") === String(compareValue ?? "");

    case "not_equals":
      return String(fieldValue ?? "") !== String(compareValue ?? "");

    case "contains":
      return String(fieldValue ?? "")
        .toLowerCase()
        .includes(String(compareValue ?? "").toLowerCase());

    case "not_contains":
      return !String(fieldValue ?? "")
        .toLowerCase()
        .includes(String(compareValue ?? "").toLowerCase());

    case "greater_than":
      return Number(fieldValue) > Number(compareValue);

    case "less_than":
      return Number(fieldValue) < Number(compareValue);

    case "greater_or_equal":
      return Number(fieldValue) >= Number(compareValue);

    case "less_or_equal":
      return Number(fieldValue) <= Number(compareValue);

    case "is_empty":
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case "is_not_empty":
      return !(
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );

    case "is_true":
      return fieldValue === true;

    case "is_false":
      return fieldValue === false;

    default:
      return true;
  }
}


// Check if a field should be visible based on its conditions. Requires access to ALL fields (for ID → Name resolution).
export function shouldShowField(
  field: Field,
  formValues: Record<string, unknown>,
  allFields: Field[]
): boolean {
  // No conditions → always visible
  if (
    !field.conditions ||
    !field.conditions.rules ||
    field.conditions.rules.length === 0
  ) {
    return true;
  }

  const { action, logic, rules } = field.conditions;

  // Evaluate all rules
  const results = rules.map((rule) =>
    evaluateRule(rule, formValues, allFields)
  );

  // Combine with AND / OR
  const matches =
    logic === "all"
      ? results.every(Boolean)
      : results.some(Boolean);

  // Apply action
  if (action === "show") {
    return matches;
  } else {
    return !matches;
  }
}


//  Filter visible fields.

export function filterVisibleFields(
  fields: Field[],
  formValues: Record<string, unknown>
): Field[] {
  const allFields = flattenFields(fields);
  return fields.filter((field) =>
    shouldShowField(field, formValues, allFields)
  );
}