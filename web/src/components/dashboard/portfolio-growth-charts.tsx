"use client";

import {
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
import type { CuratedSeriesGrowth, SeriesPlayCount } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";
import { useMemo } from "react";

const tooltipStyle = {
  background: "hsl(240 8% 8%)",
  border: "1px solid hsl(240 6% 18%)",
  borderRadius: 8,
};

const SERIES_COLORS = [
  "hsl(20 100% 50%)",
  "hsl(210 90% 60%)",
  "hsl(140 55% 48%)",
  "hsl(280 65% 62%)",
];

type Props = {
  series: CuratedSeriesGrowth[] | undefined;
  seriesPlayCounts?: SeriesPlayCount[];
};

export function PortfolioGrowthCharts({ series, seriesPlayCounts }: Props) {
  const { chartRows, seriesKeys, lifetimeTotals } = useMemo(() => {
    const rows = series ?? [];
    if (!rows.length) {
      return { chartRows: [], seriesKeys: [] as string[], lifetimeTotals: [] as { name: string; total: number }[] };
    }

    const keys = rows.map((s) => s.id);
    const maxDay = Math.max(...rows.flatMap((s) => s.points.map((p) => p.dayIndex)), 0);
    const byDay = new Map<number, Record<string, number | string>>();

    for (const s of rows) {
      for (const point of s.points) {
        const row = byDay.get(point.dayIndex) ?? { dayIndex: point.dayIndex };
        row[s.id] = point.cumulativePlays;
        byDay.set(point.dayIndex, row);
      }
    }

    for (let d = 0; d <= maxDay; d += 1) {
      if (!byDay.has(d)) {
        byDay.set(d, { dayIndex: d });
      }
    }

    let chartRows = [...byDay.values()].sort(
      (a, b) => (a.dayIndex as number) - (b.dayIndex as number),
    );

    for (const key of keys) {
      let last: number | undefined;
      let started = false;
      chartRows = chartRows.map((row) => {
        const v = row[key];
        if (typeof v === "number") {
          started = true;
          last = v;
          return row;
        }
        if (started && last !== undefined) {
          return { ...row, [key]: last };
        }
        return row;
      });
    }

    const playCountByHub = new Map(
      (seriesPlayCounts ?? []).map((r) => [r.id.replace(/^hub-/, ""), r]),
    );

    const lifetimeTotals = rows.map((s) => {
      const row = playCountByHub.get(s.id);
      const total =
        row?.playsTotalStoriesTracks ?? row?.playsTotal ?? s.points.at(-1)?.cumulativePlays ?? 0;
      return { name: s.name.replace(" (albums hub)", ""), total };
    });

    return { chartRows, seriesKeys: keys, lifetimeTotals };
  }, [series, seriesPlayCounts]);

  if (!series?.length) {
    return (
      <Card className="border-dashed border-primary/25">
        <CardHeader>
          <CardTitle>Curated series growth</CardTitle>
          <CardDescription>
            Rebuild <code className="text-xs">dashboard.json</code> after curated hub metrics are
            present to model cumulative plays from each series launch.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const nameById = Object.fromEntries(series.map((s) => [s.id, s.name]));

  return (
    <div id="portfolio-charts" className="grid gap-4 lg:grid-cols-2 scroll-mt-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            <MetricLabel metricKey="curated_series_growth">
              Curated series — cumulative plays since launch
            </MetricLabel>
          </CardTitle>
          <CardDescription>
            Weekly points from each series start date through the snapshot. The Upload uses
            soundcloud-stories tracks only; other hubs use all playlist tracks. Per-track lifetime
            plays are spread linearly from publish (or estimated publish) to today when audited
            daily history is unavailable.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <ChartResponsive height={320}>
            <LineChart data={chartRows} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
              <XAxis
                dataKey="dayIndex"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: "Days since series start",
                  position: "insideBottom",
                  offset: -2,
                  fill: "hsl(240 5% 64%)",
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                tickFormatter={(v) => formatCompact(v as number)}
                axisLine={false}
                tickLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number, key: string) => [
                  formatCompact(value),
                  nameById[key] ?? key,
                ]}
                labelFormatter={(day) => `Day ${day}`}
              />
              <Legend
                formatter={(value) => nameById[value] ?? value}
              />
              {seriesKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key}
                  stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ChartResponsive>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            <MetricLabel metricKey="curated_series_lifetime_total">
              Lifetime plays by curated series
            </MetricLabel>
          </CardTitle>
          <CardDescription>End-of-curve totals aligned with Play counts by series</CardDescription>
        </CardHeader>
        <CardContent className="min-w-0">
          <ChartResponsive height={280}>
            <BarChart data={lifetimeTotals} layout="vertical" margin={{ left: 8, right: 16 }}>
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
                width={120}
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [formatCompact(value), "Lifetime plays"]}
              />
              <Bar dataKey="total" fill="hsl(20 100% 50%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ChartResponsive>
        </CardContent>
      </Card>
    </div>
  );
}
