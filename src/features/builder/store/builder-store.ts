import { create } from "zustand";
import type { Field, FormSchema, FieldType, FormStep, FormTheme, MultiStepSettings } from "@/types";
import { generateId } from "@/lib/utils";
import { findRowById } from "@/lib/field-tree";
import { DEFAULT_FORM_SETTINGS } from "@/lib/constants";
import { DEFAULT_THEME } from "@/types/form-theme";
import { useHistoryStore } from "./history-store";

interface BuilderState {
  schema: FormSchema;
  selectedFieldId: string | null;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;

  addField: (type: FieldType) => void;
  addFieldToRow: (rowId: string, type: FieldType) => void;
  updateField: (id: string, patch: Partial<Field>) => void;
  removeField: (id: string) => void;
  duplicateField: (id: string) => void;
  reorderFields: (from: number, to: number) => void;

  addRow: (columns: 2 | 3 | 4) => void;
  moveFieldToRow: (fieldId: string, rowId: string) => void;
  moveFieldOutOfRow: (fieldId: string) => void;
  reorderRowChildren: (rowId: string, fromId: string, toId: string) => void;

  selectField: (id: string | null) => void;

  reset: () => void;
  loadFromJSON: (schema: FormSchema) => void;
  toJSON: () => FormSchema;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  enableMultiStep: () => void;
  disableMultiStep: () => void;
  toggleMultiStep: () => void;
  addStep: () => void;
  updateStep: (stepId: string, patch: Partial<FormStep>) => void;
  removeStep: (stepId: string) => void;
  assignFieldToStep: (fieldId: string, stepId: string) => void;
  reorderSteps: (from: number, to: number) => void;
  updateMultiStepSettings: (patch: Partial<Pick<MultiStepSettings, "showProgress" | "allowBackNavigation">>) => void;

  updateTheme: (patch: Partial<FormTheme>) => void;
  resetTheme: () => void;
}

function mapFieldTree(fields: Field[], transform: (field: Field) => Field): Field[] {
  return fields.map((field) => {
    const next = transform(field);
    return next.children ? { ...next, children: mapFieldTree(next.children, transform) } : next;
  });
}

function extractField(fields: Field[], id: string): { fields: Field[]; removed: Field | null } {
  let removed: Field | null = null;

  function walk(list: Field[]): Field[] {
    return list
      .filter((field) => {
        if (field.id === id) {
          removed = field;
          return false;
        }
        return true;
      })
      .map((field) => (field.children ? { ...field, children: walk(field.children) } : field));
  }

  return { fields: walk(fields), removed };
}

function insertIntoRow(fields: Field[], rowId: string, field: Field): Field[] {
  return fields.map((f) => {
    if (f.id === rowId && f.type === "row") {
      return { ...f, children: [...(f.children ?? []), field] };
    }
    return f.children ? { ...f, children: insertIntoRow(f.children, rowId, field) } : f;
  });
}

function collectFieldNames(fields: Field[], names = new Set<string>()): Set<string> {
  for (const field of fields) {
    if (field.name) names.add(field.name);
    if (field.children) collectFieldNames(field.children, names);
  }
  return names;
}

function makeUniqueFieldName(fields: Field[], baseName: string): string {
  const takenNames = collectFieldNames(fields);
  if (!takenNames.has(baseName)) return baseName;

  let counter = 2;
  while (takenNames.has(`${baseName}${counter}`)) counter++;
  return `${baseName}${counter}`;
}

function createEmptySchema(): FormSchema {
  return {
    id: generateId("form"),
    title: "Untitled Form",
    description: "",
    fields: [],
    settings: {
      ...DEFAULT_FORM_SETTINGS,
      theme: { ...DEFAULT_THEME },
    },
  };
}

function createDefaultField(type: FieldType): Field {
  const base: Field = {
    id: generateId("field"),
    type,
    label: "Untitled Field",
    name: "untitledField",
    placeholder: "",
    required: false,
  };

  switch (type) {
    case "text":
      base.label = "Text Field";
      base.name = "textField";
      break;
    case "textarea":
      base.label = "Message";
      base.name = "message";
      base.rows = 4;
      break;
    case "number":
      base.label = "Number";
      base.name = "number";
      break;
    case "email":
      base.label = "Email";
      base.name = "email";
      base.placeholder = "you@example.com";
      break;
    case "password":
      base.label = "Password";
      base.name = "password";
      break;
    case "tel":
      base.label = "Phone Number";
      base.name = "phone";
      base.placeholder = "+977 9800000000";
      break;
    case "url":
      base.label = "Website";
      base.name = "website";
      base.placeholder = "https://example.com";
      break;
    case "select":
      base.label = "Select";
      base.name = "select";
      base.options = [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
      ];
      break;
    case "radio":
      base.label = "Choose one";
      base.name = "chooseOne";
      base.options = [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
      ];
      break;
    case "checkbox":
      base.label = "I agree";
      base.name = "agree";
      break;
    case "checkbox-group":
      base.label = "Select all that apply";
      base.name = "selectAll";
      base.options = [
        { label: "Option 1", value: "option-1" },
        { label: "Option 2", value: "option-2" },
      ];
      break;
    case "date":
      base.label = "Date";
      base.name = "date";
      break;
    case "time":
      base.label = "Time";
      base.name = "time";
      break;
    case "datetime":
      base.label = "Date & Time";
      base.name = "dateTime";
      break;
    case "file":
      base.label = "Upload Files";
      base.name = "files";
      base.accept = "";
      base.multiple = true;
      break;
    case "image":
      base.label = "Upload Images";
      base.name = "images";
      base.accept = "image/*";
      base.multiple = true;
      break;
    case "rating":
      base.label = "Rate us";
      base.name = "rating";
      base.max = 5;
      break;
    case "slider":
      base.label = "Range";
      base.name = "range";
      base.min = 0;
      base.max = 100;
      base.step = 1;
      break;
    case "switch":
      base.label = "Enable option";
      base.name = "enableOption";
      break;
    case "row":
      base.label = "Row";
      base.name = "row";
      base.columns = 2;
      base.children = [];
      break;
    case "section":
      base.label = "Section Title";
      base.name = "section";
      break;
    case "divider":
      base.label = "";
      base.name = "divider";
      break;
  }

  return base;
}

// Every mutating action below goes through this instead of `set` directly,
// so every change also gets pushed onto the undo/redo history stack.
function withHistory(
  set: (partial: Partial<BuilderState> | ((state: BuilderState) => Partial<BuilderState>)) => void,
  updater: (state: BuilderState) => Partial<BuilderState>
) {
  set((state) => {
    const updates = updater(state);
    if (updates.schema) useHistoryStore.getState().push(updates.schema);
    return updates;
  });
}

export const useBuilderStore = create<BuilderState>()((set, get) => ({
  schema: createEmptySchema(),
  selectedFieldId: null,

  setTitle: (title) => withHistory(set, (state) => ({ schema: { ...state.schema, title } })),

  setDescription: (description) =>
    withHistory(set, (state) => ({ schema: { ...state.schema, description } })),

  addField: (type) =>
    withHistory(set, (state) => {
      const field = createDefaultField(type);
      field.name = makeUniqueFieldName(state.schema.fields, field.name);

      const multiStep = state.schema.settings.multiStep;
      if (multiStep?.enabled) field.stepId = multiStep.steps[0]?.id;

      return {
        schema: { ...state.schema, fields: [...state.schema.fields, field] },
        selectedFieldId: field.id,
      };
    }),

  addFieldToRow: (rowId, type) =>
    withHistory(set, (state) => {
      const targetRow = findRowById(state.schema.fields, rowId);
      if (!targetRow) return state;

      const isFull = (targetRow.children?.length ?? 0) >= (targetRow.columns ?? 2);
      if (isFull) return state;

      const field = createDefaultField(type);
      field.name = makeUniqueFieldName(state.schema.fields, field.name);

      const multiStep = state.schema.settings.multiStep;
      if (multiStep?.enabled) field.stepId = multiStep.steps[0]?.id;

      return {
        schema: { ...state.schema, fields: insertIntoRow(state.schema.fields, rowId, field) },
        selectedFieldId: field.id,
      };
    }),

  updateField: (id, patch) =>
    withHistory(set, (state) => {
      const fields = mapFieldTree(state.schema.fields, (field) =>
        field.id === id ? { ...field, ...patch } : field
      );
      return { schema: { ...state.schema, fields } };
    }),

  removeField: (id) =>
    withHistory(set, (state) => {
      const { fields } = extractField(state.schema.fields, id);
      return {
        schema: { ...state.schema, fields },
        selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
      };
    }),

  duplicateField: (id) =>
    withHistory(set, (state) => {
      const clone = (field: Field): Field => ({
        ...field,
        id: generateId("field"),
        label: field.label ? `${field.label} (copy)` : field.label,
        name: makeUniqueFieldName(state.schema.fields, `${field.name}Copy`),
        children: field.children?.map(clone),
      });

      const withDuplicate = (fields: Field[]): Field[] =>
        fields.flatMap((field) => {
          if (field.id === id) return [field, clone(field)];
          return field.children ? [{ ...field, children: withDuplicate(field.children) }] : [field];
        });

      return { schema: { ...state.schema, fields: withDuplicate(state.schema.fields) } };
    }),

  reorderFields: (from, to) =>
    withHistory(set, (state) => {
      const fields = [...state.schema.fields];
      if (from < 0 || to < 0 || from >= fields.length || to >= fields.length) return state;

      const [moved] = fields.splice(from, 1);
      fields.splice(to, 0, moved);
      return { schema: { ...state.schema, fields } };
    }),

  addRow: (columns) =>
    withHistory(set, (state) => {
      const row: Field = {
        id: generateId("row"),
        type: "row",
        label: "Row",
        name: `row_${state.schema.fields.length + 1}`,
        columns,
        children: [],
      };

      const multiStep = state.schema.settings.multiStep;
      if (multiStep?.enabled) row.stepId = multiStep.steps[0]?.id;

      return {
        schema: { ...state.schema, fields: [...state.schema.fields, row] },
        selectedFieldId: row.id,
      };
    }),

  moveFieldToRow: (fieldId, rowId) =>
    withHistory(set, (state) => {
      const targetRow = findRowById(state.schema.fields, rowId);
      if (!targetRow) return state;

      const alreadyInRow = targetRow.children?.some((child) => child.id === fieldId);
      const isFull = (targetRow.children?.length ?? 0) >= (targetRow.columns ?? 2);
      if (!alreadyInRow && isFull) return state;

      const { fields: withoutField, removed: movedField } = extractField(state.schema.fields, fieldId);
      if (!movedField) return state;

      return {
        schema: { ...state.schema, fields: insertIntoRow(withoutField, rowId, movedField) },
        selectedFieldId: movedField.id,
      };
    }),

  moveFieldOutOfRow: (fieldId) =>
    withHistory(set, (state) => {
      const { fields: withoutField, removed: movedField } = extractField(state.schema.fields, fieldId);
      if (!movedField) return state;

      return {
        schema: { ...state.schema, fields: [...withoutField, movedField] },
        selectedFieldId: movedField.id,
      };
    }),

  reorderRowChildren: (rowId, fromId, toId) =>
    withHistory(set, (state) => {
      const fields = mapFieldTree(state.schema.fields, (field) => {
        if (field.id !== rowId || field.type !== "row" || !field.children) return field;

        const children = [...field.children];
        const fromIndex = children.findIndex((c) => c.id === fromId);
        const toIndex = children.findIndex((c) => c.id === toId);
        if (fromIndex === -1 || toIndex === -1) return field;

        const [moved] = children.splice(fromIndex, 1);
        children.splice(toIndex, 0, moved);
        return { ...field, children };
      });

      return { schema: { ...state.schema, fields } };
    }),

  selectField: (id) => set({ selectedFieldId: id }),

  reset: () => {
    const schema = createEmptySchema();
    useHistoryStore.getState().push(schema);
    set({ schema, selectedFieldId: null });
  },

  loadFromJSON: (schema) => {
    useHistoryStore.getState().push(schema);
    set({ schema, selectedFieldId: null });
  },

  toJSON: () => get().schema,

  undo: () => {
    const previous = useHistoryStore.getState().undo();
    if (previous) set({ schema: previous, selectedFieldId: null });
  },

  redo: () => {
    const next = useHistoryStore.getState().redo();
    if (next) set({ schema: next, selectedFieldId: null });
  },

  canUndo: () => useHistoryStore.getState().canUndo(),
  canRedo: () => useHistoryStore.getState().canRedo(),

  enableMultiStep: () =>
    withHistory(set, (state) => {
      if (state.schema.settings.multiStep?.enabled) return state;

      const steps: FormStep[] = [
        { id: generateId("step"), title: "Step 1" },
        { id: generateId("step"), title: "Step 2" },
      ];

      const fields = mapFieldTree(state.schema.fields, (field) => ({
        ...field,
        stepId: field.stepId ?? steps[0].id,
      }));

      return {
        schema: {
          ...state.schema,
          settings: {
            ...state.schema.settings,
            multiStep: { enabled: true, showProgress: true, allowBackNavigation: true, steps },
          },
          fields,
        },
      };
    }),

  disableMultiStep: () =>
    withHistory(set, (state) => {
      const fields = mapFieldTree(state.schema.fields, (field) => ({ ...field, stepId: undefined }));

      return {
        schema: {
          ...state.schema,
          settings: {
            ...state.schema.settings,
            multiStep: { enabled: false, showProgress: true, allowBackNavigation: true, steps: [] },
          },
          fields,
        },
      };
    }),

  toggleMultiStep: () => {
    const state = get();
    if (state.schema.settings.multiStep?.enabled) {
      state.disableMultiStep();
    } else {
      state.enableMultiStep();
    }
  },

  addStep: () =>
    withHistory(set, (state) => {
      const multiStep = state.schema.settings.multiStep;
      if (!multiStep) return state;

      const step: FormStep = { id: generateId("step"), title: `Step ${multiStep.steps.length + 1}` };

      return {
        schema: {
          ...state.schema,
          settings: {
            ...state.schema.settings,
            multiStep: { ...multiStep, steps: [...multiStep.steps, step] },
          },
        },
      };
    }),

  updateStep: (stepId, patch) =>
    withHistory(set, (state) => {
      const multiStep = state.schema.settings.multiStep;
      if (!multiStep) return state;

      const steps = multiStep.steps.map((step) => (step.id === stepId ? { ...step, ...patch } : step));

      return {
        schema: { ...state.schema, settings: { ...state.schema.settings, multiStep: { ...multiStep, steps } } },
      };
    }),

  removeStep: (stepId) =>
    withHistory(set, (state) => {
      const multiStep = state.schema.settings.multiStep;
      if (!multiStep || multiStep.steps.length <= 1) return state;

      const steps = multiStep.steps.filter((step) => step.id !== stepId);
      const fallbackStepId = steps[0].id;

      const fields = mapFieldTree(state.schema.fields, (field) => ({
        ...field,
        stepId: field.stepId === stepId ? fallbackStepId : field.stepId,
      }));

      return {
        schema: {
          ...state.schema,
          settings: { ...state.schema.settings, multiStep: { ...multiStep, steps } },
          fields,
        },
      };
    }),

  assignFieldToStep: (fieldId, stepId) =>
    withHistory(set, (state) => {
      const fields = mapFieldTree(state.schema.fields, (field) =>
        field.id === fieldId ? { ...field, stepId } : field
      );
      return { schema: { ...state.schema, fields } };
    }),

  reorderSteps: (from, to) =>
    withHistory(set, (state) => {
      const multiStep = state.schema.settings.multiStep;
      if (!multiStep) return state;

      const steps = [...multiStep.steps];
      if (from < 0 || to < 0 || from >= steps.length || to >= steps.length) return state;

      const [moved] = steps.splice(from, 1);
      steps.splice(to, 0, moved);

      return {
        schema: { ...state.schema, settings: { ...state.schema.settings, multiStep: { ...multiStep, steps } } },
      };
    }),

  updateMultiStepSettings: (patch) =>
    withHistory(set, (state) => {
      const multiStep = state.schema.settings.multiStep;
      if (!multiStep) return state;

      return {
        schema: {
          ...state.schema,
          settings: { ...state.schema.settings, multiStep: { ...multiStep, ...patch } },
        },
      };
    }),

  updateTheme: (patch) =>
    withHistory(set, (state) => {
      const theme = { ...(state.schema.settings.theme ?? DEFAULT_THEME), ...patch };
      return { schema: { ...state.schema, settings: { ...state.schema.settings, theme } } };
    }),

  resetTheme: () =>
    withHistory(set, (state) => ({
      schema: { ...state.schema, settings: { ...state.schema.settings, theme: { ...DEFAULT_THEME } } },
    })),
}));