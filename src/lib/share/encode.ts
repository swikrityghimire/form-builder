import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import type { FormSchema } from "@/types";

export function encodeFormToUrl(schema: FormSchema): string {
  const json = JSON.stringify(schema);
  return compressToEncodedURIComponent(json);
}

export function decodeFormFromUrl(encoded: string): FormSchema | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;

    const schema = JSON.parse(json) as FormSchema;

    if (!schema || typeof schema !== "object") return null;
    if (!schema.title || !Array.isArray(schema.fields)) return null;

    return schema;
  } catch {
    return null;
  }
}

export function generateShareUrl(schema: FormSchema): string {
  const encoded = encodeFormToUrl(schema);
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/f#${encoded}`;
}

export function readFormFromCurrentUrl(): FormSchema | null {
  if (typeof window === "undefined") return null;
  const hash = window.location.hash.replace(/^#/, "");
  if (!hash) return null;
  return decodeFormFromUrl(hash);
}