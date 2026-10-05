import { KpiCard } from "@/components/dashboard/kpi-card";
import { PlaysChart } from "@/components/dashboard/plays-chart";
import type { ProductBlock } from "@/lib/dashboard";

export function ProductPanel({ product }: { product: ProductBlock }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{product.name}</h2>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {product.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
      <PlaysChart
        title="Daily plays"
        description="Last 7 days from uploaded CSV / BigQuery export"
        data={product.timeseries}
      />
    </div>
  );
}
