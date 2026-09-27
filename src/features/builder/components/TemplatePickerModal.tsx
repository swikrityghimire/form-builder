import { useState, useMemo } from "react";
import { Sparkles, Search, X, Layout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModalShell } from "@/components/common/ModalShell";
import {
  templates,
  TEMPLATE_CATEGORIES
} from "@/lib/templates";
import type { FormSchema, TemplateCategory } from "@/types";
import { cn } from "@/lib/utils";

interface TemplatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (schema: FormSchema) => void;
}

export function TemplatePickerModal({
  open,
  onOpenChange,
  onSelect,
}: TemplatePickerModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<
    TemplateCategory | "All"
  >("All");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        !search.trim() ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || t.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  const handleSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (!template) return;
    onSelect(template.build());
    onOpenChange(false);
    setSearch("");
    setActiveCategory("All");
  };

  const clearFilters = () => {
    setSearch("");
    setActiveCategory("All");
  };

  const hasFilters = search.trim() || activeCategory !== "All";

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Choose a Template"
      description="Start with a preset form — customize as you like"
      icon={<Sparkles className="h-4 w-4 text-primary" />}
      maxWidth="max-w-5xl"
      height="min(90vh, 800px)"
      footer={
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>
            {filteredTemplates.length} template
            {filteredTemplates.length !== 1 ? "s" : ""} available
          </span>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear filters
            </Button>
          )}
        </div>
      }
    >
      {/* Search + Filters */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <Input
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9 h-9"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category badges — with wrap */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={activeCategory === "All" ? "default" : "outline"}
            className="cursor-pointer hover:opacity-80 transition-opacity font-normal whitespace-nowrap"
            onClick={() => setActiveCategory("All")}
          >
            All ({templates.length})
          </Badge>

          {TEMPLATE_CATEGORIES.map((cat) => {
            const count = templates.filter((t) => t.category === cat).length;
            if (count === 0) return null;
            return (
              <Badge
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity font-normal whitespace-nowrap"
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ({count})
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Templates grid — wider cards, more spacing */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16">
          <Layout className="h-10 w-10 text-neutral-400 mx-auto mb-3" />
          <p className="text-sm text-neutral-500">
            No templates match your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-2">
          {filteredTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelect(template.id)}
              className={cn(
                "text-left p-5 rounded-lg border-2 transition-all group min-h-[140px] flex flex-col",
                "border-neutral-200 dark:border-neutral-800",
                "bg-white dark:bg-neutral-900",
                "hover:border-neutral-400 dark:hover:border-neutral-600",
                "hover:shadow-md hover:-translate-y-0.5",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl shrink-0 leading-none">
                  {template.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 leading-tight mb-1">
                    {template.name}
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-[10px] h-5 font-normal px-1.5"
                  >
                    {template.category}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mt-auto">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      )}
    </ModalShell>
  );
}