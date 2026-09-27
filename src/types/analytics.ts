import type { Field } from "./field";

export interface FieldStat {
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: Field["type"];
  total: number;
  answered: number;
  skipped: number;
  options?: { label: string; value: string; count: number; percentage: number }[];
  numeric?: { min: number; max: number; average: number; sum: number };
  textSamples?: string[];
}

export interface AnalyticsData {
  totalResponses: number;
  completionRate: number;
  avgTime?: number;
  firstResponse?: number;
  lastResponse?: number;
  fieldStats: FieldStat[];
  timeline: { date: string; count: number }[];
}