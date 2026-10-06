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
  title: string;
  description: string;
  url: string;
  trackCount: number;
  tracksWithUrn: number;
  plays28d: number | null;
  playsTotal: number | null;
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

export type SeriesPlayCount = {
  id: string;
  name: string;
  category: "editorial" | "voice_notes" | "curated_hub";
  productLabel: string | null;
  trackCount: number;
  plays28d: number | null;
  playsTotal: number | null;
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
  return JSON.parse(raw) as DashboardData;
}
