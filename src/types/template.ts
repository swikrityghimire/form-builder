import type { FormSchema } from "./form-schema";

export type TemplateCategory = "Business" | "HR" | "Events" | "Feedback" | "Education" | "Personal" | "Contact";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: TemplateCategory;
  build: () => FormSchema;
}