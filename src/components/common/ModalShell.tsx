import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ModalShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
  height?: string;
  bodyClassName?: string;
}

export function ModalShell({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  maxWidth = "max-w-3xl",
  height = "min(85vh, 750px)",
  bodyClassName,
}: ModalShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "!flex !flex-col w-full p-0 gap-0 overflow-hidden",
          "bg-white text-neutral-900",
          "dark:bg-black dark:text-neutral-50",
          maxWidth
        )}
        style={{
          maxHeight: "calc(100vh - 2rem)",
          height,
        }}
      >
        {/* HEADER */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0 space-y-0">
          <div className="flex items-start gap-3 text-left">
            {icon && (
              <div className="h-9 w-9 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 mt-0.5">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-semibold leading-tight">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-xs mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* BODY — p-6 default padding so children don't touch edges */}
        <div
          style={{ flex: "1 1 0%", minHeight: 0, overflowY: "auto" }}
          className={cn("p-6", bodyClassName)}
        >
          {children}
        </div>

        {/* FOOTER */}
        {footer && (
          <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black px-6 py-3 shrink-0">
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}