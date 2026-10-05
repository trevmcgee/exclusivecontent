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
};

export type VoiceNotesPlaylist = {
  id: string;
  artistName: string;
  trackCount: number;
  publicCount: number;
  latestPublished: string;
  tracks: VoiceNoteTrack[];
};

export type VoiceNotesData = {
  snapshotDate: string;
  totalTracks: number;
  playlistCount: number;
  publicTracks: number;
  playlists: VoiceNotesPlaylist[];
};

export type DashboardData = {
  updatedAt: string;
  source: string;
  overview: {
    totalPlays28d: number;
    totalReach28d: number;
    activeSeries: number;
    avgCompletionRate: number;
  };
  products: ProductBlock[];
  topContent: TopContentRow[];
  voiceNotes?: VoiceNotesData;
};

function resolveDataPath(): string {
  const override = process.env.DASHBOARD_DATA_PATH;
  if (override) return override;
  return path.join(process.cwd(), "..", "data", "dashboard.json");
}

export function loadDashboard(): DashboardData {
  const filePath = resolveDataPath();
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as DashboardData;
}
