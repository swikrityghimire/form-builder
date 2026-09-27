import Papa from "papaparse";
import type { FormSchema, Field } from "@/types";
import type { Submission } from "@/types";

function flattenFields(fields: Field[]): Field[] {
  const result: Field[] = [];
  for (const f of fields) {
    if (f.type === "row" && f.children) {
      result.push(...flattenFields(f.children));
    } else if (f.type !== "section" && f.type !== "divider") {
      result.push(f);
    }
  }
  return result;
}

export function responsesToCSV(
  schema: FormSchema,
  submissions: Submission[]
): string {
  const allFields = flattenFields(schema.fields);

  const headers = [
    "Response #",
    "Submitted At",
    ...allFields.map((f) => f.label),
  ];

  // Build data rows
  const rows = submissions.map((sub, index) => {
    const responseNum = submissions.length - index;
    const submittedAt = new Date(sub.timestamp).toLocaleString();

    const fieldValues = allFields.map((field) => {
      const value = sub.data[field.name];

      if (value === undefined || value === null || value === "") {
        return "";
      }

      if (Array.isArray(value)) {
        return value.join(", ");
      }

      if (value instanceof FileList) {
        return `${value.length} file(s)`;
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      if (typeof value === "boolean") {
        return value ? "Yes" : "No";
      }

      return String(value);
    });

    return [responseNum, submittedAt, ...fieldValues];
  });

  return Papa.unparse([headers, ...rows]);
}
export function downloadResponsesCSV(
  schema: FormSchema,
  submissions: Submission[]
): void {
  const csv = responsesToCSV(schema, submissions);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${
    schema.title.replace(/\s+/g, "-").toLowerCase() || "form"
  }-responses.csv`;
  a.click();
  URL.revokeObjectURL(url);
}