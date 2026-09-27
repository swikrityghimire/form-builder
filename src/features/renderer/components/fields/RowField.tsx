import { useWatch, useFormContext } from "react-hook-form";
import type { Field } from "@/types";
import { FieldRenderer } from "../FieldRenderer";
import { shouldShowField } from "@/lib/conditions/evaluate";

/**
 * Flatten all fields (recursive).
 */
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

export function RowField({ field }: { field: Field }) {
  const { control } = useFormContext();
  const watchedValues = useWatch({ control }) as
    | Record<string, unknown>
    | undefined;
  const formValues = watchedValues ?? {};

  if (!field.children || field.children.length === 0) {
    return (
      <div className="p-4 border border-dashed rounded-md text-sm text-muted-foreground text-center">
        Empty row — add fields in the builder
      </div>
    );
  }

  const columns = field.columns ?? 2;

  const gridClass =
    columns === 1
      ? "grid grid-cols-1 gap-4"
      : columns === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-4"
      : columns === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-4"
      : columns === 4
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 gap-4";

  // ⚠️ Need all fields for ID → Name lookup
  const allFields = flattenFields(field.children);

  // Filter children by conditions
  const visibleChildren = field.children.filter((child) =>
    shouldShowField(child, formValues, allFields)
  );

  if (visibleChildren.length === 0) return null;

  return (
    <div className={gridClass}>
      {visibleChildren.map((child) => (
        <div key={child.id} className="min-w-0">
          <FieldRenderer field={child} />
        </div>
      ))}
    </div>
  );
}