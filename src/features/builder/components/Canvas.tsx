import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useBuilderStore } from "../store/builder-store";
import { CanvasField } from "./CanvasField";
import { EmptyState } from "@/components/common/EmptyState";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Canvas() {
  const { schema, addField } = useBuilderStore();

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-drop-zone",
    data: { source: "canvas" },
  });

  if (schema.fields.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "h-full flex items-center justify-center p-10 transition-colors",
          isOver && "bg-primary/5"
        )}
      >
        <EmptyState
          icon={FileText}
          title="Your canvas is empty"
          description="Click a field from the left palette or drag one here."
          action={
            <Button
              variant="outline"
              onClick={() => addField("text")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add first field
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "p-6 max-w-3xl mx-auto space-y-2 min-h-full transition-colors",
        isOver && "bg-primary/5"
      )}
    >
      <SortableContext
        items={schema.fields.map((f) => f.id)}
        strategy={verticalListSortingStrategy}
      >
        {schema.fields.map((field, index) => (
          <div
            key={field.id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
          >
            <CanvasField field={field} index={index} />
          </div>
        ))}
      </SortableContext>

      {/* Drop hint */}
      {isOver && (
        <div className="rounded-lg border-2 border-dashed border-primary bg-primary/5 p-4 text-center text-sm text-primary">
          Drop here to add
        </div>
      )}
    </div>
  );
}