import { CuratedHubsPanel } from "@/components/dashboard/curated-hubs-panel";
import { PortfolioGrowthCharts } from "@/components/dashboard/portfolio-growth-charts";
import { ProductPanel } from "@/components/dashboard/product-panel";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { TopContentTable } from "@/components/dashboard/top-content-table";
import { VoiceNotesPanel } from "@/components/dashboard/voice-notes-panel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = loadDashboard();
  const updated = new Date(data.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">SoundCloud</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Exclusive Content Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Account, Series and partner exclusives — one view of the KPIs that matter.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Source: {data.source}</Badge>
          <Badge variant="outline">Updated {updated}</Badge>
        </div>
      </header>

      <section className="space-y-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Portfolio overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              28-day rollup and daily trends from your KPI CSV exports.
            </p>
          </div>
          <OverviewCards overview={data.overview} />
          <PortfolioGrowthCharts products={data.products} />
          {data.curatedHubs?.length ? <CuratedHubsPanel hubs={data.curatedHubs} /> : null}
          <TopContentTable rows={data.topContent} />
        </div>

        <Tabs
          defaultValue={
            data.products.find((p) => p.id === "soundcloud_stories")?.id ??
            data.products[0]?.id ??
            "voice_notes"
          }
          className="w-full space-y-4"
        >
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Programming detail</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Product KPIs and the Voice Notes library.
            </p>
          </div>
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {data.products.map((p) => (
              <TabsTrigger key={p.id} value={p.id} className="text-xs sm:text-sm">
                {p.name}
              </TabsTrigger>
            ))}
            {data.voiceNotes ? (
              <TabsTrigger value="voice_notes" className="text-xs sm:text-sm">
                Voice Notes
              </TabsTrigger>
            ) : null}
          </TabsList>
          {data.products.map((p) => (
            <TabsContent key={p.id} value={p.id} className="mt-4">
              <ProductPanel product={p} />
            </TabsContent>
          ))}
          {data.voiceNotes ? (
            <TabsContent value="voice_notes" className="mt-4">
              <VoiceNotesPanel data={data.voiceNotes} />
            </TabsContent>
          ) : null}
        </Tabs>
      </section>
    </div>
  );
}
