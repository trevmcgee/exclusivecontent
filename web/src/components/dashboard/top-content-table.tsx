import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { MetricLabel } from "@/components/dashboard/metric-help";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopContentRow } from "@/lib/dashboard";
import { cn, formatCompact, formatDelta } from "@/lib/utils";

function ChangeCell({ pct, trend }: { pct: number; trend: TopContentRow["playsTrend"] }) {
  const Icon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : ArrowRight;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-end gap-0.5 tabular-nums",
        trend === "up" && "text-emerald-400",
        trend === "down" && "text-amber-400",
      )}
    >
      <Icon className="h-3 w-3" />
      {formatDelta(pct)}
    </span>
  );
}

export function TopContentTable({ rows }: { rows: TopContentRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top exclusive content</CardTitle>
        <CardDescription>
          Ranked by 28-day plays — active users from CSV or plays × engagement when not supplied
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">
                <MetricLabel metricKey="top_content_plays" />
              </TableHead>
              <TableHead className="text-right">
                <MetricLabel metricKey="top_content_active_users">Active users</MetricLabel>
              </TableHead>
              <TableHead className="text-right">
                <MetricLabel metricKey="plays_change_28d">Change</MetricLabel>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="max-w-[240px] font-medium">{row.title}</TableCell>
                <TableCell className="text-muted-foreground">{row.product}</TableCell>
                <TableCell>{row.publishedAt}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCompact(row.plays28d)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCompact(row.activeUsers28d)}
                </TableCell>
                <TableCell className="text-right">
                  <ChangeCell pct={row.playsChangePct} trend={row.playsTrend} />
                </TableCell>
                <TableCell>
                  <Badge variant={row.status === "live" ? "success" : "muted"}>{row.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
