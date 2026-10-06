import type { DashboardData, SeriesPlayCount, SignupsResurrectionsData } from "@/lib/dashboard";

export type PortfolioOverviewTotals = {
  totalPlays: number | null;
  totalPlays28d: number | null;
  totalLikes: number | null;
  totalReach28d: number | null;
};

export type PortfolioGrowthTotals = {
  totalSignups: number | null;
  totalSubscriptionStarts: number | null;
};

function sumOptional(values: (number | null | undefined)[]): number | null {
  const present = values.filter((v): v is number => v != null);
  if (!present.length) return null;
  return present.reduce((a, b) => a + b, 0);
}

/** Rows that roll into portfolio KPI cards (flagship curated hubs — not Stories editorial sets). */
export function portfolioSeriesRows(rows: SeriesPlayCount[] | undefined): SeriesPlayCount[] {
  return (rows ?? []).filter((r) => r.category !== "editorial");
}

/** Sum Play counts by series so Portfolio overview matches flagship hub rollups on every load. */
export function portfolioOverviewFromSeries(
  rows: SeriesPlayCount[] | undefined,
  fallback: DashboardData["overview"],
): PortfolioOverviewTotals {
  const portfolioRows = portfolioSeriesRows(rows);
  if (!portfolioRows.length) {
    return {
      totalPlays: fallback.totalPlays ?? null,
      totalPlays28d: fallback.totalPlays28d ?? null,
      totalLikes: fallback.totalLikes ?? null,
      totalReach28d: fallback.totalReach28d ?? null,
    };
  }

  const totalReach28d = sumOptional(portfolioRows.map((r) => r.activeUsers28d));

  const playsForPortfolio = (row: SeriesPlayCount) =>
    row.playsTotalStoriesTracks ?? row.playsTotal;
  const plays28dForPortfolio = (row: SeriesPlayCount) =>
    row.plays28dStoriesTracks ?? row.plays28d;

  return {
    totalPlays: sumOptional(portfolioRows.map(playsForPortfolio)),
    totalPlays28d: sumOptional(portfolioRows.map(plays28dForPortfolio)),
    totalLikes: sumOptional(portfolioRows.map((r) => r.likesTotal)),
    totalReach28d: totalReach28d,
  };
}

/** Sum attributed signups and subscription starts across flagship growth series (Booth, Sound Advice, Voice Notes). */
export function portfolioGrowthTotals(
  data: SignupsResurrectionsData | undefined,
): PortfolioGrowthTotals {
  const withData = (data?.series ?? []).filter((s) => s.hasData);
  if (!withData.length) {
    return { totalSignups: null, totalSubscriptionStarts: null };
  }
  return {
    totalSignups: withData.reduce((n, s) => n + (s.summary?.totalSignups ?? 0), 0),
    totalSubscriptionStarts: withData.reduce(
      (n, s) => n + (s.summary?.totalSubscriptions ?? 0),
      0,
    ),
  };
}
