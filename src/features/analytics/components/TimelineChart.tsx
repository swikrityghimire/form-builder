/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp } from "lucide-react";

interface TimelineChartProps {
  data: { date: string; count: number }[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    displayDate: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  const totalInRange = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const avgPerDay = (totalInRange / Math.max(data.length, 1)).toFixed(1);
  const peakDay = data.reduce(
    (max, d) => (d.count > max.count ? d : max),
    data[0] || { date: "", count: 0 }
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">Response Activity</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Last 30 days · {totalInRange} total responses
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs gap-1 font-normal">
              <TrendingUp className="h-3 w-3" />
              {avgPerDay}/day avg
            </Badge>
            {peakDay.count > 0 && (
              <Badge variant="secondary" className="text-xs font-normal">
                Peak: {peakDay.count} on{" "}
                {new Date(peakDay.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={formatted}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="hsl(var(--primary))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
              opacity={0.4}
            />
            <XAxis
              dataKey="displayDate"
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              interval={Math.floor(formatted.length / 7)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              domain={[0, Math.max(maxCount, 1)]}
            />
            <Tooltip
              cursor={{
                stroke: "hsl(var(--primary))",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: 12,
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: any) => [`${value} response(s)`, "Count"]}
              labelFormatter={(label) => `📅 ${label}`}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#colorCount)"
              dot={{
                r: 3,
                fill: "hsl(var(--primary))",
                strokeWidth: 2,
                stroke: "hsl(var(--background))",
              }}
              activeDot={{
                r: 6,
                fill: "hsl(var(--primary))",
                strokeWidth: 3,
                stroke: "hsl(var(--background))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}