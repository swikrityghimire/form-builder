import type { Field } from "@/types";

export function findField(fields: Field[], predicate: (field: Field) => boolean): Field | undefined {
  for (const field of fields) {
    if (predicate(field)) return field;
    if (field.children) {
      const found = findField(field.children, predicate);
      if (found) return found;
    }
  }
  return undefined;
}

export function findFieldById(fields: Field[], id: string): Field | undefined {
  return findField(fields, (field) => field.id === id);
}

export function findRowById(fields: Field[], rowId: string): Field | undefined {
  return findField(fields, (field) => field.id === rowId && field.type === "row");
}