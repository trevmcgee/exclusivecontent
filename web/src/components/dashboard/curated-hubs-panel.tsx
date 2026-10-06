"use client";

import { ExternalLink } from "lucide-react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceNotesPanel } from "@/components/dashboard/voice-notes-panel";
import type { CuratedHub, CuratedHubTrack, VoiceNotesData } from "@/lib/dashboard";
import { formatCompact } from "@/lib/utils";

function MetricCell({
  metricKey,
  value,
}: {
  metricKey: string;
  value: number | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
      <p className="text-xs text-muted-foreground">
        <MetricLabel metricKey={metricKey} />
      </p>
      <p className="text-lg font-semibold tabular-nums">
        {value != null ? formatCompact(value) : "—"}
      </p>
    </div>
  );
}

function hubUsesLifetimePlays(hub: CuratedHub): boolean {
  return hub.metricsSource === "soundcloud_public" || hub.playsTotal != null;
}

function trackPlaysLine(track: CuratedHubTrack, lifetimePrimary: boolean): string | null {
  const total = track.playsTotal;
  const plays28d = track.plays28d;
  if (lifetimePrimary && total != null) {
    const secondary =
      plays28d != null ? ` · ${formatCompact(plays28d)} plays (28d)` : "";
    return `${formatCompact(total)} total plays${secondary}`;
  }
  if (plays28d != null) {
    return `${formatCompact(plays28d)} plays (28d)`;
  }
  if (total != null) {
    return `${formatCompact(total)} total plays`;
  }
  return null;
}

function trackLikesLine(track: CuratedHubTrack, lifetimePrimary: boolean): string | null {
  if (lifetimePrimary && track.likesTotal != null) {
    return `${formatCompact(track.likesTotal)} likes (lifetime)`;
  }
  if (track.likes28d != null) {
    return `${formatCompact(track.likes28d)} likes (28d)`;
  }
  if (track.likesTotal != null) {
    return `${formatCompact(track.likesTotal)} likes (lifetime)`;
  }
  return null;
}

export function CuratedHubsPanel({
  hubs,
  voiceNotes,
  embeddedInModule = false,
}: {
  hubs: CuratedHub[];
  voiceNotes?: VoiceNotesData;
  embeddedInModule?: boolean;
}) {
  if (!hubs.length) return null;

  return (
    <div className="min-w-0 space-y-3">
      {!embeddedInModule ? (
        <div>
          <h3 className="text-base font-semibold tracking-tight">Curated hubs</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Official playlists and album collections — expand a hub for track-level KPIs.
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {hubs.length} destinations — expand a hub for track-level KPIs and Voice Notes.
        </p>
      )}
      <Card className={embeddedInModule ? "border-border/60" : "border-primary/15"}>
        {!embeddedInModule ? (
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Hub directory</CardTitle>
            <CardDescription>{hubs.length} destinations · collapsed by default</CardDescription>
          </CardHeader>
        ) : null}
        <Accordion
          type="multiple"
          defaultValue={[]}
          className={embeddedInModule ? "px-4 pb-4" : "px-5 pb-5"}
        >
          {hubs.map((hub) => {
            const lifetimePrimary = hubUsesLifetimePlays(hub);
            const headlinePlays = lifetimePrimary
              ? hub.playsTotal ?? hub.plays28d
              : hub.plays28d ?? hub.playsTotal;
            const headlineLikes = lifetimePrimary
              ? hub.likesTotal ?? hub.likes28d
              : hub.likes28d ?? hub.likesTotal;

            return (
              <AccordionItem key={hub.id} value={hub.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 flex-col gap-2 pr-2 text-left sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{hub.title}</span>
                        <a
                          href={hub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-primary hover:text-primary/80"
                          aria-label={`Open ${hub.title} on SoundCloud`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="line-clamp-2 text-xs font-normal text-muted-foreground">
                        {hub.description}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-0.5">
                        <Badge variant="secondary">{hub.trackCount.toLocaleString()} tracks</Badge>
                        {hub.metricsSource ? (
                          <Badge variant="outline">
                            Metrics: {hub.metricsSource.replace(/_/g, " ")}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Metrics pending</Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-normal text-muted-foreground sm:text-right">
                      {headlinePlays != null ? (
                        <span className="block tabular-nums">
                          {formatCompact(headlinePlays)}{" "}
                          {lifetimePrimary && hub.playsTotal != null ? "total plays" : "plays (28d)"}
                        </span>
                      ) : (
                        <span className="block">Plays —</span>
                      )}
                      {headlineLikes != null ? (
                        <span className="block tabular-nums">
                          {formatCompact(headlineLikes)}{" "}
                          {lifetimePrimary && hub.likesTotal != null ? "likes (lifetime)" : "likes (28d)"}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-1">
                    {hub.metricsSource === "soundcloud_public" ? (
                      <p className="text-xs text-muted-foreground">
                        Play and like totals are SoundCloud public lifetime counters for tracks
                        visible in the playlist embed. Run BigQuery export when slot time allows for
                        audited 28-day metrics.
                      </p>
                    ) : null}
                    {hub.id === "voice_notes_albums" && voiceNotes ? (
                      <VoiceNotesPanel data={voiceNotes} embedded />
                    ) : hub.id === "voice_notes_albums" ? (
                      <p className="text-xs text-muted-foreground">
                        Voice Notes masterlist not loaded in this snapshot.
                      </p>
                    ) : null}
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                      <MetricCell
                        metricKey={lifetimePrimary ? "hub_plays_total" : "hub_plays_28d"}
                        value={headlinePlays}
                      />
                      {!lifetimePrimary && hub.playsTotal != null ? (
                        <MetricCell metricKey="hub_plays_total" value={hub.playsTotal} />
                      ) : null}
                      {lifetimePrimary && hub.plays28d != null ? (
                        <MetricCell metricKey="hub_plays_28d" value={hub.plays28d} />
                      ) : null}
                      <MetricCell metricKey="hub_reach_28d" value={hub.activeUsers28d} />
                      <MetricCell
                        metricKey={lifetimePrimary ? "hub_likes_total" : "hub_likes_28d"}
                        value={headlineLikes}
                      />
                      <MetricCell metricKey="hub_shares_28d" value={hub.shares28d} />
                      <MetricCell metricKey="hub_reposts_28d" value={hub.reposts28d} />
                    </div>
                    {hub.tracks.length > 0 ? (
                      <ul className="space-y-2 border-t border-border/60 pt-3 text-sm">
                        {hub.tracks.map((t) => {
                          const playsLine = trackPlaysLine(t, lifetimePrimary);
                          const likesLine = trackLikesLine(t, lifetimePrimary);
                          const label = t.title || "Untitled track";
                          const key = t.trackUrn || t.trackUrl || label;

                          return (
                            <li key={key} className="flex flex-col gap-0.5 rounded-lg border border-border/50 bg-muted/20 px-3 py-2">
                              {t.trackUrl ? (
                                <a
                                  href={t.trackUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-foreground hover:text-primary line-clamp-2"
                                >
                                  {label}
                                </a>
                              ) : (
                                <span className="font-medium line-clamp-2">{label}</span>
                              )}
                              {playsLine || likesLine ? (
                                <span className="text-xs text-muted-foreground">
                                  {[playsLine, likesLine].filter(Boolean).join(" · ")}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Metrics pending for this track
                                </span>
                              )}
                            </li>
                          );
                        })}
                        {hub.trackCount > hub.tracks.length ? (
                          <li className="text-xs text-muted-foreground">
                            Showing {hub.tracks.length} of {hub.trackCount} tracks in this snapshot.
                          </li>
                        ) : null}
                      </ul>
                    ) : null}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </Card>
    </div>
  );
}
