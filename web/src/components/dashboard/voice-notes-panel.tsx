"use client";

import { ChevronDown, Mic2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { VoiceNotesData } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

function PlaylistCard({
  playlist,
  defaultOpen,
}: {
  playlist: VoiceNotesData["playlists"][number];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        className="flex w-full items-start justify-between gap-3 p-5 text-left transition hover:bg-muted/20"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div>
          <h3 className="text-base font-semibold">{playlist.artistName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {playlist.trackCount} tracks · {playlist.publicCount} public · Latest{" "}
            {playlist.latestPublished || "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">Playlist</Badge>
          <ChevronDown className={cn("h-4 w-4 shrink-0 transition", open && "rotate-180")} />
        </div>
      </button>
      {open ? (
        <CardContent className="border-t border-border/60 pt-4">
          <ul className="space-y-3">
            {playlist.tracks.map((track) => (
              <li
                key={track.trackUrn || track.title}
                className="rounded-lg border border-border/50 bg-background/40 px-3 py-2.5"
              >
                <p className="text-sm font-medium leading-snug">{track.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{track.publishedDate || "—"}</span>
                  <Badge variant={track.trackStatus === "public" ? "success" : "muted"}>
                    {track.trackStatus || "unknown"}
                  </Badge>
                  {track.trackPermalink ? (
                    <span className="font-mono text-[10px] opacity-80">{track.trackPermalink}</span>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  );
}

export function VoiceNotesPanel({ data }: { data: VoiceNotesData }) {
  const [query, setQuery] = useState("");

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total tracks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data.totalTracks}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Artist playlists</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data.playlistCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Public tracks</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{data.publicTracks}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-semibold">{data.snapshotDate || "—"}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Mic2 className="h-5 w-5 text-primary" />
                Voice Notes library
              </CardTitle>
              <CardDescription>
                Tracks grouped by artist name — each artist is one playlist.
              </CardDescription>
            </div>
            <label className="relative block min-w-[240px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search artist or track…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none ring-primary focus:ring-2"
              />
            </label>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {filtered.map((playlist, index) => (
            <PlaylistCard key={playlist.id} playlist={playlist} defaultOpen={index < 2 && !query} />
          ))}
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No playlists match your search.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
