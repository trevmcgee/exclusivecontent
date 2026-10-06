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
      "Lifetime play count summed across flagship curated hub series only (Booth, Sound Advice, The Upload, Voice Notes albums). Editorial Stories sets in Curated hubs are excluded. For The Upload, portfolio total uses SoundCloud Stories track plays only—not artist mirror tracks in the playlist.",
    source: "build_dashboard.py → overview_from_series_play_counts (excludes category editorial)",
  },
  total_plays_28d: {
    title: "Total plays (28d)",
    description:
      "Rolling 28-day plays summed across flagship curated hub series only (editorial sets excluded). For The Upload, portfolio total uses soundcloud-stories track plays only—not artist mirror tracks in the playlist.",
    source: "overview_from_series_play_counts; pipeline fetch_batched_hub_plays.py",
  },
  total_likes: {
    title: "Total likes",
    description:
      "Lifetime likes summed across Play counts by series (SoundCloud public counters on curated hub rollups).",
    source: "sum(seriesPlayCounts.likesTotal)",
  },
  portfolio_attributed_signups: {
    title: "Signups (attributed)",
    description:
      "Sum of first-touch attributed signups across flagship Stories series in the growth module (Sound Advice, The Booth, Voice Notes). Uses each series’ analysis window from its export or BigQuery run—not lifetime portfolio signups.",
    source: "signupsResurrections.series[].summary.totalSignups",
  },
  portfolio_subscription_starts: {
    title: "Subscription starts (attributed)",
    description:
      "Sum of first-touch attributed subscription chain starts (paid and trial) across flagship Stories series in the growth module. Uses each series’ analysis window when exports differ.",
    source: "signupsResurrections.series[].summary.totalSubscriptions",
  },
  total_reach: {
    title: "Total reach",
    description:
      "28-day reach summed across Play counts by series (hub rollups of per-track distinct listeners from BigQuery). Shows — until reach export runs in refresh.py.",
    formula: "SUM(hub activeUsers28d); tracks use COUNT(DISTINCT listener) on trusted 30s+ plays",
    source: "sum(seriesPlayCounts.activeUsers28d); pipeline fetch_track_reach_28d.py",
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
      "Legacy combined daily plays and reach from kpi_timeseries.csv (superseded by curated series growth in the growth charts module).",
    source: "kpi_timeseries.csv (aggregated in UI)",
  },
  curated_series_growth: {
    title: "Cumulative plays since series start",
    description:
      "Modeled cumulative 30s+ plays for each curated hub from its launch date through the dashboard snapshot. The Upload counts soundcloud-stories tracks only.",
    source: "build_dashboard.py → curatedSeriesGrowth (series_growth.py)",
  },
  attributed_signups: {
    title: "Signups",
    description:
      "Distinct new accounts with a first-touch target-track play within ±1 day of Account Creation Succeeded.",
    source: "fetch_signups_resurrections.py → segment_events + plays_audited",
  },
  attributed_resurrections: {
    title: "Resurrections",
    description:
      "Distinct resurrected/reactivated users with first-touch target-track play within ±1 day of fan_growth_model status change.",
    source: "fetch_signups_resurrections.py → fan_growth_model + plays_audited",
  },
  attributed_growth_events: {
    title: "Signups + resurrections",
    description: "New account signups plus resurrected/reactivated users attributed to the track in the window.",
    source: "signups_resurrections_by_track.csv",
  },
  attributed_subscriptions: {
    title: "Subscription starts",
    description:
      "Attributed subscription chain starts (paid and trial; listener or creator) with first-touch target-track play ±1 day.",
    source: "Sound Advice Q2 export → signups_resurrections_by_track.csv",
  },
  attributed_trials: {
    title: "Trials",
    description:
      "Attributed trial subscription starts (payment_type = trial) with first-touch target-track play ±1 day.",
    source: "Sound Advice Q2 Subscriptions export (trial rows) → total_trials",
  },
  curated_series_lifetime_total: {
    title: "Lifetime plays (curated series)",
    description:
      "Terminal cumulative plays on each growth curve, aligned with Play counts by series rollups.",
    source: "curatedSeriesGrowth + seriesPlayCounts",
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
    title: "Total playlist plays",
    description:
      "Lifetime play count summed across every track listed on the playlist (SoundCloud public playback counters). For The Upload this includes Stories episodes and linked artist tracks.",
    source: "curated_hubs_metrics.csv → plays_lifetime / fetch_booth_public_metrics.py",
  },
  upload_stories_track_plays_total: {
    title: "Stories track plays (lifetime)",
    description:
      "Lifetime plays on soundcloud-stories permalinks in The Upload playlist only—excludes artist-hosted mirror tracks.",
    source: "curated_hubs_metrics.csv filtered to soundcloud-stories track URLs",
  },
  series_playlist_plays_lifetime: {
    title: "Playlist plays (lifetime)",
    description:
      "Sum of public lifetime plays for all tracks on the playlist. The Upload lists both Stories and artist tracks.",
    source: "seriesPlayCounts.playsTotal",
  },
  series_stories_track_plays_lifetime: {
    title: "Stories track plays (lifetime)",
    description:
      "Sum of public lifetime plays for soundcloud-stories tracks on The Upload playlist only.",
    source: "seriesPlayCounts.playsTotalStoriesTracks",
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
  "Signups (attributed)": "portfolio_attributed_signups",
  "Subscription starts (attributed)": "portfolio_subscription_starts",
  "Reach (28d)": "reach_28d",
  "Active series": "active_series_overview",
  "Avg completion": "avg_completion",
};
