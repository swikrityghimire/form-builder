import type { Field } from "@/types";

export function DividerField({ field }: { field: Field }) {
  return (
    <div className="py-3">
      <div className="border-t border-border" />
      {field.label && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          {field.label}
        </p>
      )}
    </div>
  );
}