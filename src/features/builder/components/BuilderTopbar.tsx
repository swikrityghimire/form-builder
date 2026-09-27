import {
  Code2,
  RotateCcw,
  Layout,
  Sparkles,
  Share2,
  Layers,
  Palette,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UndoRedoButtons } from "./BuilderToolbar";
import { useBuilderStore } from "../store/builder-store";
import { cn } from "@/lib/utils";

interface BuilderTopbarProps {
  onOpenJson: () => void;
  onOpenTemplates: () => void;
  onOpenShare: () => void;
  onOpenSteps: () => void;
  onOpenTheme: () => void;
}

export function BuilderTopbar({
  onOpenJson,
  onOpenTemplates,
  onOpenShare,
  onOpenSteps,
  onOpenTheme,
}: BuilderTopbarProps) {
  const { schema, setTitle, reset } = useBuilderStore();

  const fieldCount = schema.fields.length;
  const multiStepEnabled = schema.settings.multiStep?.enabled ?? false;
  const themePreset = schema.settings.theme?.preset ?? "default";

  const handleReset = () => {
    if (schema.fields.length > 0 && !confirm("Reset form? All fields will be removed.")) {
      return;
    }
    reset();
  };

  // Each of these shows up twice - as a labeled desktop button and as a
  // row in the mobile "more" menu - so they're defined once here instead
  // of being written out both times.
  const toolbarActions = [
    { icon: Palette, label: "Theme", onClick: onOpenTheme, visibleFrom: "sm" as const },
    { icon: Layers, label: "Steps", onClick: onOpenSteps, visibleFrom: "sm" as const },
    { icon: Layout, label: "Templates", onClick: onOpenTemplates, visibleFrom: "md" as const },
    { icon: RotateCcw, label: "Reset", onClick: handleReset, visibleFrom: "md" as const, destructive: true },
  ];

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-14 w-full items-center gap-3 px-3 sm:px-4">
        {/* Logo + title */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        </div>

        <div className="hidden sm:block h-5 w-px bg-border shrink-0" />

        <Input
          value={schema.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Form"
          className={cn(
            "flex-1 min-w-0 max-w-xs h-9 font-semibold",
            "border-transparent bg-transparent hover:bg-accent/50 focus-visible:bg-background",
            "focus-visible:ring-1 focus-visible:ring-ring",
            "transition-colors text-sm"
          )}
        />

        <div className="hidden xl:flex items-center gap-1.5 shrink-0">
          <Badge variant="secondary" className="text-xs font-normal gap-1">
            {fieldCount} field{fieldCount !== 1 ? "s" : ""}
          </Badge>

          {multiStepEnabled && (
            <Badge variant="outline" className="text-xs font-normal gap-1">
              <Layers className="h-3 w-3" />
              {schema.settings.multiStep?.steps.length ?? 0}
            </Badge>
          )}

          {themePreset !== "default" && (
            <Badge variant="outline" className="text-xs font-normal gap-1 capitalize">
              <Palette className="h-3 w-3" />
              {themePreset}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-1.5 shrink-0">
          <UndoRedoButtons />

          <div className="hidden md:block h-5 w-px bg-border mx-1" />

          {toolbarActions.map(({ icon: Icon, label, onClick, visibleFrom, destructive }) => (
            <Button
              key={label}
              variant="ghost"
              size="sm"
              onClick={onClick}
              title={label}
              className={cn(
                visibleFrom === "sm" ? "hidden sm:inline-flex" : "hidden md:inline-flex",
                destructive && "text-destructive hover:text-destructive"
              )}
            >
              <Icon className="h-4 w-4 lg:mr-2" />
              <span className="hidden lg:inline">{label}</span>
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenShare}
            disabled={fieldCount === 0}
            title="Share form"
            className="hidden sm:inline-flex"
          >
            <Share2 className="h-4 w-4 lg:mr-2" />
            <span className="hidden lg:inline">Share</span>
          </Button>

          <Button size="sm" onClick={onOpenJson}>
            <Code2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create JSON</span>
            <span className="sm:hidden">JSON</span>
          </Button>

          {/* Mobile: same actions collapsed into one menu */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "sm:hidden inline-flex items-center justify-center",
                "h-7 w-7 rounded-md shrink-0",
                "hover:bg-accent transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                "text-foreground"
              )}
              title="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {toolbarActions.slice(0, -1).map(({ icon: Icon, label, onClick }) => (
                <DropdownMenuItem key={label} onClick={onClick}>
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleReset} className="text-destructive focus:text-destructive">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset form
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}