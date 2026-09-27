import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Layers, Palette } from "lucide-react";
import { useBuilderStore } from "./store/builder-store";
import { BuilderTopbar } from "./components/BuilderTopbar";
import { JsonOutputModal } from "./components/JsonOutputModal";
import { TemplatePickerModal } from "./components/TemplatePickerModal";
import { ShareModal } from "./components/ShareModal";
import { FieldPalette } from "./components/FieldPalette";
import { Canvas } from "./components/Canvas";
import { ConfigPanel } from "./components/ConfigPanel";
import { MultiStepTab } from "./components/config/MultiStepTab";
import { ThemeTab } from "./components/config/ThemeTab";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import type { Field, FieldType } from "@/types";

function findRowById(fields: Field[], rowId: string): Field | null {
  for (const f of fields) {
    if (f.id === rowId && f.type === "row") return f;
    if (f.children) {
      const found = findRowById(f.children, rowId);
      if (found) return found;
    }
  }
  return null;
}

function findParentRowId(fields: Field[], fieldId: string): string | null {
  for (const field of fields) {
    if (field.type === "row" && field.children) {
      if (field.children.some((c) => c.id === fieldId)) {
        return field.id;
      }
      const nested = findParentRowId(field.children, fieldId);
      if (nested) return nested;
    }
  }
  return null;
}

export function BuilderPage() {
  const {
    schema,
    selectedFieldId,
    loadFromJSON,
    addField,
    addFieldToRow,
    reorderFields,
    moveFieldToRow,
    removeField,
    undo,
    redo,
  } = useBuilderStore();

  const [jsonOpen, setJsonOpen] = useState(false);
  const [templateOpen, setTemplateOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [multiStepOpen, setMultiStepOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [activeDragType, setActiveDragType] = useState<FieldType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onSave: () => setJsonOpen(true),
    onDelete: () => {
      if (selectedFieldId) removeField(selectedFieldId);
    },
    onEscape: () => {
      useBuilderStore.getState().selectField(null);
    },
  });

  const checkRowCapacity = (rowId: string): boolean => {
    const row = findRowById(schema.fields, rowId);
    if (!row) return false;

    const currentCount = row.children?.length ?? 0;
    const maxColumns = row.columns ?? 2;

    if (currentCount >= maxColumns) {
      toast.error(
        `Row is full — max ${maxColumns} field${maxColumns !== 1 ? "s" : ""}`
      );
      return false;
    }
    return true;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.source === "palette") {
      setActiveDragType(data.type as FieldType);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);
    if (!over) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (activeData?.source === "palette") {
      const fieldType = activeData.type as FieldType;

      if (
        overData?.source === "canvas" &&
        overData?.type === "row" &&
        overData?.fieldId
      ) {
        const rowId = overData.fieldId as string;
        if (!checkRowCapacity(rowId)) return;
        addFieldToRow(rowId, fieldType);
        return;
      }

      if (overData?.source === "row" && overData?.fieldId) {
        const parentRowId = findParentRowId(
          schema.fields,
          overData.fieldId as string
        );
        if (parentRowId) {
          if (!checkRowCapacity(parentRowId)) return;
          addFieldToRow(parentRowId, fieldType);
          return;
        }
      }

      addField(fieldType);
      return;
    }

    if (
      activeData?.source === "canvas" &&
      activeData?.type !== "row" &&
      overData?.source === "canvas" &&
      overData?.type === "row" &&
      overData?.fieldId
    ) {
      const rowId = overData.fieldId as string;
      if (!checkRowCapacity(rowId)) return;
      moveFieldToRow(active.id as string, rowId);
      return;
    }

    if (
      activeData?.source === "row" &&
      overData?.source === "canvas" &&
      overData?.type === "row" &&
      overData?.fieldId
    ) {
      const rowId = overData.fieldId as string;
      if (!checkRowCapacity(rowId)) return;
      moveFieldToRow(active.id as string, rowId);
      return;
    }

    if (
      activeData?.source === "row" &&
      overData?.source === "canvas" &&
      overData?.type !== "row"
    ) {
      useBuilderStore.getState().moveFieldOutOfRow(active.id as string);
      return;
    }

    if (
      activeData?.source === "canvas" &&
      overData?.source === "canvas" &&
      active.id !== over.id &&
      activeData?.type !== "row" &&
      overData?.type !== "row"
    ) {
      const oldIndex = schema.fields.findIndex((f) => f.id === active.id);
      const newIndex = schema.fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
      return;
    }

    if (
      activeData?.source === "row" &&
      overData?.source === "row" &&
      active.id !== over.id
    ) {
      const parentRowId = findParentRowId(
        schema.fields,
        overData.fieldId as string
      );
      if (parentRowId) {
        useBuilderStore
          .getState()
          .reorderRowChildren(
            parentRowId,
            active.id as string,
            over.id as string
          );
      }
      return;
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background">
        <BuilderTopbar
          onOpenJson={() => setJsonOpen(true)}
          onOpenTemplates={() => setTemplateOpen(true)}
          onOpenShare={() => setShareOpen(true)}
          onOpenSteps={() => setMultiStepOpen(true)}
          onOpenTheme={() => setThemeOpen(true)}
        />

        <div className="flex-1 grid grid-cols-[260px_1fr_320px] overflow-hidden">
          <aside className="border-r bg-background overflow-hidden">
            <FieldPalette />
          </aside>

          <main className="overflow-y-auto bg-muted/20">
            <Canvas />
          </main>

          <aside className="border-l bg-background overflow-y-auto">
            <ConfigPanel />
          </aside>
        </div>

        <JsonOutputModal
          open={jsonOpen}
          onOpenChange={setJsonOpen}
          schema={schema}
        />

        <TemplatePickerModal
          open={templateOpen}
          onOpenChange={setTemplateOpen}
          onSelect={loadFromJSON}
        />

        <ShareModal
          open={shareOpen}
          onOpenChange={setShareOpen}
          schema={schema}
        />

        <Dialog open={multiStepOpen} onOpenChange={setMultiStepOpen}>
          <DialogContent
            className="!flex !flex-col max-w-md w-full p-0 gap-0 overflow-hidden"
            style={{
              maxHeight: "calc(100vh - 3rem)",
              height: "min(80vh, 600px)",
            }}
          >
            <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Multi-step Form
              </DialogTitle>
              <DialogDescription>
                Break your form into steps
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-hidden">
              <MultiStepTab />
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={themeOpen} onOpenChange={setThemeOpen}>
          <DialogContent
            className="!flex !flex-col max-w-md w-full p-0 gap-0 overflow-hidden"
            style={{
              maxHeight: "calc(100vh - 3rem)",
              height: "min(80vh, 700px)",
            }}
          >
            <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                Form Theme
              </DialogTitle>
              <DialogDescription>
                Customize form appearance
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 overflow-hidden">
              <ThemeTab onClose={() => setThemeOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeDragType && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md border bg-background shadow-lg ring-2 ring-primary/20">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-sm font-medium capitalize">
              {activeDragType}
            </span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}