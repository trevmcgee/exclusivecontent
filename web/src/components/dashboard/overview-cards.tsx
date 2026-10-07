import { Activity, CreditCard, Headphones, Heart, UserPlus, Users } from "lucide-react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData, SeriesPlayCount, SignupsResurrectionsData } from "@/lib/dashboard";
import { portfolioGrowthTotals, portfolioOverviewFromSeries } from "@/lib/portfolio-overview";
import { OVERVIEW_METRIC_KEYS } from "@/lib/metric-definitions";
import { formatCompact } from "@/lib/utils";

const icons = [Headphones, Activity, Heart, Users, UserPlus, CreditCard] as const;

function formatMetric(value: number | null): string {
  return value != null ? formatCompact(value) : "—";
}

export function OverviewCards({
  overview,
  seriesPlayCounts,
  signupsResurrections,
}: {
  overview: DashboardData["overview"];
  seriesPlayCounts?: SeriesPlayCount[];
  signupsResurrections?: SignupsResurrectionsData;
}) {
  const totals = portfolioOverviewFromSeries(seriesPlayCounts, overview);
  const growth = portfolioGrowthTotals(signupsResurrections);

  const items = [
    { label: "Total plays", value: formatMetric(totals.totalPlays) },
    { label: "Total plays (28d)", value: formatMetric(totals.totalPlays28d) },
    { label: "Total likes", value: formatMetric(totals.totalLikes) },
    { label: "Total reach", value: formatMetric(totals.totalReach28d) },
    { label: "Signups (attributed)", value: formatMetric(growth.totalSignups) },
    {
      label: "Subscription starts (attributed)",
      value: formatMetric(growth.totalSubscriptionStarts),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = icons[i];
        return (
          <Card key={item.label} className="border-primary/20 bg-gradient-to-br from-card to-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                <MetricLabel metricKey={OVERVIEW_METRIC_KEYS[item.label] ?? item.label} />
              </CardTitle>
              <Icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{item.value}</div>
              {(item.label === "Signups (attributed)" ||
                item.label === "Subscription starts (attributed)") && (
                <p className="mt-1 text-xs text-muted-foreground">Year to date</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
