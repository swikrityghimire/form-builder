/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plus, Trash2, GitBranch, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Field } from "@/types";
import {
  OPERATORS,
  type ConditionOperator,
  type ConditionRule,
} from "@/types/conditional";
import { useBuilderStore } from "../../store/builder-store";

interface ConditionsTabProps {
  field: Field;
}

function collectOtherFields(
  fields: Field[],
  excludeId: string
): { id: string; label: string; type: string; options?: any[] }[] {
  const result: { id: string; label: string; type: string; options?: any[] }[] =
    [];

  for (const f of fields) {
    if (f.id === excludeId) continue;
    if (f.type === "section" || f.type === "divider") continue;
    if (f.type === "row") {
      if (f.children) {
        result.push(...collectOtherFields(f.children, excludeId));
      }
      continue;
    }
    result.push({
      id: f.id,
      label: f.label,
      type: f.type,
      options: f.options,
    });
  }

  return result;
}

function getSourceFieldType(fieldType: string): string {
  if (fieldType === "checkbox" || fieldType === "switch") return "boolean";
  if (fieldType === "number" || fieldType === "slider" || fieldType === "rating")
    return "number";
  if (fieldType === "date" || fieldType === "time" || fieldType === "datetime")
    return "date";
  if (
    fieldType === "select" ||
    fieldType === "radio" ||
    fieldType === "checkbox-group" ||
    fieldType === "multiselect"
  )
    return "choice";
  return "text";
}

export function ConditionsTab({ field }: ConditionsTabProps) {
  const { schema, updateField } = useBuilderStore();

  const otherFields = collectOtherFields(schema.fields, field.id);
  const conditions = field.conditions;

  const hasConditions = conditions && conditions.rules.length > 0;

  // Initialize conditions

  const initConditions = () => {
    if (!otherFields[0]) return;

    updateField(field.id, {
      conditions: {
        action: "show",
        logic: "all",
        rules: [
          {
            fieldId: otherFields[0].id,
            operator: "equals",
            value: "",
          },
        ],
      },
    });
  };

  // Update condition property

  const updateConditionMeta = (
    action: "show" | "hide",
    logic: "all" | "any"
  ) => {
    if (!conditions) return;
    updateField(field.id, {
      conditions: { ...conditions, action, logic },
    });
  };

  // Add rule

  const addRule = () => {
    if (!conditions || !otherFields[0]) return;

    updateField(field.id, {
      conditions: {
        ...conditions,
        rules: [
          ...conditions.rules,
          {
            fieldId: otherFields[0].id,
            operator: "equals",
            value: "",
          },
        ],
      },
    });
  };

  // Update rule

  const updateRule = (index: number, patch: Partial<ConditionRule>) => {
    if (!conditions) return;

    const newRules = [...conditions.rules];
    newRules[index] = { ...newRules[index], ...patch };

    updateField(field.id, {
      conditions: { ...conditions, rules: newRules },
    });
  };

  // Remove rule

  const removeRule = (index: number) => {
    if (!conditions) return;

    const newRules = conditions.rules.filter((_, i) => i !== index);

    if (newRules.length === 0) {
      // Remove conditions entirely
      updateField(field.id, { conditions: undefined });
    } else {
      updateField(field.id, {
        conditions: { ...conditions, rules: newRules },
      });
    }
  };

  // Remove all conditions

  const removeAllConditions = () => {
    updateField(field.id, { conditions: undefined });
  };

  // Render

  if (otherFields.length === 0) {
    return (
      <div className="rounded-md bg-muted/50 p-3 text-center">
        <AlertCircle className="h-4 w-4 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">
          Add other fields first to use conditional logic
        </p>
      </div>
    );
  }

  if (!hasConditions) {
    return (
      <div className="space-y-3">
        <div className="rounded-md bg-muted/50 p-3 text-center">
          <GitBranch className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-3">
            Show or hide this field based on other field values
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={initConditions}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Remove */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Conditions
          </h4>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-destructive"
          onClick={removeAllConditions}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Remove
        </Button>
      </div>

      {/* Action + Logic */}
      <div className="space-y-2 rounded-md border bg-muted/30 p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Action</Label>
            <Select
              value={conditions.action}
              onValueChange={(v) =>
                updateConditionMeta(v as "show" | "hide", conditions.logic)
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="show">Show</SelectItem>
                <SelectItem value="hide">Hide</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs">Match</Label>
            <Select
              value={conditions.logic}
              onValueChange={(v) =>
                updateConditionMeta(conditions.action, v as "all" | "any")
              }
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All rules (AND)</SelectItem>
                <SelectItem value="any">Any rule (OR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {conditions.action === "show"
            ? "Show this field when:"
            : "Hide this field when:"}
        </p>
      </div>

      {/* Rules list */}
      <div className="space-y-3">
        {conditions.rules.map((rule, index) => {
          const sourceField = otherFields.find((f) => f.id === rule.fieldId);
          const sourceType = sourceField
            ? getSourceFieldType(sourceField.type)
            : "text";

          // Filter operators based on source field type
          const validOperators = OPERATORS.filter(
            (op) =>
              op.fieldTypes.includes("any") ||
              op.fieldTypes.includes(sourceType as any)
          );

          const currentOperator = OPERATORS.find(
            (op) => op.value === rule.operator
          );
          const requiresValue = currentOperator?.requiresValue ?? false;

          return (
            <div
              key={index}
              className="rounded-md border bg-background p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  Rule {index + 1}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive"
                  onClick={() => removeRule(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              {/* Field selector */}
              <div className="space-y-1">
                <Label className="text-xs">Field</Label>
                <Select
                  value={rule.fieldId}
                  onValueChange={(v) =>
                    updateRule(index, { fieldId: v, value: "" })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {otherFields.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Operator */}
              <div className="space-y-1">
                <Label className="text-xs">Operator</Label>
                <Select
                  value={rule.operator}
                  onValueChange={(v) =>
                    updateRule(index, { operator: v as ConditionOperator })
                  }
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {validOperators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Value (conditional) */}
              {requiresValue && sourceField && (
                <div className="space-y-1">
                  <Label className="text-xs">Value</Label>

                  {/* If source is select/radio → dropdown of options */}
                  {sourceField.options && sourceField.options.length > 0 ? (
                    <Select
                      value={rule.value ?? ""}
                      onValueChange={(v) => updateRule(index, { value: v })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceField.options.map((opt: any) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : sourceType === "boolean" ? (
                    <Select
                      value={rule.value ?? "true"}
                      onValueChange={(v) => updateRule(index, { value: v })}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes / Checked</SelectItem>
                        <SelectItem value="false">No / Unchecked</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={sourceType === "number" ? "number" : "text"}
                      value={rule.value ?? ""}
                      onChange={(e) =>
                        updateRule(index, { value: e.target.value })
                      }
                      placeholder="Enter value"
                      className="h-8"
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add rule */}
      <Button
        variant="outline"
        size="sm"
        onClick={addRule}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Rule
      </Button>
    </div>
  );
}