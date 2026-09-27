/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  FileText,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Code2,
  Inbox,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { StatCard } from "./components/StatCard";
import { FieldChart } from "./components/FieldChart";
import { TimelineChart } from "./components/TimelineChart";
import { useAnalytics } from "./hooks/useAnalytics";
import type { FormSchema, Submission } from "@/types";

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export function AnalyticsPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();

  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const stored = (window as any).__formCraftData;
    if (stored?.formId === formId) {
      setSchema(stored.schema);
      setSubmissions(stored.submissions || []);
    }
  }, [formId]);

  const analytics = useAnalytics(schema, submissions);

  if (!schema || !analytics) {
    return (
      <div className="container py-16 max-w-2xl">
        <EmptyState
          icon={BarChart3}
          title="No data available"
          description="Load a form and submit some responses first."
          size="lg"
          action={
            <Button onClick={() => navigate("/import")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go to Import
            </Button>
          }
        />
      </div>
    );
  }

  if (analytics.totalResponses === 0) {
    return (
      <div className="container py-8 max-w-5xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/import")}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardContent className="py-12">
            <EmptyState
              icon={Inbox}
              title="No responses yet"
              description="Submit the form to see analytics here."
              size="lg"
              action={
                <Button onClick={() => navigate("/import")}>
                  Go to Preview
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/import")}
        className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Import
      </Button>

      {/* Page Header */}
      <PageHeader
        title="Analytics"
        description={
          <>
            Insights for{" "}
            <span className="font-medium text-foreground">{schema.title}</span>
          </>
        }
        icon={<BarChart3 className="h-5 w-5 text-primary" />}
        badge={
          <Badge variant="secondary" className="text-xs gap-1.5 font-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Live
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/json/${formId}`)}
          >
            <Code2 className="h-4 w-4 mr-2" />
            View JSON
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={FileText}
          label="Total Responses"
          value={analytics.totalResponses}
          description="All submissions"
          color="blue"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completion Rate"
          value={`${analytics.completionRate}%`}
          description="Average filled fields"
          color="green"
        />
        <StatCard
          icon={Calendar}
          label="First Response"
          value={
            analytics.firstResponse
              ? new Date(analytics.firstResponse).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          description={
            analytics.firstResponse
              ? getTimeAgo(analytics.firstResponse)
              : undefined
          }
          color="amber"
        />
        <StatCard
          icon={TrendingUp}
          label="Last Response"
          value={
            analytics.lastResponse
              ? new Date(analytics.lastResponse).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "—"
          }
          description={
            analytics.lastResponse
              ? getTimeAgo(analytics.lastResponse)
              : undefined
          }
          color="purple"
        />
      </div>

      <div className="mb-6">
        <TimelineChart data={analytics.timeline} />
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Field Insights</h2>
        </div>
        <p className="text-sm text-muted-foreground ml-11">
          Breakdown of answers for each field
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {analytics.fieldStats.map((stat) => (
          <FieldChart key={stat.fieldId} stat={stat} />
        ))}
      </div>
    </div>
  );
}