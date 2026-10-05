"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { ChartResponsive } from "@/components/ui/chart-responsive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TimeseriesPoint } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";

type Props = {
  title: string;
  titleMetricKey?: string;
  description?: string;
  data: TimeseriesPoint[];
};

export function PlaysChart({ title, titleMetricKey, description, data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {titleMetricKey ? <MetricLabel metricKey={titleMetricKey}>{title}</MetricLabel> : title}
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartResponsive height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="playsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(20 100% 50%)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="hsl(20 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
              tickFormatter={(v) => v.slice(5)}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
              tickFormatter={(v) => formatCompact(v as number)}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(240 8% 8%)",
                border: "1px solid hsl(240 6% 18%)",
                borderRadius: 8,
              }}
              labelStyle={{ color: "hsl(0 0% 98%)" }}
              formatter={(value: number, name: string) => [
                formatCompact(value),
                name === "plays" ? "Plays" : "Active users",
              ]}
            />
            <Area
              type="monotone"
              dataKey="plays"
              stroke="hsl(20 100% 50%)"
              fill="url(#playsFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartResponsive>
      </CardContent>
    </Card>
  );
}
