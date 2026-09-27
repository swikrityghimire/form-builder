/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardPaste,
  Sparkles,
  AlertCircle,
  Trash2,
  FileJson,
  CheckCircle2,
  Download,
  Code2,
  Eye,
  FileText,
  Copy,
  Check,
  Search,
  Inbox,
  X,
  BarChart3,
  Sheet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ModalShell } from "@/components/common/ModalShell";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import type { FormSchema, Field, Submission } from "@/types";
import { FormRenderer } from "@/features/renderer/components/FormRenderer";
import { validateFormSchema } from "@/lib/schema/validate-schema";
import { downloadResponsesCSV } from "./utils/export-csv";

function buildFieldLabelMap(
  fields: Field[],
  map: Record<string, string> = {}
): Record<string, string> {
  for (const field of fields) {
    if (field.type === "row" && field.children) {
      buildFieldLabelMap(field.children, map);
    } else if (field.type !== "section" && field.type !== "divider") {
      map[field.name] = field.label;
    }
  }
  return map;
}

export function ImportPage() {
  const navigate = useNavigate();
  const [jsonText, setJsonText] = useState("");
  const [parsedSchema, setParsedSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedResponses, setSubmittedResponses] = useState<Submission[]>([]);
  const [responsesOpen, setResponsesOpen] = useState(false);
  const [responsesJsonOpen, setResponsesJsonOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const fieldLabels = useMemo(
    () => (parsedSchema ? buildFieldLabelMap(parsedSchema.fields) : {}),
    [parsedSchema]
  );

  const handleGenerate = () => {
    setError(null);
    setParsedSchema(null);
    setSubmittedResponses([]);
    setSearch("");

    if (!jsonText.trim()) {
      setError("Please paste JSON first");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      const validated = validateFormSchema(parsed);
      setParsedSchema(validated);
      toast.success("Form loaded");
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON syntax. Check for missing commas or brackets.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to parse JSON");
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJsonText(text);
    } catch {
      setError("Clipboard access denied");
    }
  };

  const handleClear = () => {
    setJsonText("");
    setParsedSchema(null);
    setError(null);
    setSubmittedResponses([]);
    setSearch("");
  };

  const handleSubmit = (data: Record<string, unknown>) => {
    const newSubmission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      data,
    };
    setSubmittedResponses((prev) => [newSubmission, ...prev]);
    toast.success(`Response #${submittedResponses.length + 1} recorded`, {
      action: {
        label: "View",
        onClick: () => setResponsesOpen(true),
      },
    });
  };

  const handleOpenAnalytics = () => {
    if (!parsedSchema || submittedResponses.length === 0) {
      toast.error("Need at least one response");
      return;
    }
    (window as any).__formCraftData = {
      formId: parsedSchema.id,
      schema: parsedSchema,
      submissions: submittedResponses,
    };
    navigate(`/analytics/${parsedSchema.id}`);
  };

  const handleExportCSV = () => {
    if (!parsedSchema || submittedResponses.length === 0) {
      toast.error("No responses to export");
      return;
    }
    downloadResponsesCSV(parsedSchema, submittedResponses);
    toast.success(`Exported ${submittedResponses.length} responses`);
  };

  const filteredResponses = useMemo(() => {
    if (!search.trim()) return submittedResponses;
    const q = search.toLowerCase();
    return submittedResponses.filter((sub) =>
      JSON.stringify(sub.data).toLowerCase().includes(q)
    );
  }, [submittedResponses, search]);

  const responsesJsonString = useMemo(() => {
    if (!parsedSchema) return "";
    return JSON.stringify(
      {
        formId: parsedSchema.id,
        formTitle: parsedSchema.title,
        exportedAt: new Date().toISOString(),
        totalResponses: submittedResponses.length,
        responses: submittedResponses,
      },
      null,
      2
    );
  }, [parsedSchema, submittedResponses]);

  const handleCopyResponsesJson = async () => {
    try {
      await navigator.clipboard.writeText(responsesJsonString);
      setCopied(true);
      toast.success("Copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadResponsesJson = () => {
    if (!parsedSchema || submittedResponses.length === 0) return;
    const blob = new Blob([responsesJsonString], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${
      parsedSchema.title.replace(/\s+/g, "-").toLowerCase() || "form"
    }-responses.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${submittedResponses.length} responses`);
  };

  const handleDeleteResponse = (id: string) => {
    const deleted = submittedResponses.find((s) => s.id === id);
    if (!deleted) return;

    setSubmittedResponses((prev) => prev.filter((s) => s.id !== id));

    toast("Response deleted", {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          setSubmittedResponses((prev) =>
            [...prev, deleted].sort((a, b) => b.timestamp - a.timestamp)
          );
          toast.success("Restored");
        },
      },
    });
  };

  const fieldCount = parsedSchema?.fields.length ?? 0;
  const responseCount = submittedResponses.length;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Import & Preview"
        description="Paste JSON from the Builder to see your form come to life"
        icon={<Sparkles className="h-5 w-5 text-primary" />}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenAnalytics}
              disabled={!parsedSchema || responseCount === 0}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={!parsedSchema || responseCount === 0}
            >
              <Sheet className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResponsesOpen(true)}
              disabled={!parsedSchema}
            >
              <FileText className="h-4 w-4 mr-2" />
              Responses
              {responseCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 px-1.5 text-[10px] font-normal"
                >
                  {responseCount}
                </Badge>
              )}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT: JSON Input */}
        <div className="md:sticky md:top-20">
          <Card>
            <CardHeader className="pb-4 flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <FileJson className="h-4 w-4 text-primary" />
                Paste Form JSON
              </CardTitle>
              {fieldCount > 0 && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {fieldCount} field{fieldCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder={`{\n  "id": "form_abc",\n  "title": "Contact Form",\n  "fields": [...]\n}`}
                className="font-mono text-xs h-[500px] resize-none overflow-y-auto"
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleGenerate} className="flex-1 font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Preview
                </Button>
                <Button variant="outline" onClick={handlePaste}>
                  <ClipboardPaste className="h-4 w-4 mr-2" />
                  Paste
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleClear}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="Clear"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Preview */}
        <div>
          <Card>
            <CardHeader className="pb-4 border-b flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base flex items-center gap-2 font-semibold">
                <Eye className="h-4 w-4 text-primary" />
                Live Preview
              </CardTitle>
              {parsedSchema && (
                <Badge
                  variant="outline"
                  className="text-xs font-mono font-normal"
                >
                  {parsedSchema.title}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-6 pb-8">
              {parsedSchema ? (
                <FormRenderer schema={parsedSchema} onSubmit={handleSubmit} />
              ) : (
                <EmptyState
                  icon={Eye}
                  title="No preview yet"
                  description="Paste JSON on the left and click Generate Preview to see your form here."
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RESPONSES MODAL */}
      <ModalShell
        open={responsesOpen}
        onOpenChange={setResponsesOpen}
        title="Responses"
        description={
          parsedSchema
            ? `All submissions for "${parsedSchema.title}"`
            : "No form loaded"
        }
        icon={<FileText className="h-4 w-4 text-primary" />}
        maxWidth="max-w-4xl"
        height="min(85vh, 750px)"
        footer={
          responseCount > 0 ? (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">
                {filteredResponses.length} of {responseCount} shown
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResponsesJsonOpen(true)}
                >
                  <Code2 className="h-4 w-4 mr-2" />
                  View JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadResponsesJson}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ) : undefined
        }
      >
        {responseCount === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No responses yet"
            description="Submit the form to see responses here."
          />
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search responses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9 h-9"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {filteredResponses.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No responses match "{search}"
              </div>
            ) : (
              <div className="space-y-3">
                {filteredResponses.map((sub, index) => (
                  <Card
                    key={sub.id}
                    className="border-green-500/30 bg-green-500/5"
                  >
                    <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0" />
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          #{responseCount - index}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-normal">
                          {new Date(sub.timestamp).toLocaleString()}
                        </span>
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteResponse(sub.id)}
                        title="Delete response"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border bg-background overflow-hidden text-xs">
                        {Object.entries(sub.data).map(([key, value], idx) => (
                          <div
                            key={key}
                            className={`grid grid-cols-[140px_1fr] gap-3 px-3 py-2.5 ${
                              idx !== 0 ? "border-t" : ""
                            }`}
                          >
                            <span className="font-medium text-muted-foreground text-[11px] truncate">
                              {fieldLabels[key] ?? key}
                            </span>
                            <span className="font-mono break-all">
                              {Array.isArray(value)
                                ? value.length > 0
                                  ? value.join(", ")
                                  : "(empty)"
                                : value instanceof FileList ||
                                  (typeof value === "object" &&
                                    value !== null &&
                                    "length" in value)
                                ? `(${(value as FileList).length} file(s))`
                                : typeof value === "object" && value !== null
                                ? JSON.stringify(value)
                                : String(value) || "(empty)"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </ModalShell>

      {/* RESPONSES JSON MODAL */}
      <ModalShell
        open={responsesJsonOpen}
        onOpenChange={setResponsesJsonOpen}
        title="Responses JSON"
        description={`${responseCount} submission${
          responseCount !== 1 ? "s" : ""
        } as JSON`}
        icon={<Code2 className="h-4 w-4 text-primary" />}
        maxWidth="max-w-3xl"
        height="min(85vh, 750px)"
        footer={
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadResponsesJson}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button size="sm" onClick={handleCopyResponsesJson}>
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
        }
      >
        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
            <FileText className="h-3.5 w-3.5 text-neutral-500" />
            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
              responses.json
            </span>
          </div>
          <div
            className="overflow-auto"
            style={{ maxHeight: "calc(85vh - 300px)" }}
          >
            <pre className="p-4 text-xs font-mono leading-relaxed whitespace-pre">
              <code className="text-neutral-800 dark:text-neutral-200">
                {responsesJsonString}
              </code>
            </pre>
          </div>
        </div>
      </ModalShell>
    </div>
  );
}