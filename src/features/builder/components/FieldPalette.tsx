import { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Search,
  X,
  Type,
  AlignLeft,
  Hash,
  Mail,
  Phone,
  Link as LinkIcon,
  Lock,
  ChevronDown,
  Circle,
  CheckSquare,
  ListChecks,
  Calendar,
  Clock,
  Upload,
  Star,
  Sliders as SliderIcon,
  ToggleLeft,
  Heading,
  Minus,
  Columns2,
  Columns3,
  Columns4,
} from "lucide-react";
import { useBuilderStore } from "../store/builder-store";
import type { FieldType } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FieldItem {
  type: FieldType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FIELD_GROUPS: { title: string; items: FieldItem[] }[] = [
  {
    title: "Text Input",
    items: [
      { type: "text", label: "Text", icon: Type },
      { type: "textarea", label: "Textarea", icon: AlignLeft },
      { type: "number", label: "Number", icon: Hash },
      { type: "email", label: "Email", icon: Mail },
      { type: "password", label: "Password", icon: Lock },
      { type: "tel", label: "Phone", icon: Phone },
      { type: "url", label: "URL", icon: LinkIcon },
    ],
  },
  {
    title: "Choice",
    items: [
      { type: "select", label: "Select", icon: ChevronDown },
      { type: "radio", label: "Radio", icon: Circle },
      { type: "checkbox", label: "Checkbox", icon: CheckSquare },
      { type: "checkbox-group", label: "Checkbox Group", icon: ListChecks },
    ],
  },
  {
    title: "Date & Time",
    items: [
      { type: "date", label: "Date", icon: Calendar },
      { type: "time", label: "Time", icon: Clock },
      { type: "datetime", label: "Date & Time", icon: Calendar },
    ],
  },
  {
    title: "Advanced",
    items: [
      { type: "rating", label: "Rating", icon: Star },
      { type: "slider", label: "Slider", icon: SliderIcon },
      { type: "switch", label: "Switch", icon: ToggleLeft },
    ],
  },
  {
    title: "Media",
    items: [{ type: "file", label: "File Upload", icon: Upload }],
  },
  {
    title: "Layout",
    items: [
      { type: "section", label: "Section", icon: Heading },
      { type: "divider", label: "Divider", icon: Minus },
    ],
  },
];

function DraggablePaletteItem({ item }: { item: FieldItem }) {
  const addField = useBuilderStore((s) => s.addField);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${item.type}`,
    data: { source: "palette", type: item.type },
  });

  const Icon = item.icon;

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => addField(item.type)}
      className={cn(
        "group w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        "text-left cursor-grab active:cursor-grabbing",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        isDragging && "opacity-50"
      )}
      title="Click to add, or drag to canvas"
    >
      <div className="flex items-center justify-center h-7 w-7 rounded-md bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <span className="flex-1 truncate">{item.label}</span>
    </button>
  );
}

function RowLayoutButton({
  columns,
  icon: Icon,
  label,
}: {
  columns: 2 | 3 | 4;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  const addRow = useBuilderStore((s) => s.addRow);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => addRow(columns)}
      className="w-full justify-start gap-2 font-normal h-9"
    >
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      {label}
    </Button>
  );
}

export function FieldPalette() {
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return FIELD_GROUPS;

    const q = search.toLowerCase();
    return FIELD_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [search]);

  const totalResults = filteredGroups.reduce(
    (sum, g) => sum + g.items.length,
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Add Fields
          </h3>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search fields..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-8 h-8 text-xs"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto">
        {totalResults === 0 ? (
          <div className="p-6 text-center">
            <Search className="h-6 w-6 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              No fields match "{search}"
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-4">
            {filteredGroups.map((group) => (
              <div key={group.title}>
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                  {group.title}
                </h4>
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <DraggablePaletteItem key={item.type} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {/* Row Layout section */}
            {!search && (
              <div className="pt-2 border-t">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-1.5">
                  Row Layout
                </h4>
                <div className="space-y-1.5">
                  <RowLayoutButton
                    columns={2}
                    icon={Columns2}
                    label="2 Columns"
                  />
                  <RowLayoutButton
                    columns={3}
                    icon={Columns3}
                    label="3 Columns"
                  />
                  <RowLayoutButton
                    columns={4}
                    icon={Columns4}
                    label="4 Columns"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t shrink-0">
        <p className="text-[10px] text-muted-foreground text-center">
          Click to add · Drag to canvas
        </p>
      </div>
    </div>
  );
}