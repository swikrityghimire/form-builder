export const APP_NAME = "FormCraft";
export const APP_DESCRIPTION = "Build beautiful forms without code";

export const STORAGE_KEYS = {
  builderDraft: "fc_builder_draft",
} as const;

export const DEFAULT_FORM_SETTINGS = {
  submitLabel: "Submit",
  successMessage: "Thanks! Your response has been recorded.",
  multiStep: {
    enabled: false,
    showProgress: true,
    allowBackNavigation: true,
    steps: [],
  },
};

export const MOCK_API_DELAY = 150;