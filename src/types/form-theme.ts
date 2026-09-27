export type ThemePreset =
  | "default"
  | "minimal"
  | "rounded"
  | "playful"
  | "corporate";

export type BorderRadius = "none" | "small" | "medium" | "large";

export type FontFamily =
  | "system"
  | "arial"
  | "times"
  | "georgia"
  | "verdana"
  | "courier"
  | "trebuchet"
  | "tahoma"
  | "inter"
  | "roboto"
  | "poppins"
  | "serif"
  | "mono";

export type FormLayout = "centered" | "full-width";

export interface FormTheme {
  preset: ThemePreset;
  accentColor: string;
  borderRadius: BorderRadius;
  fontFamily: FontFamily;
  layout: FormLayout;
}

export const DEFAULT_THEME: FormTheme = {
  preset: "default",
  accentColor: "#6366f1",
  borderRadius: "medium",
  fontFamily: "system",
  layout: "centered",
};

export interface FontInfo {
  value: FontFamily;
  label: string;
  category: "System" | "Sans-serif" | "Serif" | "Monospace" | "Modern";
  preview: string;
}

export const FONT_OPTIONS: FontInfo[] = [
  {
    value: "system",
    label: "System (default)",
    category: "System",
    preview: "Quick brown fox",
  },
  {
    value: "inter",
    label: "Inter",
    category: "Modern",
    preview: "Quick brown fox",
  },
  {
    value: "roboto",
    label: "Roboto",
    category: "Modern",
    preview: "Quick brown fox",
  },
  {
    value: "poppins",
    label: "Poppins",
    category: "Modern",
    preview: "Quick brown fox",
  },
  {
    value: "arial",
    label: "Arial",
    category: "Sans-serif",
    preview: "Quick brown fox",
  },
  {
    value: "verdana",
    label: "Verdana",
    category: "Sans-serif",
    preview: "Quick brown fox",
  },
  {
    value: "tahoma",
    label: "Tahoma",
    category: "Sans-serif",
    preview: "Quick brown fox",
  },
  {
    value: "trebuchet",
    label: "Trebuchet MS",
    category: "Sans-serif",
    preview: "Quick brown fox",
  },
  {
    value: "times",
    label: "Times New Roman",
    category: "Serif",
    preview: "Quick brown fox",
  },
  {
    value: "georgia",
    label: "Georgia",
    category: "Serif",
    preview: "Quick brown fox",
  },
  {
    value: "serif",
    label: "Serif (generic)",
    category: "Serif",
    preview: "Quick brown fox",
  },
  {
    value: "courier",
    label: "Courier New",
    category: "Monospace",
    preview: "Quick brown fox",
  },
  {
    value: "mono",
    label: "Monospace (generic)",
    category: "Monospace",
    preview: "Quick brown fox",
  },
];

export interface ThemePresetInfo {
  value: ThemePreset;
  label: string;
  description: string;
}

export const THEME_PRESETS: ThemePresetInfo[] = [
  {
    value: "default",
    label: "Default",
    description: "Standard clean look",
  },
  {
    value: "minimal",
    label: "Minimal",
    description: "No borders, subtle",
  },
  {
    value: "rounded",
    label: "Rounded",
    description: "Soft, friendly corners",
  },
  {
    value: "playful",
    label: "Playful",
    description: "Vibrant, colorful",
  },
  {
    value: "corporate",
    label: "Corporate",
    description: "Professional, formal",
  },
];

export const ACCENT_COLORS = [
  { label: "Indigo", value: "#6366f1" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Emerald", value: "#10b981" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Purple", value: "#a855f7" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Pink", value: "#ec4899" },
  { label: "Slate", value: "#64748b" },
];