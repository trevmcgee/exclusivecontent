import { CuratedHubsPanel } from "@/components/dashboard/curated-hubs-panel";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { PortfolioGrowthCharts } from "@/components/dashboard/portfolio-growth-charts";
import { ProductPanel } from "@/components/dashboard/product-panel";
import { SeriesPlayCountsTable } from "@/components/dashboard/series-play-counts-table";
import { TopContentTable } from "@/components/dashboard/top-content-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = loadDashboard();
  const updatedLabel = new Date(data.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const defaultTab =
    data.products.find((p) => p.id === "soundcloud_stories")?.id ?? data.products[0]?.id ?? "";

  return (
    <DashboardLayoutShell
      source={data.source}
      updatedLabel={updatedLabel}
      sections={{
        "overview-cards": (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Totals summed from Play counts by series: lifetime plays/likes (public counters),
              28-day plays and reach (BigQuery). Run pipeline REFRESH to update.
            </p>
            <OverviewCards overview={data.overview} seriesPlayCounts={data.seriesPlayCounts} />
          </div>
        ),
        "series-plays": data.seriesPlayCounts?.length ? (
          <SeriesPlayCountsTable rows={data.seriesPlayCounts} embeddedInModule />
        ) : undefined,
        "growth-charts": <PortfolioGrowthCharts products={data.products} />,
        "curated-hubs": data.curatedHubs?.length ? (
          <CuratedHubsPanel
            hubs={data.curatedHubs}
            voiceNotes={data.voiceNotes}
            embeddedInModule
          />
        ) : undefined,
        "top-content": <TopContentTable rows={data.topContent} />,
        "programming-detail": defaultTab ? (
          <Tabs defaultValue={defaultTab} className="w-full space-y-4">
            <p className="text-sm text-muted-foreground">
              Product KPIs by line. Voice Notes lives under Curated hubs.
            </p>
            <TabsList className="flex h-auto flex-wrap justify-start gap-1">
              {data.products.map((p) => (
                <TabsTrigger key={p.id} value={p.id} className="text-xs sm:text-sm">
                  {p.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {data.products.map((p) => (
              <TabsContent key={p.id} value={p.id} className="mt-4">
                <ProductPanel product={p} />
              </TabsContent>
            ))}
          </Tabs>
        ) : undefined,
      }}
    />
  );
}
