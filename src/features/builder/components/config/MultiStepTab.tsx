import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useBuilderStore } from "../../store/builder-store";
import { cn } from "@/lib/utils";

export function MultiStepTab() {
  const {
    schema,
    enableMultiStep,
    disableMultiStep,
    addStep,
    updateStep,
    removeStep,
  } = useBuilderStore();

  const multiStep = schema.settings.multiStep;
  const enabled = multiStep?.enabled ?? false;
  const steps = multiStep?.steps ?? [];

  const handleToggle = (on: boolean) => {
    if (on) {
      enableMultiStep();
    } else {
      if (
        steps.length > 0 &&
        !confirm(
          "Disable multi-step? All fields will be merged into a single step."
        )
      ) {
        return;
      }
      disableMultiStep();
    }
  };

  const updateOption = (
    key: "showProgress" | "allowBackNavigation",
    value: boolean
  ) => {
    useBuilderStore.setState((state) => ({
      schema: {
        ...state.schema,
        settings: {
          ...state.schema.settings,
          multiStep: {
            ...state.schema.settings.multiStep!,
            [key]: value,
          },
        },
      },
    }));
  };

  return (
    <div className="p-6 space-y-5 overflow-y-auto h-full bg-white dark:bg-black text-neutral-900 dark:text-neutral-50">
      {/* Toggle */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border-2 p-4 transition-colors",
          enabled
            ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900"
            : "border-neutral-200 dark:border-neutral-800"
        )}
      >
        <div className="space-y-1">
          <Label className="text-sm font-semibold cursor-pointer">
            Enable multi-step
          </Label>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {enabled
              ? "Form is split into steps"
              : "Split form into multiple steps"}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => handleToggle(!enabled)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2",
            enabled ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-300 dark:bg-neutral-700"
          )}
        >
          <span
            className={cn(
              "pointer-events-none block h-5 w-5 rounded-full bg-white dark:bg-neutral-900 shadow-lg ring-0 transition-transform",
              enabled ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Steps (if enabled) */}
      {enabled && (
        <>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Steps
              </Label>
              <Badge variant="outline" className="text-xs font-normal">
                {steps.length}
              </Badge>
            </div>

            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-neutral-400 shrink-0" />
                    <div className="h-6 w-6 rounded-full bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center text-xs font-semibold text-white dark:text-neutral-900 shrink-0">
                      {index + 1}
                    </div>
                    <Input
                      value={step.title}
                      onChange={(e) =>
                        updateStep(step.id, { title: e.target.value })
                      }
                      placeholder="Step title"
                      className="h-8 flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
                      onClick={() => removeStep(step.id)}
                      disabled={steps.length <= 1}
                      title={
                        steps.length <= 1
                          ? "Cannot remove last step"
                          : "Remove step"
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={addStep}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Step
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
            <Label className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Options
            </Label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Show progress bar</span>
              <button
                type="button"
                role="switch"
                aria-checked={multiStep?.showProgress !== false}
                onClick={() =>
                  updateOption(
                    "showProgress",
                    multiStep?.showProgress === false
                  )
                }
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                  multiStep?.showProgress !== false
                    ? "bg-neutral-900 dark:bg-neutral-100"
                    : "bg-neutral-300 dark:bg-neutral-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform",
                    multiStep?.showProgress !== false
                      ? "translate-x-4"
                      : "translate-x-0"
                  )}
                />
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm">Allow back navigation</span>
              <button
                type="button"
                role="switch"
                aria-checked={multiStep?.allowBackNavigation !== false}
                onClick={() =>
                  updateOption(
                    "allowBackNavigation",
                    multiStep?.allowBackNavigation === false
                  )
                }
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
                  multiStep?.allowBackNavigation !== false
                    ? "bg-neutral-900 dark:bg-neutral-100"
                    : "bg-neutral-300 dark:bg-neutral-700"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none block h-4 w-4 rounded-full bg-white dark:bg-neutral-900 shadow transition-transform",
                    multiStep?.allowBackNavigation !== false
                      ? "translate-x-4"
                      : "translate-x-0"
                  )}
                />
              </button>
            </label>
          </div>

          <div className="rounded-md bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-3">
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              💡 <strong>Tip:</strong> Select a field on the canvas to assign
              it to a specific step.
            </p>
          </div>
        </>
      )}
    </div>
  );
}