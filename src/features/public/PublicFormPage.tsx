/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/static-components */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Download,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { EmptyState } from "@/components/common/EmptyState";
import { PageLoader } from "@/components/common/Loading";
import type { FormSchema } from "@/types";
import { FormRenderer } from "@/features/renderer/components/FormRenderer";
import { readFormFromCurrentUrl } from "@/lib/share/encode";

export function PublicFormPage() {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Record<string, unknown> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const decoded = readFormFromCurrentUrl();
    if (!decoded) {
      setError(
        "Invalid or missing form data. Please check the link and try again."
      );
      setIsLoading(false);
      return;
    }
    setSchema(decoded);
    document.title = decoded.title || "Form";
    setIsLoading(false);
  }, []);

  const handleSubmit = (data: Record<string, unknown>) => {
    setSubmitted(data);
    toast.success("Form submitted successfully");
  };

  const handleDownload = () => {
    if (!submitted || !schema) return;
    const payload = {
      formId: schema.id,
      formTitle: schema.title,
      submittedAt: new Date().toISOString(),
      data: submitted,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `response-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Response downloaded");
  };

  const handleReset = () => {
    setSubmitted(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen-safe flex items-center justify-center bg-background">
        <PageLoader message="Loading form..." />
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen-safe flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <EmptyState
              icon={AlertCircle}
              title="Invalid Form Link"
              description={error}
              action={
                <Button onClick={() => navigate("/")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Home
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!schema) return null;

  const Header = () => (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold shrink-0"
        >
          <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span>FormCraft</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:flex text-xs gap-1 font-normal">
            <ShieldCheck className="h-3 w-3 text-green-600" />
            Secure form
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );

  if (submitted) {
    return (
      <div className="min-h-screen-safe flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-2xl space-y-4 animate-fade-up">
            {/* Success card */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="rounded-full bg-green-500/10 p-4 w-fit mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-500" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Thank you
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    {schema.settings.successMessage}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-500" />
                  <h3 className="text-sm font-semibold">Your Submission</h3>
                </div>

                <div className="rounded-md border bg-muted/20 overflow-hidden text-xs">
                  {Object.entries(submitted).map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-[140px_1fr] gap-3 px-3 py-2.5 ${
                        idx !== 0 ? "border-t" : ""
                      }`}
                    >
                      <span className="font-medium text-muted-foreground text-[10px] uppercase tracking-wide truncate">
                        {key}
                      </span>
                      <span className="font-mono break-all">
                        {Array.isArray(value)
                          ? value.length > 0
                            ? value.join(", ")
                            : "(empty)"
                          : typeof value === "object" && value !== null
                          ? JSON.stringify(value)
                          : String(value) || "(empty)"}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    className="flex-1"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleReset}
                    className="flex-1"
                    size="sm"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Submit Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="border-t mt-auto">
          <div className="mx-auto max-w-4xl px-4 py-4 text-center text-xs text-muted-foreground">
            <p>
              Powered by{" "}
              <Link
                to="/"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                FormCraft
              </Link>
            </p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen-safe flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1 flex justify-center p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-2xl animate-fade-up">
          {/* Form card */}
          <Card className="shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <FormRenderer schema={schema} onSubmit={handleSubmit} />
            </CardContent>
          </Card>

          {/* Trust footer */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
            <span>Your data is stored safely</span>
          </div>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="mx-auto max-w-4xl px-4 py-4 text-center text-xs text-muted-foreground">
          <p>
            Powered by{" "}
            <Link
              to="/"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              FormCraft
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}