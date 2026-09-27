import { useBuilderStore } from "../store/builder-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NativeSelect } from "@/components/ui/native-select";
import type { Field, FieldOption } from "@/types";
import { Plus, Trash2, Settings2, Layers } from "lucide-react";
import { ConditionsTab } from "./config/ConditionsTab";

interface PatternPreset {
  value: string;
  label: string;
  regex: string;
  example: string;
}

const PATTERN_PRESETS: PatternPreset[] = [
  { value: "none", label: "None", regex: "", example: "" },
  {
    value: "email",
    label: "Email Address",
    regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
    example: "user@example.com",
  },
  {
    value: "phone-np",
    label: "Phone (Nepal)",
    regex: "^(\\+977)?[9][6-8]\\d{8}$",
    example: "9800000000",
  },
  {
    value: "phone-intl",
    label: "Phone (International)",
    regex: "^\\+?[1-9]\\d{1,14}$",
    example: "+977 9800000000",
  },
  {
    value: "url",
    label: "Website URL",
    regex: "^https?:\\/\\/.+",
    example: "https://example.com",
  },
  {
    value: "numbers",
    label: "Numbers Only",
    regex: "^\\d+$",
    example: "12345",
  },
  { value: "letters", label: "Letters Only", regex: "^[A-Za-z]+$", example: "Hello" },
  {
    value: "alphanumeric",
    label: "Letters + Numbers",
    regex: "^[A-Za-z0-9]+$",
    example: "Hello123",
  },
  {
    value: "pin-np",
    label: "Postal Code (Nepal)",
    regex: "^\\d{5}$",
    example: "44600",
  },
  {
    value: "date-iso",
    label: "Date (YYYY-MM-DD)",
    regex: "^\\d{4}-\\d{2}-\\d{2}$",
    example: "2025-01-15",
  },
  {
    value: "time",
    label: "Time (HH:MM)",
    regex: "^([01]\\d|2[0-3]):[0-5]\\d$",
    example: "14:30",
  },
  {
    value: "custom",
    label: "Custom Pattern (advanced)",
    regex: "",
    example: "",
  },
];

function detectPreset(regex: string | undefined): string {
  if (!regex) return "none";
  const match = PATTERN_PRESETS.find(
    (p) => p.value !== "custom" && p.value !== "none" && p.regex === regex
  );
  return match ? match.value : "custom";
}

export function ConfigPanel() {
  const { schema, selectedFieldId, updateField } = useBuilderStore();

  const findField = (fields: Field[]): Field | undefined => {
    for (const f of fields) {
      if (f.id === selectedFieldId) return f;
      if (f.children) {
        const found = findField(f.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const field = selectedFieldId ? findField(schema.fields) : undefined;

  if (!field) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <div className="rounded-full bg-muted p-3 mb-3">
          <Settings2 className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">No field selected</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          Click a field on the canvas to configure it
        </p>
      </div>
    );
  }

  const isRow = field.type === "row";
  const isSection = field.type === "section";
  const isDivider = field.type === "divider";

  const hasPlaceholder = [
    "text",
    "textarea",
    "number",
    "email",
    "password",
    "tel",
    "url",
    "select",
  ].includes(field.type);

  const hasOptions = [
    "select",
    "radio",
    "checkbox-group",
    "multiselect",
  ].includes(field.type);

  const isTextLike = [
    "text",
    "textarea",
    "email",
    "password",
    "tel",
    "url",
  ].includes(field.type);

  const isNumberLike =
    field.type === "number" ||
    field.type === "slider" ||
    field.type === "rating";

  const isFileLike = field.type === "file" || field.type === "image";
  const isTextarea = field.type === "textarea";

  const currentPreset = detectPreset(field.validation?.pattern);
  const showCustomPattern = currentPreset === "custom";

  const handlePresetChange = (presetValue: string) => {
    const preset = PATTERN_PRESETS.find((p) => p.value === presetValue);
    if (!preset) return;

    if (presetValue === "none") {
      updateField(field.id, {
        validation: { ...field.validation, pattern: undefined },
      });
    } else if (presetValue === "custom") {
      updateField(field.id, {
        validation: {
          ...field.validation,
          pattern: field.validation?.pattern || "",
        },
      });
    } else {
      updateField(field.id, {
        validation: { ...field.validation, pattern: preset.regex },
      });
    }
  };

  const selectedPreset = PATTERN_PRESETS.find((p) => p.value === currentPreset);

  return (
    <div className="p-4 space-y-5 overflow-y-auto h-full">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">Field Settings</h3>
          <Badge variant="secondary" className="text-xs capitalize">
            {field.type}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isRow
            ? "Layout container — drag fields inside"
            : isSection
            ? "Section heading"
            : isDivider
            ? "Visual separator"
            : "Configure how this field appears"}
        </p>
      </div>

      <Separator />

      {isRow && (
        <>
          <div className="space-y-2">
            <Label htmlFor="row-columns">Columns</Label>
            <NativeSelect
              id="row-columns"
              value={String(field.columns ?? 2)}
              onChange={(e) =>
                updateField(field.id, {
                  columns: Number(e.target.value) as 2 | 3 | 4,
                })
              }
            >
              <option value="2">2 columns</option>
              <option value="3">3 columns</option>
              <option value="4">4 columns</option>
            </NativeSelect>
          </div>
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs">
              Fields: {field.children?.length ?? 0} / {field.columns ?? 2}
            </p>
          </div>
          <Separator />
        </>
      )}

      {isDivider && (
        <div className="rounded-md bg-muted/50 p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Divider has no extra options
          </p>
        </div>
      )}

      {!isDivider && (
        <div className="space-y-2">
          <Label htmlFor="field-label">
            {isSection ? "Section Title" : "Label"}
          </Label>
          <Input
            id="field-label"
            value={field.label}
            onChange={(e) => updateField(field.id, { label: e.target.value })}
          />
        </div>
      )}

      {hasPlaceholder && !isRow && (
        <div className="space-y-2">
          <Label htmlFor="field-placeholder">Placeholder</Label>
          <Input
            id="field-placeholder"
            value={field.placeholder ?? ""}
            onChange={(e) =>
              updateField(field.id, { placeholder: e.target.value })
            }
          />
        </div>
      )}

      {!isRow && !isDivider && (
        <div className="space-y-2">
          <Label htmlFor="field-description">Description</Label>
          <Textarea
            id="field-description"
            rows={2}
            value={field.description ?? ""}
            onChange={(e) =>
              updateField(field.id, { description: e.target.value })
            }
          />
        </div>
      )}

      {isTextarea && (
        <div className="space-y-2">
          <Label htmlFor="field-rows">Rows</Label>
          <Input
            id="field-rows"
            type="number"
            min={2}
            max={20}
            value={field.rows ?? 4}
            onChange={(e) =>
              updateField(field.id, {
                rows: Math.max(2, Number(e.target.value) || 4),
              })
            }
          />
        </div>
      )}

      {isFileLike && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              File Settings
            </h4>
            <div className="space-y-2">
              <Label>Accepted types</Label>
              <Input
                value={field.accept ?? ""}
                onChange={(e) =>
                  updateField(field.id, { accept: e.target.value })
                }
                placeholder="image/*, .pdf"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer text-sm">Allow multiple</Label>
              <Switch
                checked={field.multiple !== false}
                onCheckedChange={(v) => updateField(field.id, { multiple: v })}
              />
            </div>
          </div>
        </>
      )}

      {isNumberLike && !isRow && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {field.type === "rating" ? "Rating" : "Range"} Settings
            </h4>

            {field.type === "rating" ? (
              <div className="space-y-2">
                <Label htmlFor="field-max-rating">Maximum stars</Label>
                <NativeSelect
                  id="field-max-rating"
                  value={String(field.max ?? 5)}
                  onChange={(e) =>
                    updateField(field.id, { max: Number(e.target.value) })
                  }
                >
                  <option value="3">3 stars</option>
                  <option value="5">5 stars</option>
                  <option value="10">10 stars</option>
                </NativeSelect>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>Min</Label>
                    <Input
                      type="number"
                      value={field.min ?? ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          min: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max</Label>
                    <Input
                      type="number"
                      value={field.max ?? ""}
                      onChange={(e) =>
                        updateField(field.id, {
                          max: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>
                {field.type === "slider" && (
                  <div className="space-y-2">
                    <Label>Step</Label>
                    <Input
                      type="number"
                      min={0.01}
                      step={0.01}
                      value={field.step ?? 1}
                      onChange={(e) =>
                        updateField(field.id, {
                          step: Number(e.target.value) || 1,
                        })
                      }
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {isTextLike && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Validation
            </h4>
            <div className="space-y-2">
              <Label htmlFor="field-format">Format</Label>
              <NativeSelect
                id="field-format"
                value={currentPreset}
                onChange={(e) => handlePresetChange(e.target.value)}
              >
                {PATTERN_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </NativeSelect>
              {selectedPreset && selectedPreset.example && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <span className="shrink-0">Example:</span>
                  <code className="font-mono break-all text-foreground">
                    {selectedPreset.example}
                  </code>
                </div>
              )}
            </div>

            {showCustomPattern && (
              <div className="space-y-2 rounded-md bg-amber-500/10 border border-amber-500/30 p-3">
                <Label className="text-xs flex items-center gap-1.5">
                  <span className="text-amber-600 dark:text-amber-400">⚠️</span>
                  Custom Pattern (regex)
                </Label>
                <Input
                  value={field.validation?.pattern ?? ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        pattern: e.target.value || undefined,
                      },
                    })
                  }
                  placeholder="^[A-Z].*"
                  className="font-mono text-xs"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label>Min length</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.validation?.minLength ?? ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        minLength: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Max length</Label>
                <Input
                  type="number"
                  min={0}
                  value={field.validation?.maxLength ?? ""}
                  onChange={(e) =>
                    updateField(field.id, {
                      validation: {
                        ...field.validation,
                        maxLength: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}

      {hasOptions && (
        <>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Options
              </h4>
              <Badge variant="outline" className="text-xs">
                {field.options?.length ?? 0}
              </Badge>
            </div>
            <div className="space-y-2">
              {(field.options ?? []).map((opt, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={opt.label}
                    onChange={(e) => {
                      const newOptions = [...(field.options ?? [])];
                      newOptions[idx] = {
                        label: e.target.value,
                        value:
                          e.target.value.toLowerCase().replace(/\s+/g, "-") ||
                          `option-${idx + 1}`,
                      };
                      updateField(field.id, { options: newOptions });
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      const newOptions = (field.options ?? []).filter(
                        (_, i) => i !== idx
                      );
                      updateField(field.id, { options: newOptions });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  const newOptions: FieldOption[] = [
                    ...(field.options ?? []),
                    {
                      label: `Option ${(field.options?.length ?? 0) + 1}`,
                      value: `option-${(field.options?.length ?? 0) + 1}`,
                    },
                  ];
                  updateField(field.id, { options: newOptions });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
          </div>
        </>
      )}

      {!isRow && !isDivider && !isSection && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Field State
            </h4>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer text-sm">Required</Label>
              <Switch
                checked={!!field.required}
                onCheckedChange={(v) => updateField(field.id, { required: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="cursor-pointer text-sm">Disabled</Label>
              <Switch
                checked={!!field.disabled}
                onCheckedChange={(v) => updateField(field.id, { disabled: v })}
              />
            </div>
          </div>
        </>
      )}

      {schema.settings.multiStep?.enabled &&
        !isRow &&
        !isDivider &&
        !isSection && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                <Layers className="h-3.5 w-3.5" />
                Step
              </h4>
              <NativeSelect
                value={
                  field.stepId ?? schema.settings.multiStep.steps[0]?.id ?? ""
                }
                onChange={(e) =>
                  useBuilderStore
                    .getState()
                    .assignFieldToStep(field.id, e.target.value)
                }
              >
                {schema.settings.multiStep.steps.map((step, idx) => (
                  <option key={step.id} value={step.id}>
                    {idx + 1}. {step.title}
                  </option>
                ))}
              </NativeSelect>
            </div>
          </>
        )}

      {!isRow && !isDivider && (
        <>
          <Separator />
          <ConditionsTab field={field} />
        </>
      )}
    </div>
  );
}