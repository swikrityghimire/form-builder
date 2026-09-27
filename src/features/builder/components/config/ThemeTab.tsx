/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  RotateCcw,
  AlignCenter,
  Maximize,
  Pipette,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { NativeSelect, NativeSelectOptGroup } from "@/components/ui/native-select";
import type { FormTheme } from "@/types";
import {
  DEFAULT_THEME,
  ACCENT_COLORS,
  FONT_OPTIONS,
} from "@/types/form-theme";
import { useBuilderStore } from "../../store/builder-store";
import { cn } from "@/lib/utils";
import { getFontFamily } from "@/lib/theme/apply-theme";
import { toast } from "sonner";

const PRESETS = [
  { value: "default", label: "Default", description: "Standard clean look" },
  { value: "minimal", label: "Minimal", description: "No borders, subtle" },
  { value: "rounded", label: "Rounded", description: "Soft, friendly corners" },
  { value: "playful", label: "Playful", description: "Vibrant, colorful" },
  {
    value: "corporate",
    label: "Corporate",
    description: "Professional, formal",
  },
] as const;

const FONT_GROUPS = FONT_OPTIONS.reduce(
  (groups, font) => {
    if (!groups[font.category]) groups[font.category] = [];
    groups[font.category].push(font);
    return groups;
  },
  {} as Record<string, typeof FONT_OPTIONS>
);

interface ThemeTabProps {
  onClose?: () => void;
}

export function ThemeTab({ onClose }: ThemeTabProps) {
  const { schema, updateTheme } = useBuilderStore();

  const savedTheme: FormTheme = {
    ...DEFAULT_THEME,
    ...(schema.settings.theme ?? {}),
  };

  const [draft, setDraft] = useState<FormTheme>(savedTheme);

  useEffect(() => {
    setDraft(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schema.id]);

  const hasChanges = JSON.stringify(draft) !== JSON.stringify(savedTheme);

  const updateDraft = (patch: Partial<FormTheme>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = () => {
    updateTheme(draft);
    toast.success("Theme saved");
    onClose?.();
  };

  const handleCancel = () => {
    setDraft(savedTheme);
    onClose?.();
  };

  const handleReset = () => {
    if (confirm("Reset theme to default? (not saved yet)")) {
      setDraft({ ...DEFAULT_THEME });
    }
  };

  const currentPreset = PRESETS.find((p) => p.value === draft.preset);
  const currentFont = FONT_OPTIONS.find((f) => f.value === draft.fontFamily);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-neutral-900 dark:text-neutral-50">
      {/* BODY */}
      <div
        style={{ flex: "1 1 0%", minHeight: 0, overflowY: "auto" }}
        className="p-6 space-y-5"
      >
        {/* Reset */}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Reset to default
          </Button>
        </div>

        {/* Preset — Native Select */}
        <div className="space-y-2">
          <Label htmlFor="theme-preset">Preset</Label>
          <NativeSelect
            id="theme-preset"
            value={draft.preset}
            onChange={(e) =>
              updateDraft({ preset: e.target.value as FormTheme["preset"] })
            }
          >
            {PRESETS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </NativeSelect>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {currentPreset?.description}
          </p>
        </div>

        <Separator />

        {/* Accent Color */}
        <div className="space-y-3">
          <Label>Accent Color</Label>

          <div className="grid grid-cols-5 gap-2">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => updateDraft({ accentColor: color.value })}
                className={cn(
                  "h-8 rounded-md border-2 transition-all hover:scale-110 cursor-pointer",
                  draft.accentColor.toLowerCase() === color.value.toLowerCase()
                    ? "border-neutral-900 dark:border-neutral-100 ring-2 ring-offset-1 ring-neutral-400"
                    : "border-transparent"
                )}
                style={{ backgroundColor: color.value }}
                title={color.label}
              />
            ))}
          </div>

          <div className="flex gap-2 items-stretch">
            <label
              className="relative h-9 w-9 rounded-md border-2 cursor-pointer overflow-hidden shrink-0 hover:scale-105 transition-transform group flex items-center justify-center"
              style={{ backgroundColor: draft.accentColor }}
              title="Click to pick a color"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Pipette className="h-4 w-4 text-white" />
              </div>
              <input
                type="color"
                value={draft.accentColor}
                onChange={(e) => updateDraft({ accentColor: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>

            <Input
              value={draft.accentColor}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                  updateDraft({ accentColor: val });
                }
              }}
              placeholder="#6366f1"
              className="font-mono text-xs h-9 flex-1"
              maxLength={7}
            />
          </div>
        </div>

        <Separator />

        {/* Border Radius */}
        <div className="space-y-2">
          <Label>Border Radius</Label>
          <div className="grid grid-cols-4 gap-2">
            {(["none", "small", "medium", "large"] as const).map((r) => {
              const labels = {
                none: "None",
                small: "S",
                medium: "M",
                large: "L",
              };
              const previewRadius = {
                none: "0px",
                small: "4px",
                medium: "8px",
                large: "14px",
              };
              const isActive = draft.borderRadius === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => updateDraft({ borderRadius: r })}
                  className={cn(
                    "flex flex-col items-center gap-2 py-3 rounded-md border-2 transition-all cursor-pointer",
                    isActive
                      ? "border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 ring-2 ring-offset-1 ring-neutral-400"
                      : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500"
                  )}
                >
                  <div
                    className="h-6 w-6 border-2 border-neutral-700 dark:border-neutral-300"
                    style={{ borderRadius: previewRadius[r] }}
                  />
                  <span className="text-xs font-medium">{labels[r]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Font — Native Select with optgroups */}
        <div className="space-y-2">
          <Label htmlFor="theme-font">Font</Label>
          <NativeSelect
            id="theme-font"
            value={draft.fontFamily}
            onChange={(e) =>
              updateDraft({
                fontFamily: e.target.value as FormTheme["fontFamily"],
              })
            }
          >
            {Object.entries(FONT_GROUPS).map(([category, fonts]) => (
              <NativeSelectOptGroup key={category} label={category}>
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </NativeSelectOptGroup>
            ))}
          </NativeSelect>

          <div
            className="rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-3 text-sm"
            style={{ fontFamily: getFontFamily(draft.fontFamily) }}
          >
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              {currentFont?.label} — preview
            </p>
            <p className="text-base">
              The quick brown fox jumps over the lazy dog. 1234567890
            </p>
          </div>
        </div>

        <Separator />

        {/* Layout */}
        <div className="space-y-2">
          <Label>Layout</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateDraft({ layout: "centered" })}
              className={cn(
                "flex flex-col items-center gap-2 py-3 rounded-md border-2 transition-all cursor-pointer",
                draft.layout === "centered"
                  ? "border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 ring-2 ring-offset-1 ring-neutral-400"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500"
              )}
            >
              <AlignCenter className="h-4 w-4" />
              <span className="text-xs font-medium">Centered</span>
              <span className="text-[10px] text-neutral-500">640px</span>
            </button>

            <button
              type="button"
              onClick={() => updateDraft({ layout: "full-width" })}
              className={cn(
                "flex flex-col items-center gap-2 py-3 rounded-md border-2 transition-all cursor-pointer",
                draft.layout === "full-width"
                  ? "border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-900 ring-2 ring-offset-1 ring-neutral-400"
                  : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500"
              )}
            >
              <Maximize className="h-4 w-4" />
              <span className="text-xs font-medium">Full Width</span>
              <span className="text-[10px] text-neutral-500">100%</span>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 flex items-center justify-between gap-2 shrink-0">
        <Button type="button" variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>

        <Button type="button" onClick={handleSave} disabled={!hasChanges}>
          <Save className="h-4 w-4 mr-2" />
          {hasChanges ? "Save Theme" : "No changes"}
        </Button>
      </div>
    </div>
  );
}