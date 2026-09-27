import type { Field } from "./field";
import type { FormSettings } from "./form-settings";

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
  settings: FormSettings;
}