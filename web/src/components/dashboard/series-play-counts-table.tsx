"use client";

import { useMemo, useState } from "react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SeriesPlayCount } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";

const CATEGORY_LABEL: Record<SeriesPlayCount["category"], string> = {
  editorial: "Editorial",
  voice_notes: "Voice Notes",
  curated_hub: "Curated hub",
};

const TABLE_CATEGORIES = ["all", "curated_hub", "editorial"] as const;

type Filter = "all" | SeriesPlayCount["category"];

export function SeriesPlayCountsTable({
  rows,
  embeddedInModule = false,
}: {
  rows: SeriesPlayCount[];
  embeddedInModule?: boolean;
}) {
  const [filter, setFilter] = useState<Filter>("curated_hub");
  const [query, setQuery] = useState("");

  const tableRows = useMemo(
    () => rows.filter((row) => row.category !== "voice_notes"),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tableRows.filter((row) => {
      if (filter !== "all" && row.category !== filter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        (row.productLabel?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [tableRows, filter, query]);

  const estimateCount = tableRows.filter((r) => r.metricsSource === "portfolio_estimate").length;
  const showUploadPlaySplit = tableRows.some((r) => r.playsTotalStoriesTracks != null);

  if (!tableRows.length) return null;

  return (
    <Card className={embeddedInModule ? "border-border/60 shadow-none" : undefined}>
      {!embeddedInModule ? (
        <CardHeader>
          <CardTitle>Play counts by series</CardTitle>
          <CardDescription>
            Flagship curated hubs (including Voice Notes albums) drive portfolio KPIs. Editorial sets
            are optional rows—use the Editorial filter. Artist playlists live under Voice Notes in
            Curated hubs. Sorted by 28-day plays, else lifetime.
          </CardDescription>
        </CardHeader>
      ) : (
        <CardHeader className="pb-2 pt-4">
          <CardDescription>
            Flagship curated hubs match portfolio KPIs. Editorial Stories sets are listed separately
            and do not roll into portfolio totals.
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {TABLE_CATEGORIES.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  filter === key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {key === "all" ? "All" : CATEGORY_LABEL[key]}
              </button>
            ))}
          </div>
          <input
            type="search"
            placeholder="Search series…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-9 w-full max-w-xs rounded-lg border border-border bg-background px-3 text-sm outline-none ring-primary focus:ring-2 sm:w-auto"
          />
        </div>
        <div className="max-h-[28rem] overflow-auto rounded-md border border-border/60">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Series</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Tracks</TableHead>
                <TableHead className="text-right">
                  <MetricLabel metricKey="top_content_plays">Plays (28d)</MetricLabel>
                </TableHead>
                <TableHead className="text-right">
                  {showUploadPlaySplit ? (
                    <MetricLabel metricKey="series_playlist_plays_lifetime">
                      Playlist plays (lifetime)
                    </MetricLabel>
                  ) : (
                    "Plays (lifetime)"
                  )}
                </TableHead>
                {showUploadPlaySplit ? (
                  <TableHead className="text-right">
                    <MetricLabel metricKey="series_stories_track_plays_lifetime">
                      Stories track plays (lifetime)
                    </MetricLabel>
                  </TableHead>
                ) : null}
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={showUploadPlaySplit ? 7 : 6}
                    className="text-center text-muted-foreground"
                  >
                    No series match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="max-w-[14rem] font-medium leading-snug">{row.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{CATEGORY_LABEL[row.category]}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.trackCount}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.plays28d !== null ? formatCompact(row.plays28d) : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {row.playsTotal !== null ? formatCompact(row.playsTotal) : "—"}
                    </TableCell>
                    {showUploadPlaySplit ? (
                      <TableCell className="text-right tabular-nums">
                        {row.playsTotalStoriesTracks != null
                          ? formatCompact(row.playsTotalStoriesTracks)
                          : "—"}
                      </TableCell>
                    ) : null}
                    <TableCell className="text-xs text-muted-foreground">
                      {row.metricsSource ?? "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {tableRows.length} series
        </p>
      </CardContent>
    </Card>
  );
}
