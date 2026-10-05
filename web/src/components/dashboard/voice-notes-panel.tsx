"use client";

import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronDown, Mic2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { VoiceNotesCharts } from "@/components/dashboard/voice-notes-charts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Trend, VoiceNotesData } from "@/lib/dashboard";
import { cn, formatCompact, formatDelta } from "@/lib/utils";

function MetricDelta({ value, trend }: { value: number | null; trend: Trend }) {
  if (value === null) return <span className="text-muted-foreground">—</span>;
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : ArrowRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 tabular-nums",
        trend === "up" && "text-emerald-400",
        trend === "down" && "text-amber-400",
        trend === "flat" && "text-muted-foreground",
      )}
    >
      <Icon className="h-3 w-3" />
      {formatDelta(value)}
    </span>
  );
}

export function VoiceNotesPanel({ data }: { data: VoiceNotesData }) {
  const [query, setQuery] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const showMetrics = data.hasMetrics;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.playlists;
    return data.playlists.filter(
      (p) =>
        p.artistName.toLowerCase().includes(q) ||
        p.tracks.some((t) => t.title.toLowerCase().includes(q)),
    );
  }, [data.playlists, query]);

  return (
    <div className="space-y-6">
      {data.metricsSource === "portfolio_estimate" ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-3 text-sm text-muted-foreground">
            Track play metrics are estimated from portfolio totals until per-track BigQuery export is
            added.
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total tracks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data.totalTracks}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Plays (28d)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data.plays28dTotal !== null ? formatCompact(data.plays28dTotal) : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active users (28d)</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {data.activeUsers28dTotal !== null ? formatCompact(data.activeUsers28dTotal) : "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Artist playlists</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data.playlistCount}</CardContent>
        </Card>
      </div>

      <VoiceNotesCharts data={data} />

      <Card>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 p-5 text-left"
          onClick={() => setLibraryOpen((v) => !v)}
          aria-expanded={libraryOpen}
        >
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Mic2 className="h-5 w-5 text-primary" />
              Voice Notes library
            </CardTitle>
            <CardDescription className="mt-1">
              {data.playlistCount} artist playlists · {data.totalTracks} tracks — click to{" "}
              {libraryOpen ? "collapse" : "expand"}
            </CardDescription>
          </div>
          <ChevronDown
            className={cn("h-5 w-5 shrink-0 text-muted-foreground transition", libraryOpen && "rotate-180")}
          />
        </button>

        {libraryOpen ? (
          <CardContent className="border-t border-border/60 pt-4">
            <label className="relative mb-4 block max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search artist or track…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
              />
            </label>

            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground">No playlists match your search.</p>
            ) : (
              <Accordion type="multiple" className="w-full">
                {filtered.map((playlist) => (
                  <AccordionItem key={playlist.id} value={playlist.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex flex-1 flex-col items-start gap-1 pr-2 text-left sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold">{playlist.artistName}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {playlist.trackCount} tracks
                          {showMetrics && playlist.plays28dTotal !== null
                            ? ` · ${formatCompact(playlist.plays28dTotal)} plays`
                            : null}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-3 pt-1">
                        {playlist.tracks.map((track) => (
                          <li
                            key={track.trackUrn || track.title}
                            className="rounded-lg border border-border/50 bg-background/40 px-3 py-2.5"
                          >
                            <p className="text-sm font-medium leading-snug">{track.title}</p>
                            {showMetrics ? (
                              <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
                                <div>
                                  <p className="text-muted-foreground">Plays (28d)</p>
                                  <p className="font-semibold tabular-nums">
                                    {track.plays28d !== null ? formatCompact(track.plays28d) : "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Active users (28d)</p>
                                  <p className="font-semibold tabular-nums">
                                    {track.activeUsers28d !== null
                                      ? formatCompact(track.activeUsers28d)
                                      : "—"}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Change</p>
                                  <MetricDelta
                                    value={track.playsChangePct}
                                    trend={track.playsTrend}
                                  />
                                </div>
                              </div>
                            ) : null}
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span>{track.publishedDate || "—"}</span>
                              <Badge variant={track.trackStatus === "public" ? "success" : "muted"}>
                                {track.trackStatus || "unknown"}
                              </Badge>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}
