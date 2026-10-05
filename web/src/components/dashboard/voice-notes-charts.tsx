"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartResponsive } from "@/components/ui/chart-responsive";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoiceNotesData } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";
import { useMemo } from "react";

const tooltipStyle = {
  background: "hsl(240 8% 8%)",
  border: "1px solid hsl(240 6% 18%)",
  borderRadius: 8,
};

function weekKey(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return "unknown";
  const d = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  const day = d.getUTCDay();
  const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setUTCDate(diff);
  return monday.toISOString().slice(0, 10);
}

export function VoiceNotesCharts({ data }: { data: VoiceNotesData }) {
  const { topArtists, publishWeekly, catalogGrowth } = useMemo(() => {
    const topArtists = [...data.playlists]
      .filter((p) => p.plays28dTotal !== null)
      .sort((a, b) => (b.plays28dTotal ?? 0) - (a.plays28dTotal ?? 0))
      .slice(0, 12)
      .map((p) => ({
        name: p.artistName.length > 22 ? `${p.artistName.slice(0, 20)}…` : p.artistName,
        plays: p.plays28dTotal ?? 0,
        tracks: p.trackCount,
      }));

    const weekly = new Map<string, number>();
    for (const playlist of data.playlists) {
      for (const track of playlist.tracks) {
        const wk = weekKey(track.publishedDate);
        weekly.set(wk, (weekly.get(wk) ?? 0) + 1);
      }
    }
    const publishWeekly = [...weekly.entries()]
      .map(([week, publishes]) => ({ week, publishes }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-16);

    let cumulative = 0;
    const catalogGrowth = publishWeekly.map((row) => {
      cumulative += row.publishes;
      return { week: row.week, cumulative, publishes: row.publishes };
    });

    return { topArtists, publishWeekly, catalogGrowth };
  }, [data.playlists]);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Voice Notes catalog growth</CardTitle>
          <CardDescription>Cumulative tracks published (from masterlist dates)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartResponsive height={280}>
            <AreaChart data={catalogGrowth} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="catalogFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(20 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(20 100% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 10 }}
                tickFormatter={(v) => String(v).slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Total tracks"
                stroke="hsl(20 100% 50%)"
                fill="url(#catalogFill)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartResponsive>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New drops per week</CardTitle>
          <CardDescription>Publish velocity</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartResponsive height={280}>
            <BarChart data={publishWeekly.slice(-10)} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
              <XAxis
                dataKey="week"
                tick={{ fill: "hsl(240 5% 64%)", fontSize: 9 }}
                tickFormatter={(v) => String(v).slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: "hsl(240 5% 64%)", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="publishes" name="Tracks published" fill="hsl(20 100% 50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartResponsive>
        </CardContent>
      </Card>

      {topArtists.length > 0 ? (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Top artists by plays (28d)</CardTitle>
            <CardDescription>Playlist-level totals from supplied / estimated metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartResponsive height={300}>
              <BarChart data={topArtists} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 6% 18%)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(240 5% 64%)", fontSize: 10 }}
                  angle={-35}
                  textAnchor="end"
                  height={60}
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
                  formatter={(value: number) => [formatCompact(value), "Plays (28d)"]}
                />
                <Bar dataKey="plays" fill="hsl(20 100% 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartResponsive>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
