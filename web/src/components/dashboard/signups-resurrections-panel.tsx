"use client";

import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  SignupsResurrectionsData,
  SignupsResurrectionsSeries,
  SignupsResurrectionsTrackRow,
} from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";

type TrackSort = "top_performer" | "date_newest" | "date_oldest";

const SELECT_CLASS =
  "relative z-10 w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const TRACK_SORT_LABEL: Record<TrackSort, string> = {
  top_performer: "Top performer",
  date_newest: "Publish date (newest first)",
  date_oldest: "Publish date (oldest first)",
};

const EMPTY_TRACK_ROWS: SignupsResurrectionsTrackRow[] = [];

const HUB_LABEL: Record<string, string> = {
  the_booth: "The Booth",
  sound_advice: "Sound Advice",
  the_upload: "The Upload",
  voice_notes_albums: "Voice Notes",
};

function defaultSeriesId(series: SignupsResurrectionsSeries[]): string {
  return series.find((s) => s.hasData)?.id ?? series[0]?.id ?? "sound_advice";
}

function performanceScore(row: SignupsResurrectionsTrackRow): number {
  return row.signups + row.resurrections + (row.subscriptions ?? 0) + (row.trials ?? 0);
}

function sortTracks(rows: SignupsResurrectionsTrackRow[], sort: TrackSort): SignupsResurrectionsTrackRow[] {
  const copy = [...rows];
  if (sort === "top_performer") {
    return copy.sort((a, b) => performanceScore(b) - performanceScore(a));
  }
  if (sort === "date_newest") {
    return copy.sort((a, b) => {
      const da = a.publishedDate ?? "";
      const db = b.publishedDate ?? "";
      if (da && db) return db.localeCompare(da);
      if (db && !da) return 1;
      if (da && !db) return -1;
      return performanceScore(b) - performanceScore(a);
    });
  }
  return copy.sort((a, b) => {
    const da = a.publishedDate ?? "";
    const db = b.publishedDate ?? "";
    if (da && db) return da.localeCompare(db);
    if (da && !db) return -1;
    if (db && !da) return 1;
    return performanceScore(b) - performanceScore(a);
  });
}

export function SignupsResurrectionsPanel({
  data,
  embeddedInModule = false,
}: {
  data: SignupsResurrectionsData | undefined;
  embeddedInModule?: boolean;
}) {
  const catalog = data?.series ?? [];
  const [selectedId, setSelectedId] = useState<string>(() => defaultSeriesId(catalog));
  const [trackSort, setTrackSort] = useState<TrackSort>("top_performer");
  const selectValue = catalog.some((s) => s.id === selectedId)
    ? selectedId
    : defaultSeriesId(catalog);

  const selected = useMemo(() => {
    if (!catalog.length) return undefined;
    return catalog.find((s) => s.id === selectValue) ?? catalog[0];
  }, [catalog, selectValue]);

  const hasAnyData = catalog.some((s) => s.hasData);
  const trackRows = selected?.byTrack ?? EMPTY_TRACK_ROWS;

  const sortedTracks = useMemo(() => {
    if (!trackRows.length) return [];
    return sortTracks(trackRows, trackSort);
  }, [trackRows, trackSort]);

  if (!catalog.length) {
    return (
      <Card className={embeddedInModule ? "border-border/60 shadow-none" : "border-dashed border-primary/25"}>
        <CardHeader>
          <CardTitle>Signups, resurrections, and subscriptions</CardTitle>
          <CardDescription>
            Run{" "}
            <code className="text-xs">fetch_signups_resurrections.py</code> (batched BigQuery) or import
            a Looker export, then rebuild <code className="text-xs">dashboard.json</code>.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const summary = selected?.summary;
  const windowLabel =
    selected?.analysisStart && selected?.analysisEnd
      ? `${selected.analysisStart} → ${selected.analysisEnd}`
      : "Analysis window";

  return (
    <div className="space-y-4">
      {!embeddedInModule ? (
        <p className="text-sm text-muted-foreground">
          First-touch attribution (±1 day): signups, resurrections, and subscription starts linked to
          target tracks. Choose a Stories series below.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 sm:max-w-3xl">
        <div className="space-y-1.5">
          <label htmlFor="growth-series-select" className="text-xs font-medium text-muted-foreground">
            Series
          </label>
          <select
            id="growth-series-select"
            value={selectValue}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setTrackSort("top_performer");
            }}
            className={SELECT_CLASS}
          >
            {catalog.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {!s.hasData ? " (no data yet)" : ""}
              </option>
            ))}
          </select>
        </div>
        {selected?.hasData ? (
          <div className="space-y-1.5">
            <label htmlFor="growth-track-sort" className="text-xs font-medium text-muted-foreground">
              Sort tracks
            </label>
            <select
              id="growth-track-sort"
              value={trackSort}
              onChange={(e) => setTrackSort(e.target.value as TrackSort)}
              className={SELECT_CLASS}
            >
              {(Object.keys(TRACK_SORT_LABEL) as TrackSort[]).map((key) => (
                <option key={key} value={key}>
                  {TRACK_SORT_LABEL[key]}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>

      {!selected?.hasData ? (
        <Card className="border-dashed border-border/80">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{selected?.name ?? "Series"}</CardTitle>
            <CardDescription>
              No attributed growth data for this series yet. Import a CSV to{" "}
              <code className="text-xs">csv/signups_resurrections/{selected?.id}_by_track.csv</code>{" "}
              and rebuild the dashboard, or run BigQuery fetch for this hub.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>
                  <MetricLabel metricKey="attributed_signups">Signups</MetricLabel>
                </CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {formatCompact(summary?.totalSignups ?? 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>
                  <MetricLabel metricKey="attributed_resurrections">Resurrections</MetricLabel>
                </CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {formatCompact(summary?.totalResurrections ?? 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>
                  <MetricLabel metricKey="attributed_subscriptions">Subscription starts</MetricLabel>
                </CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {formatCompact(summary?.totalSubscriptions ?? 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardDescription>
                  <MetricLabel metricKey="attributed_trials">Trials</MetricLabel>
                </CardDescription>
                <CardTitle className="text-2xl tabular-nums">
                  {formatCompact(summary?.totalTrials ?? 0)}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
          <p className="text-xs text-muted-foreground">
            {selected.label ??
              (hasAnyData
                ? windowLabel
                : "First-touch attribution (±1 day) for target tracks in this series.")}
          </p>
          <Card className={embeddedInModule ? "border-border/60 shadow-none" : undefined}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">By target track — {selected.name}</CardTitle>
              <CardDescription>{TRACK_SORT_LABEL[trackSort]}</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[28rem] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Track</TableHead>
                    <TableHead className="whitespace-nowrap">Published</TableHead>
                    <TableHead>Hub</TableHead>
                    <TableHead className="text-right">Signups</TableHead>
                    <TableHead className="text-right">Resurrections</TableHead>
                    <TableHead className="text-right">Subs</TableHead>
                    <TableHead className="text-right">Trials</TableHead>
                    <TableHead className="text-right">Su+Res</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTracks.map((row) => (
                    <TableRow key={row.permalink}>
                      <TableCell className="max-w-[16rem]">
                        <div className="flex items-start gap-1.5">
                          <span className="line-clamp-2 text-sm leading-snug">
                            {row.title || row.permalink}
                          </span>
                          {row.trackUrl ? (
                            <a
                              href={row.trackUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-primary"
                              aria-label="Open track on SoundCloud"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs tabular-nums text-muted-foreground">
                        {row.publishedDate ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.hubId ? (HUB_LABEL[row.hubId] ?? row.hubId) : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompact(row.signups)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompact(row.resurrections)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompact(row.subscriptions ?? 0)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompact(row.trials ?? 0)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-medium">
                        {formatCompact(row.growthEvents)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
