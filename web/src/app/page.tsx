import { CuratedHubsPanel } from "@/components/dashboard/curated-hubs-panel";
import { DashboardLayoutShell } from "@/components/dashboard/dashboard-layout-shell";
import { DashboardSection } from "@/components/dashboard/dashboard-section";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { PortfolioGrowthCharts } from "@/components/dashboard/portfolio-growth-charts";
import { SeriesPlayCountsTable } from "@/components/dashboard/series-play-counts-table";
import { SignupsResurrectionsPanel } from "@/components/dashboard/signups-resurrections-panel";
import { TopContentTable } from "@/components/dashboard/top-content-table";
import { loadDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const data = loadDashboard();
  const updatedLabel = new Date(data.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <DashboardLayoutShell source={data.source} updatedLabel={updatedLabel}>
      <DashboardSection id="overview-cards">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Totals summed from flagship curated hub series (Booth, Sound Advice, The Upload, Voice
            Notes albums)—not editorial Stories sets. Lifetime plays/likes use public counters;
            28-day plays and reach use BigQuery. Signups and subscription starts are attributed
            totals from the growth module (per-series analysis windows). Run pipeline REFRESH to
            update.
          </p>
          <OverviewCards
            overview={data.overview}
            seriesPlayCounts={data.seriesPlayCounts}
            signupsResurrections={data.signupsResurrections}
          />
        </div>
      </DashboardSection>

      {data.seriesPlayCounts?.length ? (
        <DashboardSection id="series-plays">
          <SeriesPlayCountsTable rows={data.seriesPlayCounts} embeddedInModule />
        </DashboardSection>
      ) : null}

      <DashboardSection id="growth-charts">
        <PortfolioGrowthCharts
          series={data.curatedSeriesGrowth}
          seriesPlayCounts={data.seriesPlayCounts}
        />
      </DashboardSection>

      {data.curatedHubs?.length ? (
        <DashboardSection id="curated-hubs">
          <CuratedHubsPanel
            hubs={data.curatedHubs}
            voiceNotes={data.voiceNotes}
            embeddedInModule
          />
        </DashboardSection>
      ) : null}

      <DashboardSection id="signups-resurrections">
        <SignupsResurrectionsPanel data={data.signupsResurrections} embeddedInModule />
      </DashboardSection>

      <DashboardSection id="top-content">
        <TopContentTable rows={data.topContent} />
      </DashboardSection>
    </DashboardLayoutShell>
  );
}
