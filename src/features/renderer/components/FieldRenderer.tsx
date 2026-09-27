import type { Field } from "@/types";
import { TextField } from "./fields/TextField";
import { TextareaField } from "./fields/TextareaField";
import { NumberField } from "./fields/NumberField";
import { SelectField } from "./fields/SelectField";
import { RadioField } from "./fields/RadioField";
import { CheckboxField } from "./fields/CheckboxField";
import { DateField } from "./fields/DateField";
import { FileField } from "./fields/FileField";
import { RowField } from "./fields/RowField";
import { RatingField } from "./fields/RatingField";
import { SliderField } from "./fields/SliderField";
import { SwitchField } from "./fields/SwitchField";
import { TimeField } from "./fields/TimeField";
import { CheckboxGroupField } from "./fields/CheckboxGroupField";
import { SectionField } from "./fields/SectionField";
import { DividerField } from "./fields/DividerField";

type FieldComponent = React.ComponentType<{ field: Field }>;

const fieldMap: Partial<Record<Field["type"], FieldComponent>> = {
  // Text
  text: TextField,
  email: TextField,
  password: TextField,
  tel: TextField,
  url: TextField,
  textarea: TextareaField,
  number: NumberField,

  // Choice
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  "checkbox-group": CheckboxGroupField,

  // Date / Time
  date: DateField,
  time: TimeField,
  datetime: TimeField,

  // Files
  file: FileField,
  image: FileField,

  // Advanced
  rating: RatingField,
  slider: SliderField,
  switch: SwitchField,

  // Layout
  row: RowField,
  section: SectionField,
  divider: DividerField,
};

export function FieldRenderer({ field }: { field: Field }) {
  const Component = fieldMap[field.type];

  if (!Component) {
    return (
      <div className="p-3 border border-dashed rounded text-xs text-muted-foreground">
        Field type "{field.type}" not supported yet
      </div>
    );
  }

  return <Component field={field} />;
}