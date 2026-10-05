import { Activity, Headphones, Layers, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardData } from "@/lib/dashboard";
import { formatCompact, formatPercent } from "@/lib/utils";

const icons = [Headphones, Activity, Layers, Percent] as const;

export function OverviewCards({ overview }: { overview: DashboardData["overview"] }) {
  const items = [
    { label: "Total plays (28d)", value: formatCompact(overview.totalPlays28d) },
    { label: "Reach (28d)", value: formatCompact(overview.totalReach28d) },
    { label: "Active series", value: overview.activeSeries.toString() },
    { label: "Avg completion", value: formatPercent(overview.avgCompletionRate) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item, i) => {
        const Icon = icons[i];
        return (
          <Card key={item.label} className="border-primary/20 bg-gradient-to-br from-card to-card/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
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
