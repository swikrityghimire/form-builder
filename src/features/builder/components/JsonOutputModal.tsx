import { useState, useMemo } from "react";
import { Copy, Check, Download, Code2, FileJson } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModalShell } from "@/components/common/ModalShell";
import type { FormSchema } from "@/types";

interface JsonOutputModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schema: FormSchema;
}

export function JsonOutputModal({
  open,
  onOpenChange,
  schema,
}: JsonOutputModalProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = useMemo(
    () => JSON.stringify(schema, null, 2),
    [schema]
  );

  const stats = useMemo(() => {
    const count = (fields: typeof schema.fields): number =>
      fields.reduce(
        (acc, f) => acc + 1 + (f.children ? count(f.children) : 0),
        0
      );
    return {
      fields: count(schema.fields),
      size: new Blob([jsonString]).size,
    };
  }, [schema, jsonString]);

  const fileName = `${schema.title.replace(/\s+/g, "-").toLowerCase() || "form"}.json`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success("JSON copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  return (
    <ModalShell
      open={open}
      onOpenChange={onOpenChange}
      title="Form JSON"
      description="Copy or download your form definition"
      icon={<Code2 className="h-4 w-4 text-primary" />}
      maxWidth="max-w-4xl"
      height="min(88vh, 800px)"
      footer={
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {stats.fields} field{stats.fields !== 1 ? "s" : ""}
            </Badge>
            <Badge variant="outline" className="font-normal">
              {(stats.size / 1024).toFixed(2)} KB
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      {/* JSON code block */}
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
          <FileJson className="h-3.5 w-3.5 text-neutral-500" />
          <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 truncate">
            {fileName}
          </span>
        </div>
        <div
          className="overflow-auto"
          style={{ maxHeight: "calc(88vh - 300px)" }}
        >
          <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre">
            <code className="text-neutral-800 dark:text-neutral-200">
              {jsonString}
            </code>
          </pre>
        </div>
      </div>
    </ModalShell>
  );
}