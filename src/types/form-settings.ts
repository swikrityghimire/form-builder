import type { FormTheme } from "./form-theme";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
}

export interface MultiStepSettings {
  enabled: boolean;
  showProgress: boolean;
  allowBackNavigation: boolean;
  steps: FormStep[];
}

export interface FormSettings {
  submitLabel: string;
  successMessage: string;
  redirectUrl?: string;
  multiStep?: MultiStepSettings;
  theme?: FormTheme;
}