import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Copy,
  GripVertical,
  Trash2,
  Columns2,
  Columns3,
  ArrowUpFromLine,
} from "lucide-react";
import type { Field } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useBuilderStore } from "../store/builder-store";

// CanvasField and RowChildField are both draggable the same way - this
// wraps useSortable so neither has to rebuild the same style object.
function useDragHandle(id: string, data: Record<string, unknown>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    data,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return { attributes, listeners, setNodeRef, style, isDragging };
}

function DragHandle({
  attributes,
  listeners,
  className,
  iconClassName,
}: {
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <button
      {...listeners}
      {...attributes}
      onClick={(e) => e.stopPropagation()}
      className={cn("cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground", className)}
      aria-label="Drag to reorder"
    >
      <GripVertical className={iconClassName ?? "h-3.5 w-3.5"} />
    </button>
  );
}

interface CanvasFieldProps {
  field: Field;
  index: number;
}

export function CanvasField({ field, index }: CanvasFieldProps) {
  const { selectedFieldId, selectField, removeField, duplicateField, moveFieldOutOfRow } = useBuilderStore();
  const { attributes, listeners, setNodeRef, style, isDragging } = useDragHandle(field.id, {
    source: "canvas",
    fieldId: field.id,
    type: field.type,
  });

  const isSelected = selectedFieldId === field.id;
  const isRow = field.type === "row";

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectField(field.id)}
      className={cn(
        "group relative rounded-lg border bg-card transition-all",
        isRow ? "p-3" : "flex items-center gap-2 p-3",
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-sm"
          : "border-border hover:border-foreground/20 hover:shadow-xs",
        isDragging && "shadow-lg ring-2 ring-primary"
      )}
    >
      <DragHandle
        attributes={attributes}
        listeners={listeners}
        className={cn(
          "rounded flex items-center justify-center h-6 w-6 shrink-0 hover:bg-accent",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isSelected && "opacity-100"
        )}
      />

      <div
        className={cn(
          "h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-semibold shrink-0",
          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
        )}
      >
        {index + 1}
      </div>

      {isRow ? <RowContent field={field} /> : <FieldContent field={field} />}

      <div className={cn("flex gap-0.5 shrink-0 transition-opacity", "opacity-0 group-hover:opacity-100", isSelected && "opacity-100")}>
        {isRow && field.children && field.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              const firstChild = field.children![0];
              if (firstChild) moveFieldOutOfRow(firstChild.id);
            }}
            title="Move first field out"
          >
            <ArrowUpFromLine className="h-3.5 w-3.5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            duplicateField(field.id);
          }}
          title="Duplicate"
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            removeField(field.id);
          }}
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function FieldContent({ field }: { field: Field }) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium truncate flex-1">{field.label || "Untitled"}</div>
        {field.required && <span className="text-destructive text-xs font-bold shrink-0">*</span>}
      </div>
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <Badge variant="secondary" className="text-[10px] h-4 px-1.5 capitalize font-normal">
          {field.type}
        </Badge>
        {field.options && field.options.length > 0 && (
          <span className="text-[10px] text-muted-foreground">{field.options.length} options</span>
        )}
        {field.multiple && <span className="text-[10px] text-muted-foreground">multiple</span>}
      </div>
    </div>
  );
}

function RowContent({ field }: { field: Field }) {
  const children = field.children ?? [];
  const columns = field.columns ?? 2;

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        {columns <= 2 ? (
          <Columns2 className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Columns3 className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-xs font-medium text-muted-foreground">
          Row · {columns} column{columns !== 1 ? "s" : ""}
        </span>
        <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-auto font-normal">
          {children.length}/{columns}
        </Badge>
      </div>

      {children.length === 0 ? (
        <div className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground bg-muted/20">
          Drop fields here
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: "0.5rem" }}>
          {children.map((child) => (
            <RowChildField key={child.id} field={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function RowChildField({ field }: { field: Field }) {
  const { selectedFieldId, selectField, removeField } = useBuilderStore();
  const { attributes, listeners, setNodeRef, style } = useDragHandle(field.id, {
    source: "row",
    fieldId: field.id,
    type: field.type,
  });

  const isSelected = selectedFieldId === field.id;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        selectField(field.id);
      }}
      className={cn(
        "group/child relative flex items-center gap-1.5 p-2 rounded-md border bg-background cursor-pointer transition-all min-w-0",
        isSelected ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-foreground/20"
      )}
    >
      <DragHandle
        attributes={attributes}
        listeners={listeners}
        className="p-0.5 rounded shrink-0 opacity-0 group-hover/child:opacity-100"
        iconClassName="h-3 w-3"
      />

      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{field.label || "Untitled"}</div>
        <div className="text-[10px] text-muted-foreground capitalize truncate">{field.type}</div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 opacity-0 group-hover/child:opacity-100 text-destructive shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
}