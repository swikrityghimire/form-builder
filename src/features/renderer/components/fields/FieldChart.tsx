/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/static-components */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FieldStat } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Hash,
  List,
  Type,
  Star,
  Mail,
  AlignLeft,
  CheckSquare,
  Calendar,
} from "lucide-react";

interface FieldChartProps {
  stat: FieldStat;
}

const CHART_COLORS = [
  "hsl(217 91% 60%)",
  "hsl(142 76% 36%)",
  "hsl(45 93% 47%)",
  "hsl(0 84% 60%)",
  "hsl(280 65% 60%)",
  "hsl(190 90% 50%)",
  "hsl(340 82% 52%)",
];

const BG_COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-amber-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-cyan-500",
  "bg-pink-500",
];

function getFieldIcon(type: string) {
  switch (type) {
    case "number":
    case "slider":
      return Hash;
    case "rating":
      return Star;
    case "email":
      return Mail;
    case "textarea":
      return AlignLeft;
    case "checkbox":
    case "checkbox-group":
      return CheckSquare;
    case "date":
    case "time":
    case "datetime":
      return Calendar;
    case "select":
    case "radio":
    case "multiselect":
      return List;
    default:
      return Type;
  }
}

export function FieldChart({ stat }: FieldChartProps) {
  const FieldIcon = getFieldIcon(stat.fieldType);
  const completionRate =
    stat.total > 0 ? Math.round((stat.answered / stat.total) * 100) : 0;

  if (stat.options && stat.options.length > 0) {
    const data = stat.options.map((opt) => ({
      name: opt.label,
      count: opt.count,
      percentage: opt.percentage,
    }));

    return (
      <Card className="transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FieldIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm truncate">
                  {stat.fieldLabel}
                </CardTitle>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {stat.fieldType}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0 font-normal">
              {stat.answered}/{stat.total}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Bar chart */}
          <ResponsiveContainer
            width="100%"
            height={Math.max(80, data.length * 32)}
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
            >
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                width={100}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: 12,
                  padding: "6px 10px",
                }}
                formatter={(value: any) => [`${value} response(s)`, "Count"]}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Legend with progress */}
          <div className="space-y-2.5 pt-2 border-t">
            {stat.options.map((opt, idx) => (
              <div key={opt.value} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                        BG_COLORS[idx % BG_COLORS.length]
                      }`}
                    />
                    <span className="truncate font-medium">{opt.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-muted-foreground tabular-nums">
                      {opt.count}
                    </span>
                    <span className="font-semibold tabular-nums w-9 text-right">
                      {opt.percentage}%
                    </span>
                  </div>
                </div>
                <Progress value={opt.percentage} className="h-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stat.numeric) {
    const stats = [
      {
        label: "Average",
        value: stat.numeric.average,
        gradient: "from-blue-500/10 to-blue-500/5",
        text: "text-blue-600 dark:text-blue-400",
      },
      {
        label: "Sum",
        value: stat.numeric.sum,
        gradient: "from-green-500/10 to-green-500/5",
        text: "text-green-600 dark:text-green-400",
      },
      {
        label: "Min",
        value: stat.numeric.min,
        gradient: "from-amber-500/10 to-amber-500/5",
        text: "text-amber-600 dark:text-amber-400",
      },
      {
        label: "Max",
        value: stat.numeric.max,
        gradient: "from-purple-500/10 to-purple-500/5",
        text: "text-purple-600 dark:text-purple-400",
      },
    ];

    return (
      <Card className="transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FieldIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm truncate">
                  {stat.fieldLabel}
                </CardTitle>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {stat.fieldType} · {completionRate}% filled
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0 font-normal">
              {stat.answered}/{stat.total}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className={`rounded-lg bg-gradient-to-br ${s.gradient} p-3.5 space-y-1 transition-transform hover:scale-[1.02]`}
              >
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-bold tracking-tight tabular-nums ${s.text}`}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (stat.textSamples && stat.textSamples.length > 0) {
    return (
      <Card className="transition-all hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FieldIcon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-sm truncate">
                  {stat.fieldLabel}
                </CardTitle>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {stat.fieldType} · {stat.answered} response
                  {stat.answered !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs shrink-0 font-normal">
              {stat.answered}/{stat.total}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {stat.textSamples.map((sample, idx) => (
              <div
                key={idx}
                className="group rounded-lg bg-muted/40 hover:bg-muted/60 px-3 py-2.5 text-sm flex items-center gap-2.5 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-[10px] font-bold text-primary">
                  {idx + 1}
                </div>
                <span className="truncate font-medium">
                  {sample || "(empty)"}
                </span>
              </div>
            ))}
            {stat.answered > stat.textSamples.length && (
              <div className="text-xs text-muted-foreground text-center pt-2 border-t">
                +{stat.answered - stat.textSamples.length} more response
                {stat.answered - stat.textSamples.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FieldIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-sm truncate">
                {stat.fieldLabel}
              </CardTitle>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">
                {stat.fieldType}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs shrink-0 font-normal">
            {stat.answered}/{stat.total}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Answered</span>
          <span className="font-semibold">{stat.answered}</span>
        </div>
        <Progress value={completionRate} className="h-1.5" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Skipped</span>
          <span className="font-medium">{stat.skipped}</span>
        </div>
      </CardContent>
    </Card>
  );
}