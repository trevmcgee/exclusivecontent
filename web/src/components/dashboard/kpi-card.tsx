import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Kpi } from "@/lib/dashboard";
import { cn, formatCompact, formatDelta, formatPercent } from "@/lib/utils";

function trendIcon(trend: Kpi["trend"]) {
  if (trend === "up") return ArrowUpRight;
  if (trend === "down") return ArrowDownRight;
  return ArrowRight;
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const Icon = trendIcon(kpi.trend);
  const displayValue =
    kpi.unit === "ratio" ? formatPercent(kpi.value) : formatCompact(kpi.value);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          <MetricLabel metricKey={kpi.id}>{kpi.label}</MetricLabel>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight">{displayValue}</p>
          <Badge
            variant={kpi.trend === "down" ? "muted" : kpi.trend === "up" ? "success" : "secondary"}
            className="gap-1"
          >
            <Icon className={cn("h-3 w-3", kpi.trend === "down" && "text-amber-400")} />
            {formatDelta(kpi.deltaPct)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
