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
import { formatCompact, formatPercent } from "@/lib/utils";

export function TopContentTable({ rows }: { rows: TopContentRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top exclusive content</CardTitle>
        <CardDescription>Ranked by 28-day plays across all product lines</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Plays (28d)</TableHead>
              <TableHead className="text-right">Engagement</TableHead>
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
                  {formatPercent(row.engagementRate)}
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
