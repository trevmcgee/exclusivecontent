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
            Exclusive content dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Account, Stories, Historias, and partner exclusives — one view of the KPIs that matter.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Source: {data.source}</Badge>
          <Badge variant="outline">Updated {updated}</Badge>
        </div>
      </header>

      <section className="space-y-8">
        <OverviewCards overview={data.overview} />

        <PortfolioGrowthCharts products={data.products} />

        <Tabs
          defaultValue={data.voiceNotes ? "voice_notes" : data.products[0]?.id ?? "overview"}
          className="w-full"
        >
          <TabsList className="flex h-auto flex-wrap justify-start gap-1">
            {data.voiceNotes ? (
              <TabsTrigger value="voice_notes" className="text-xs sm:text-sm">
                Voice Notes
              </TabsTrigger>
            ) : null}
            {data.products.map((p) => (
              <TabsTrigger key={p.id} value={p.id} className="text-xs sm:text-sm">
                {p.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {data.voiceNotes ? (
            <TabsContent value="voice_notes">
              <VoiceNotesPanel data={data.voiceNotes} />
            </TabsContent>
          ) : null}
          {data.products.map((p) => (
            <TabsContent key={p.id} value={p.id}>
              <ProductPanel product={p} />
            </TabsContent>
          ))}
        </Tabs>

        <TopContentTable rows={data.topContent} />
      </section>
    </div>
  );
}
