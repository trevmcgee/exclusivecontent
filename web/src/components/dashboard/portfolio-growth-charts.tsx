"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { ChartResponsive } from "@/components/ui/chart-responsive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";
import { useMemo } from "react";

const tooltipStyle = {
  background: "hsl(240 8% 8%)",
  border: "1px solid hsl(240 6% 18%)",
  borderRadius: 8,
};

type Props = {
  products: DashboardData["products"];
};

export function PortfolioGrowthCharts({ products }: Props) {
  const { portfolioDaily, productTotals } = useMemo(() => {
    const byDate = new Map<string, { date: string; plays: number; reach: number }>();
    for (const product of products) {
      for (const point of product.timeseries) {
        const existing = byDate.get(point.date) ?? { date: point.date, plays: 0, reach: 0 };
        existing.plays += point.plays;
        existing.reach += point.reach;
        byDate.set(point.date, existing);
      }
    }
    const portfolioDaily = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

    const productTotals = products
      .map((p) => {
        const playsKpi = p.kpis.find((k) => k.id === "plays_28d");
        return {
          name: p.name.replace("SoundCloud ", ""),
          plays28d: playsKpi?.value ?? 0,
          change: playsKpi?.deltaPct ?? 0,
        };
      })
      .sort((a, b) => b.plays28d - a.plays28d);

    return { portfolioDaily, productTotals };
  }, [products]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            <MetricLabel metricKey="portfolio_growth">Exclusive portfolio — daily growth</MetricLabel>
          </CardTitle>
          <CardDescription>
            Combined plays and active users across all product lines (from KPI timeseries CSV)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartResponsive height={320}>
            <LineChart data={portfolioDaily} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => String(v).slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="plays"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => formatCompact(v as number)}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <YAxis
                yAxisId="reach"
                orientation="right"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => formatCompact(v as number)}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, name: string) => [
                  formatCompact(value),
                  name === "plays" ? "Plays" : "Active users",
                ]}
              />
              <Legend />
              <Line
                yAxisId="plays"
                type="monotone"
                dataKey="plays"
                name="Plays"
                stroke="hsl(20 100% 50%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="reach"
                type="monotone"
                dataKey="reach"
                name="Active users"
                stroke="hsl(210 90% 60%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartResponsive>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <MetricLabel metricKey="plays_28d">Plays by product (28d)</MetricLabel>
          </CardTitle>
          <CardDescription>Compare scale across programming lines</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartResponsive height={280}>
            <BarChart data={productTotals} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => formatCompact(v as number)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [formatCompact(value), "Plays (28d)"]}
              />
              <Bar dataKey="plays28d" fill="hsl(20 100% 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartResponsive>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <MetricLabel metricKey="reach_28d">Active users trend</MetricLabel>
          </CardTitle>
          <CardDescription>Portfolio reach — daily sum</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartResponsive height={280}>
            <AreaChart data={portfolioDaily} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(210 90% 60%)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="hsl(210 90% 60%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => String(v).slice(5)}
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
                contentStyle={tooltipStyle}
                formatter={(value: number) => [formatCompact(value), "Active users"]}
              />
              <Area
                type="monotone"
                dataKey="reach"
                stroke="hsl(210 90% 60%)"
                fill="url(#reachFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartResponsive>
        </CardContent>
      </Card>
    </div>
  );
}
