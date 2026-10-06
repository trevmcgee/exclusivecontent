import { Activity, Headphones, Heart, Users } from "lucide-react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData, SeriesPlayCount } from "@/lib/dashboard";
import { portfolioOverviewFromSeries } from "@/lib/portfolio-overview";
import { OVERVIEW_METRIC_KEYS } from "@/lib/metric-definitions";
import { formatCompact } from "@/lib/utils";

const icons = [Headphones, Activity, Heart, Users] as const;

function formatMetric(value: number | null): string {
  return value != null ? formatCompact(value) : "—";
}

export function OverviewCards({
  overview,
  seriesPlayCounts,
}: {
  overview: DashboardData["overview"];
  seriesPlayCounts?: SeriesPlayCount[];
}) {
  const totals = portfolioOverviewFromSeries(seriesPlayCounts, overview);

  const items = [
    { label: "Total plays", value: formatMetric(totals.totalPlays) },
    { label: "Total plays (28d)", value: formatMetric(totals.totalPlays28d) },
    { label: "Total likes", value: formatMetric(totals.totalLikes) },
    { label: "Total reach", value: formatMetric(totals.totalReach28d) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
