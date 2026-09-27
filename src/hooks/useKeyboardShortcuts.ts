import { useEffect } from "react";

interface ShortcutOptions {
  onUndo?: () => void;
  onRedo?: () => void;
  onSave?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onSave,
  onDelete,
  onEscape,
  enabled = true,
}: ShortcutOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo: Cmd/Ctrl + Z (without Shift)
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Redo: Cmd/Ctrl + Shift + Z (or Ctrl + Y)
      if (
        (cmdOrCtrl && e.shiftKey && e.key === "z") ||
        (cmdOrCtrl && e.key === "y")
      ) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // Save: Cmd/Ctrl + S
      if (cmdOrCtrl && e.key === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }

      // Delete: Backspace or Delete (only if not in input)
      if (e.key === "Delete" || e.key === "Backspace") {
        const target = e.target as HTMLElement;
        const isInput =
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable;

        if (!isInput) {
          e.preventDefault();
          onDelete?.();
        }
        return;
      }

      // Escape
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [enabled, onUndo, onRedo, onSave, onDelete, onEscape]);
}