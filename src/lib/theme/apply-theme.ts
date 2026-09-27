import type { FormTheme } from "@/types";
import { DEFAULT_THEME } from "@/types/form-theme";

export function getBorderRadius(radius: string): string {
  switch (radius) {
    case "none":
      return "0px";
    case "small":
      return "6px";
    case "medium":
      return "10px";
    case "large":
      return "16px";
    default:
      return "10px";
  }
}

export function getFontFamily(font: string): string {
  switch (font) {
    case "arial":
      return 'Arial, Helvetica, "Liberation Sans", sans-serif';
    case "times":
      return '"Times New Roman", Times, "Liberation Serif", serif';
    case "georgia":
      return 'Georgia, "Times New Roman", Times, serif';
    case "verdana":
      return 'Verdana, Geneva, "DejaVu Sans", sans-serif';
    case "courier":
      return '"Courier New", Courier, "Liberation Mono", monospace';
    case "trebuchet":
      return '"Trebuchet MS", "Lucida Grande", "Lucida Sans Unicode", sans-serif';
    case "tahoma":
      return 'Tahoma, Verdana, "DejaVu Sans", sans-serif';
    case "inter":
      return 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    case "roboto":
      return 'Roboto, "Helvetica Neue", Arial, sans-serif';
    case "poppins":
      return 'Poppins, "Segoe UI", Tahoma, sans-serif';
    case "serif":
      return 'Georgia, Cambria, "Times New Roman", Times, serif';
    case "mono":
      return '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", "Courier New", monospace';
    case "system":
    default:
      return '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
  }
}


export function getFormWidth(layout: string): string {
  return layout === "full-width" ? "100%" : "640px";
}

export function getThemeCssVars(
  theme: FormTheme | undefined
): React.CSSProperties {
  const t = { ...DEFAULT_THEME, ...theme };

  return {
    "--form-accent": t.accentColor,
    "--form-radius": getBorderRadius(t.borderRadius),
    "--form-font": getFontFamily(t.fontFamily),
    "--form-width": getFormWidth(t.layout),
  } as React.CSSProperties;
}

export function isMinimalPreset(theme: FormTheme | undefined): boolean {
  const t = { ...DEFAULT_THEME, ...theme };
  return t.preset === "minimal";
}

export function isPlayfulPreset(theme: FormTheme | undefined): boolean {
  const t = { ...DEFAULT_THEME, ...theme };
  return t.preset === "playful";
}

export function isCorporatePreset(theme: FormTheme | undefined): boolean {
  const t = { ...DEFAULT_THEME, ...theme };
  return t.preset === "corporate";
}