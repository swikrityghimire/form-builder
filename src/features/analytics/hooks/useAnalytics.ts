/* eslint-disable react-hooks/purity */
import { useMemo } from "react";
import type { Field, FormSchema, Submission, FieldStat, AnalyticsData } from "@/types";

// Helpers

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

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (value === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (value instanceof FileList && value.length === 0) return true;
  return false;
}

// Main hook

export function useAnalytics(
  schema: FormSchema | null,
  submissions: Submission[]
): AnalyticsData | null {
  return useMemo(() => {
    if (!schema) return null;

    const allFields = flattenFields(schema.fields);
    const total = submissions.length;

    if (total === 0) {
      return {
        totalResponses: 0,
        completionRate: 0,
        fieldStats: [],
        timeline: [],
      };
    }

    // Per-field statistics
 
    const fieldStats: FieldStat[] = allFields.map((field) => {
      const values = submissions.map((sub) => sub.data[field.name]);
      const answered = values.filter((v) => !isEmpty(v)).length;
      const skipped = total - answered;

      const stat: FieldStat = {
        fieldId: field.id,
        fieldName: field.name,
        fieldLabel: field.label,
        fieldType: field.type,
        total,
        answered,
        skipped,
      };

      // Choice fields (select, radio, checkbox-group) 
      if (
        (field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox-group" ||
          field.type === "multiselect") &&
        field.options
      ) {
        const counts: Record<string, number> = {};
        field.options.forEach((opt) => {
          counts[opt.value] = 0;
        });

        values.forEach((v) => {
          if (isEmpty(v)) return;
          if (Array.isArray(v)) {
            v.forEach((item) => {
              if (typeof item === "string" && item in counts) {
                counts[item]++;
              }
            });
          } else if (typeof v === "string" && v in counts) {
            counts[v]++;
          }
        });

        stat.options = field.options.map((opt) => ({
          label: opt.label,
          value: opt.value,
          count: counts[opt.value] || 0,
          percentage:
            answered > 0
              ? Math.round((counts[opt.value] / answered) * 100)
              : 0,
        }));
      }

      //Numeric fields (number, slider, rating)
      if (
        field.type === "number" ||
        field.type === "slider" ||
        field.type === "rating"
      ) {
        const validNumbers = values
          .filter((v) => !isEmpty(v))
          .map((v) => Number(v))
          .filter((n) => !isNaN(n));

        if (validNumbers.length > 0) {
          stat.numeric = {
            min: Math.min(...validNumbers),
            max: Math.max(...validNumbers),
            average:
              Math.round(
                (validNumbers.reduce((a, b) => a + b, 0) /
                  validNumbers.length) *
                  100
              ) / 100,
            sum: validNumbers.reduce((a, b) => a + b, 0),
          };
        }
      }

      //  Text fields (show samples) 
      if (
        field.type === "text" ||
        field.type === "textarea" ||
        field.type === "email"
      ) {
        stat.textSamples = values
          .filter((v) => !isEmpty(v))
          .slice(0, 5)
          .map((v) => String(v).slice(0, 100));
      }

      return stat;
    });

    // Completion rate

    const totalPossible = allFields.length * total;
    const totalAnswered = fieldStats.reduce(
      (sum, s) => sum + s.answered,
      0
    );
    const completionRate =
      totalPossible > 0
        ? Math.round((totalAnswered / totalPossible) * 100)
        : 0;

    // Timeline (last 30 days)

    const timelineMap: Record<string, number> = {};
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Initialize all dates with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      timelineMap[key] = 0;
    }

    submissions.forEach((sub) => {
      if (sub.timestamp >= thirtyDaysAgo) {
        const key = new Date(sub.timestamp).toISOString().slice(0, 10);
        if (key in timelineMap) {
          timelineMap[key]++;
        }
      }
    });

    const timeline = Object.entries(timelineMap).map(([date, count]) => ({
      date,
      count,
    }));

    // First / last response

    const timestamps = submissions
      .map((s) => s.timestamp)
      .sort((a, b) => a - b);

    return {
      totalResponses: total,
      completionRate,
      firstResponse: timestamps[0],
      lastResponse: timestamps[timestamps.length - 1],
      fieldStats,
      timeline,
    };
  }, [schema, submissions]);
}