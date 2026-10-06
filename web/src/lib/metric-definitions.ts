export type MetricDefinition = {
  title: string;
  description: string;
  formula?: string;
  source?: string;
};

/** Central glossary for KPI labels shown in the dashboard UI. */
export const METRIC_DEFINITIONS: Record<string, MetricDefinition> = {
  total_plays: {
    title: "Total plays",
    description:
      "Lifetime play count summed across every row in Play counts by series (curated hubs plus optional editorial series from series_plays.csv).",
    source: "build_dashboard.py → sum(seriesPlayCounts.playsTotal)",
  },
  total_plays_28d: {
    title: "Total plays (28d)",
    description:
      "Rolling 28-day plays summed across Play counts by series. When hub rows only have lifetime public counters, this may fall back to overview.csv until BigQuery 28-day export is wired.",
    source: "sum(seriesPlayCounts.plays28d) or overview.csv → total_plays_28d",
  },
  total_likes: {
    title: "Total likes",
    description:
      "Lifetime likes summed across Play counts by series (SoundCloud public counters on curated hub rollups).",
    source: "sum(seriesPlayCounts.likesTotal)",
  },
  total_reach: {
    title: "Total reach",
    description:
      "28-day distinct active users summed across series rows when exported; otherwise portfolio reach from overview.csv.",
    formula: "COUNT(DISTINCT listener) over 28d window (per series export)",
    source: "sum(seriesPlayCounts.activeUsers28d) or overview.csv → total_reach_28d",
  },
  reach_28d: {
    title: "Reach (28d)",
    description:
      "Distinct active users (listeners) who played exclusive content in the last 28 days. Daily charts plot the same reach field from timeseries exports.",
    formula: "COUNT(DISTINCT listener) over 28d window (per product export)",
    source: "overview.csv → total_reach_28d; kpi_timeseries.csv → reach",
  },
  active_series_overview: {
    title: "Active series (portfolio)",
    description:
      "Series count at portfolio level. When Voice Notes data is included, this number is the count of artist playlists (one playlist per artist voice-note series). Otherwise it comes from overview.csv (e.g. editorial series still publishing).",
    source:
      "build_dashboard.py sets overview.activeSeries = voiceNotes.playlistCount when masterlist is present; else overview.csv → active_series",
  },
  avg_completion: {
    title: "Avg completion",
    description:
      "Average listen-through rate across series-style products in the snapshot (how much of each episode listeners typically finish).",
    source: "overview.csv → avg_completion_rate",
  },
  plays_28d: {
    title: "Plays (28d)",
    description: "Total plays in the last 28 days for this product line.",
    source: "kpi_summary.csv → kpi_id plays_28d",
  },
  series_active: {
    title: "Active series",
    description:
      "SoundCloud Stories series that are currently live or still publishing new episodes—not ended or archived runs.",
    source: "kpi_summary.csv → kpi_id series_active (soundcloud_stories)",
  },
  followers_net_28d: {
    title: "Net followers (28d)",
    description: "Net change in followers on official Account programming over the last 28 days.",
    source: "kpi_summary.csv → followers_net_28d",
  },
  posts_published_28d: {
    title: "Posts published (28d)",
    description: "Number of new Account posts published in the last 28 days.",
    source: "kpi_summary.csv → posts_published_28d",
  },
  engagement_rate: {
    title: "Engagement rate",
    description: "Share of Account audience that liked, reposted, commented, or saved relative to reach.",
    source: "kpi_summary.csv → engagement_rate",
  },
  completion_rate: {
    title: "Avg completion",
    description: "Average completion rate for Stories episodes in the last 28 days.",
    source: "kpi_summary.csv → completion_rate",
  },
  saves_28d: {
    title: "Saves (28d)",
    description: "Total saves (likes to library) on Stories content in the last 28 days.",
    source: "kpi_summary.csv → saves_28d",
  },
  listeners_28d: {
    title: "Listeners (28d)",
    description: "Distinct listeners for Historias programming in the last 28 days.",
    source: "kpi_summary.csv → listeners_28d",
  },
  episodes_28d: {
    title: "Episodes published (28d)",
    description: "New Historias episodes published in the last 28 days.",
    source: "kpi_summary.csv → episodes_28d",
  },
  share_rate: {
    title: "Share rate",
    description: "Share of Historias listens that resulted in a share action.",
    source: "kpi_summary.csv → share_rate",
  },
  campaigns_live: {
    title: "Live campaigns",
    description: "Partner or campaign exclusives currently running.",
    source: "kpi_summary.csv → campaigns_live",
  },
  ctr: {
    title: "Feed CTR",
    description: "Click-through rate from feed surfaces to exclusive partner content.",
    source: "kpi_summary.csv → ctr",
  },
  conversion_rate: {
    title: "Follow conversion",
    description: "Share of exposed users who followed from partner exclusive placements.",
    source: "kpi_summary.csv → conversion_rate",
  },
  daily_plays_reach: {
    title: "Daily plays & reach",
    description:
      "Daily play volume and active users (reach) for this product, from the KPI timeseries export.",
    source: "kpi_timeseries.csv → plays, reach",
  },
  portfolio_growth: {
    title: "Portfolio growth",
    description:
      "Combined daily plays and reach summed across all product lines in kpi_timeseries.csv.",
    source: "kpi_timeseries.csv (aggregated in UI)",
  },
  top_content_plays: {
    title: "Plays (28d)",
    description: "28-day plays for this piece of content, used to rank the top-content table.",
    source: "content_top.csv → plays_28d",
  },
  top_content_active_users: {
    title: "Active users (28d)",
    description:
      "Distinct listeners for this content when supplied; otherwise estimated from plays × engagement rate.",
    source: "content_top.csv → active_users_28d (optional)",
  },
  voice_notes_total_tracks: {
    title: "Total tracks",
    description: "Voice Notes tracks in the masterlist snapshot (all statuses).",
    source: "voice_notes_masterlist.csv",
  },
  voice_notes_plays_28d: {
    title: "Plays (28d)",
    description:
      "Sum of 28-day plays across Voice Notes tracks from BigQuery export, or portfolio-based estimates when per-track metrics are missing.",
    source: "voice_notes_metrics.csv or portfolio estimate in build_dashboard.py",
  },
  voice_notes_active_users_28d: {
    title: "Active users (28d)",
    description: "Distinct listeners on Voice Notes tracks in the last 28 days when metrics are available.",
    source: "voice_notes_metrics.csv",
  },
  voice_notes_artist_playlists: {
    title: "Artist playlists",
    description:
      "Number of artist groupings in the Voice Notes library—each artist’s episodes are one playlist (series).",
    source: "voicenotes.py grouping → playlistCount",
  },
  plays_change_28d: {
    title: "Change vs prior 28d",
    description: "Percent change versus the prior 28-day period (from prior_value in KPI summary or plays_prior on content).",
    source: "kpi_summary.csv → prior_value; content_top.csv → plays_prior_28d",
  },
  hub_plays_28d: {
    title: "Plays (28d)",
    description: "30-second plays summed across all tracks in this hub for the last 28 days.",
    formula: "SUM(n_plays_30s) per track",
    source: "sc-corpus.views_daily.track_metrics via curated_hubs_metrics.csv / voice_notes_metrics.csv",
  },
  hub_plays_total: {
    title: "Total plays",
    description:
      "Lifetime play count summed across hub tracks. For The Booth interim data this comes from SoundCloud public playback counters (not a 28-day window).",
    source: "curated_hubs_metrics.csv → plays_lifetime / fetch_booth_public_metrics.py",
  },
  hub_likes_total: {
    title: "Likes (lifetime)",
    description: "Lifetime like counts from SoundCloud public counters when BigQuery 28d likes are unavailable.",
    source: "curated_hubs_metrics.csv → likes_lifetime",
  },
  hub_reach_28d: {
    title: "Reach (28d)",
    description: "Distinct active listeners across hub tracks in the last 28 days (summed per track; may overlap listeners).",
    source: "sc-plays.views_daily.plays_audited",
  },
  hub_likes_28d: {
    title: "Likes (28d)",
    description: "Track likes attributed in the last 28 days for episodes in this hub.",
    source: "sc-attribution.views_daily.engagement_attribution_mdi_lite → Track Liked",
  },
  hub_shares_28d: {
    title: "Shares (28d)",
    description: "Track shares in the last 28 days for hub episodes.",
    source: "engagement_attribution_mdi_lite → Track Shared",
  },
  hub_reposts_28d: {
    title: "Reposts (28d)",
    description: "Track reposts in the last 28 days for hub episodes.",
    source: "engagement_attribution_mdi_lite → Track Reposted",
  },
};

export function getMetricDefinition(key: string): MetricDefinition | undefined {
  return METRIC_DEFINITIONS[key];
}

/** Map overview card labels to definition keys. */
export const OVERVIEW_METRIC_KEYS: Record<string, string> = {
  "Total plays": "total_plays",
  "Total plays (28d)": "total_plays_28d",
  "Total likes": "total_likes",
  "Total reach": "total_reach",
  "Reach (28d)": "reach_28d",
  "Active series": "active_series_overview",
  "Avg completion": "avg_completion",
};
