import { create } from "zustand";
import type { FormSchema } from "@/types";

interface HistoryState {
  past: FormSchema[];
  present: FormSchema | null;
  future: FormSchema[];
  maxSize: number;

  // Actions
  push: (schema: FormSchema) => void;
  undo: () => FormSchema | null;
  redo: () => FormSchema | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],
  maxSize: 50, // Keep last 50 states

  push: (schema) => {
    const { past, present, maxSize } = get();

    // Skip if identical to current
    if (present && JSON.stringify(present) === JSON.stringify(schema)) {
      return;
    }

    const newPast = present
      ? [...past, present].slice(-maxSize)
      : past;

    set({
      past: newPast,
      present: schema,
      future: [], // Clear redo stack on new action
    });
  },

  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set({
      past: newPast,
      present: previous,
      future: present ? [present, ...future] : future,
    });

    return previous;
  },

  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    set({
      past: present ? [...past, present] : past,
      present: next,
      future: newFuture,
    });

    return next;
  },

  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  clear: () => set({ past: [], present: null, future: [] }),
}));