import { Undo2, Redo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBuilderStore } from "../store/builder-store";
import { useHistoryStore } from "../store/history-store";

export function UndoRedoButtons() {
  const undo = useBuilderStore((s) => s.undo);
  const redo = useBuilderStore((s) => s.redo);
  const past = useHistoryStore((s) => s.past);
  const future = useHistoryStore((s) => s.future);

  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");
  const modKey = isMac ? "⌘" : "Ctrl";

  const undoTitle = canUndo
    ? `Undo (${past.length}) — ${modKey}Z`
    : `Nothing to undo — ${modKey}Z`;

  const redoTitle = canRedo
    ? `Redo (${future.length}) — ${modKey}⇧Z`
    : `Nothing to redo — ${modKey}⇧Z`;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
        title={undoTitle}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
        title={redoTitle}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}