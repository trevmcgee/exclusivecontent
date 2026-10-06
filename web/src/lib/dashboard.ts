import fs from "fs";
import path from "path";

export type Trend = "up" | "down" | "flat";

export type Kpi = {
  id: string;
  label: string;
  value: number;
  unit: "count" | "ratio";
  deltaPct: number;
  trend: Trend;
};

export type TimeseriesPoint = {
  date: string;
  plays: number;
  reach: number;
};

export type ProductBlock = {
  id: string;
  name: string;
  description: string;
  kpis: Kpi[];
  timeseries: TimeseriesPoint[];
};

export type TopContentRow = {
  id: string;
  product: string;
  title: string;
  publishedAt: string;
  plays28d: number;
  activeUsers28d: number;
  playsChangePct: number;
  playsTrend: Trend;
  engagementRate: number;
  status: string;
};

export type VoiceNoteTrack = {
  title: string;
  trackUrn: string;
  trackStatus: string;
  publishedDate: string;
  trackPermalink: string;
  tags: string[];
  plays28d: number | null;
  playsTotal: number | null;
  likesTotal: number | null;
  activeUsers28d: number | null;
  playsChangePct: number | null;
  playsTrend: Trend;
};

export type VoiceNotesPlaylist = {
  id: string;
  artistName: string;
  trackCount: number;
  publicCount: number;
  latestPublished: string;
  plays28dTotal: number | null;
  playsTotal: number | null;
  likesTotal: number | null;
  activeUsers28dTotal: number | null;
  tracks: VoiceNoteTrack[];
};

export type CuratedHubTrack = {
  title: string;
  trackUrl: string;
  trackUrn: string;
  plays28d: number | null;
  playsTotal: number | null;
  activeUsers28d: number | null;
  likes28d: number | null;
  likesTotal: number | null;
  shares28d: number | null;
};

export type CuratedHub = {
  id: string;
  hubGroup?: "flagship" | "editorial" | string;
  /** Playlist/set launch date (YYYY-MM-DD) for editorial sort order. */
  publishedAt?: string | null;
  title: string;
  description: string;
  url: string;
  trackCount: number;
  tracksWithUrn: number;
  plays28d: number | null;
  plays28dStoriesTracks?: number | null;
  playsTotal: number | null;
  playsTotalStoriesTracks?: number | null;
  activeUsers28d: number | null;
  likes28d: number | null;
  likesTotal: number | null;
  shares28d: number | null;
  reposts28d: number | null;
  hasMetrics: boolean;
  metricsSource: string | null;
  tracks: CuratedHubTrack[];
};

export type VoiceNotesData = {
  snapshotDate: string;
  totalTracks: number;
  playlistCount: number;
  publicTracks: number;
  plays28dTotal: number | null;
  playsTotal: number | null;
  likesTotal: number | null;
  activeUsers28dTotal: number | null;
  hasMetrics: boolean;
  metricsSource?: string | null;
  playlists: VoiceNotesPlaylist[];
};

export type CuratedSeriesGrowthPoint = {
  date: string;
  dayIndex: number;
  cumulativePlays: number;
};

export type SignupsResurrectionsTrackRow = {
  permalink: string;
  trackUrn: string;
  trackUrl: string;
  title: string;
  hubId: string | null;
  publishedDate?: string | null;
  signups: number;
  resurrections: number;
  subscriptions: number;
  trials: number;
  growthEvents: number;
};

export type SignupsResurrectionsSummary = {
  totalSignups: number;
  totalResurrections: number;
  totalSubscriptions: number;
  totalTrials: number;
  totalGrowthEvents: number;
};

export type SignupsResurrectionsSeries = {
  id: string;
  name: string;
  hubId: string;
  methodology?: string | null;
  source?: string | null;
  label?: string | null;
  analysisStart?: string | null;
  analysisEnd?: string | null;
  hasData: boolean;
  summary: SignupsResurrectionsSummary;
  byTrack: SignupsResurrectionsTrackRow[];
};

export type SignupsResurrectionsData = {
  series: SignupsResurrectionsSeries[];
};

const SIGNUPS_RESURRECTIONS_SERIES_CATALOG: Pick<
  SignupsResurrectionsSeries,
  "id" | "name" | "hubId"
>[] = [
  { id: "sound_advice", name: "Sound Advice", hubId: "sound_advice" },
  { id: "the_booth", name: "The Booth", hubId: "the_booth" },
  { id: "voice_notes", name: "Voice Notes", hubId: "voice_notes_albums" },
];

const EMPTY_SIGNUPS_SUMMARY: SignupsResurrectionsSummary = {
  totalSignups: 0,
  totalResurrections: 0,
  totalSubscriptions: 0,
  totalTrials: 0,
  totalGrowthEvents: 0,
};

type LegacySignupsResurrectionsPayload = {
  methodology?: string | null;
  source?: string | null;
  label?: string | null;
  analysisStart?: string | null;
  analysisEnd?: string | null;
  summary?: SignupsResurrectionsSummary;
  byHub?: { hubId: string }[];
  byTrack?: SignupsResurrectionsTrackRow[];
};

function normalizeTrackRow(track: SignupsResurrectionsTrackRow): SignupsResurrectionsTrackRow {
  const signups = track.signups ?? 0;
  const resurrections = track.resurrections ?? 0;
  const subscriptions = track.subscriptions ?? 0;
  const trials = track.trials ?? 0;
  const growthEvents =
    track.growthEvents ?? (signups + resurrections > 0 ? signups + resurrections : 0);
  return {
    ...track,
    signups,
    resurrections,
    subscriptions,
    trials,
    growthEvents,
  };
}

function normalizeSeriesEntry(
  spec: Pick<SignupsResurrectionsSeries, "id" | "name" | "hubId">,
  existing?: Partial<SignupsResurrectionsSeries> | null,
): SignupsResurrectionsSeries {
  const byTrack = (existing?.byTrack ?? []).map(normalizeTrackRow);
  const hasData = Boolean(existing?.hasData ?? byTrack.length);
  const summary: SignupsResurrectionsSummary = {
    ...EMPTY_SIGNUPS_SUMMARY,
    ...existing?.summary,
  };
  if (hasData && byTrack.length) {
    summary.totalSignups = byTrack.reduce((n, r) => n + r.signups, 0);
    summary.totalResurrections = byTrack.reduce((n, r) => n + r.resurrections, 0);
    summary.totalSubscriptions = byTrack.reduce((n, r) => n + r.subscriptions, 0);
    summary.totalTrials = byTrack.reduce((n, r) => n + r.trials, 0);
    summary.totalGrowthEvents = byTrack.reduce((n, r) => n + r.growthEvents, 0);
  }
  return {
    id: spec.id,
    name: existing?.name ?? spec.name,
    hubId: existing?.hubId ?? spec.hubId,
    methodology: existing?.methodology ?? null,
    source: existing?.source ?? null,
    label: existing?.label ?? null,
    analysisStart: existing?.analysisStart ?? null,
    analysisEnd: existing?.analysisEnd ?? null,
    hasData,
    summary,
    byTrack,
  };
}

function emptySignupsSeries(
  spec: Pick<SignupsResurrectionsSeries, "id" | "name" | "hubId">,
): SignupsResurrectionsSeries {
  return normalizeSeriesEntry(spec, null);
}

function normalizeSignupsResurrections(
  raw: SignupsResurrectionsData | LegacySignupsResurrectionsPayload | undefined,
): SignupsResurrectionsData | undefined {
  if (!raw) return undefined;

  if ("series" in raw && Array.isArray(raw.series) && raw.series.length) {
    const byId = new Map(raw.series.map((s) => [s.id, s]));
    return {
      series: SIGNUPS_RESURRECTIONS_SERIES_CATALOG.map((spec) =>
        normalizeSeriesEntry(spec, byId.get(spec.id)),
      ),
    };
  }

  const legacy = raw as LegacySignupsResurrectionsPayload;
  const tracks = legacy.byTrack ?? [];
  if (!tracks.length && !legacy.summary) return undefined;

  const hubFromMeta =
    legacy.byHub?.[0]?.hubId ??
    tracks.find((t) => t.hubId)?.hubId ??
    "sound_advice";
  const targetId =
    SIGNUPS_RESURRECTIONS_SERIES_CATALOG.find((s) => s.hubId === hubFromMeta)?.id ??
    "sound_advice";

  const spec =
    SIGNUPS_RESURRECTIONS_SERIES_CATALOG.find((s) => s.id === targetId) ??
    SIGNUPS_RESURRECTIONS_SERIES_CATALOG[0];
  const filled = normalizeSeriesEntry(spec, {
    hubId: hubFromMeta,
    methodology: legacy.methodology ?? null,
    source: legacy.source ?? null,
    label: legacy.label ?? null,
    analysisStart: legacy.analysisStart ?? null,
    analysisEnd: legacy.analysisEnd ?? null,
    hasData: tracks.length > 0,
    summary: legacy.summary,
    byTrack: tracks.map(normalizeTrackRow),
  });

  return {
    series: SIGNUPS_RESURRECTIONS_SERIES_CATALOG.map((s) =>
      s.id === targetId ? filled : emptySignupsSeries(s),
    ),
  };
}

export type CuratedSeriesGrowth = {
  id: string;
  name: string;
  seriesStart: string;
  playsScope: "all_playlist_tracks" | "soundcloud_stories_tracks";
  points: CuratedSeriesGrowthPoint[];
};

export type SeriesPlayCount = {
  id: string;
  name: string;
  category: "editorial" | "voice_notes" | "curated_hub";
  productLabel: string | null;
  trackCount: number;
  plays28d: number | null;
  plays28dStoriesTracks?: number | null;
  playsTotal: number | null;
  playsTotalStoriesTracks?: number | null;
  likes28d?: number | null;
  likesTotal?: number | null;
  activeUsers28d: number | null;
  playsChangePct: number | null;
  playsTrend: Trend;
  metricsSource: string | null;
  status: string | null;
};

export type DashboardData = {
  updatedAt: string;
  source: string;
  overview: {
    totalPlays?: number | null;
    totalPlays28d?: number | null;
    totalLikes?: number | null;
    totalReach28d?: number | null;
    activeSeries?: number;
    avgCompletionRate?: number;
  };
  products: ProductBlock[];
  topContent: TopContentRow[];
  voiceNotes?: VoiceNotesData;
  curatedHubs?: CuratedHub[];
  seriesPlayCounts?: SeriesPlayCount[];
  curatedSeriesGrowth?: CuratedSeriesGrowth[];
  signupsResurrections?: SignupsResurrectionsData;
};

function resolveDataPath(): string {
  const candidates: string[] = [];
  if (process.env.DASHBOARD_DATA_PATH) {
    candidates.push(process.env.DASHBOARD_DATA_PATH);
  }
  candidates.push(path.join(process.cwd(), "..", "data", "dashboard.json"));
  candidates.push(path.join(process.cwd(), "data", "dashboard.json"));

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) return filePath;
  }

  throw new Error(
    "dashboard.json not found. Set DASHBOARD_DATA_PATH or run npm run dev from exclusivecontent/web.",
  );
}

export function loadDashboard(): DashboardData {
  const filePath = resolveDataPath();
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as DashboardData & {
    subscriptionGrowth?: SignupsResurrectionsData | LegacySignupsResurrectionsPayload;
    signupsResurrections?: SignupsResurrectionsData | LegacySignupsResurrectionsPayload;
  };
  const srRaw = data.signupsResurrections ?? data.subscriptionGrowth;
  data.signupsResurrections = normalizeSignupsResurrections(srRaw);
  delete data.subscriptionGrowth;
  return data;
}
