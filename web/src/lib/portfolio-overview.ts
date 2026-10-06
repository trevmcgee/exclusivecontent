import type { DashboardData, SeriesPlayCount } from "@/lib/dashboard";

export type PortfolioOverviewTotals = {
  totalPlays: number | null;
  totalPlays28d: number | null;
  totalLikes: number | null;
  totalReach28d: number | null;
};

function sumOptional(values: (number | null | undefined)[]): number | null {
  const present = values.filter((v): v is number => v != null);
  if (!present.length) return null;
  return present.reduce((a, b) => a + b, 0);
}

/** Sum Play counts by series so Portfolio overview matches that table on every load. */
export function portfolioOverviewFromSeries(
  rows: SeriesPlayCount[] | undefined,
  fallback: DashboardData["overview"],
): PortfolioOverviewTotals {
  if (!rows?.length) {
    return {
      totalPlays: fallback.totalPlays ?? null,
      totalPlays28d: fallback.totalPlays28d ?? null,
      totalLikes: fallback.totalLikes ?? null,
      totalReach28d: fallback.totalReach28d ?? null,
    };
  }

  const totalPlays28d = sumOptional(rows.map((r) => r.plays28d));
  const totalReach28d = sumOptional(rows.map((r) => r.activeUsers28d));

  return {
    totalPlays: sumOptional(rows.map((r) => r.playsTotal)),
    totalPlays28d: totalPlays28d,
    totalLikes: sumOptional(rows.map((r) => r.likesTotal)),
    totalReach28d:
      totalReach28d ??
      (fallback.totalReach28d != null ? fallback.totalReach28d : null),
  };
}
