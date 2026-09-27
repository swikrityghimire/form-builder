import type { Field } from "@/types";

export function SectionField({ field }: { field: Field }) {
  return (
    <div className="pt-4">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-foreground">
          {field.label}
        </h3>
        {field.description && (
          <p className="text-sm text-muted-foreground mt-0.5">
            {field.description}
          </p>
        )}
      </div>
    </div>
  );
}