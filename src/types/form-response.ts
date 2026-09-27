export interface Submission {
  id: string;
  timestamp: number;
  data: Record<string, unknown>;
}