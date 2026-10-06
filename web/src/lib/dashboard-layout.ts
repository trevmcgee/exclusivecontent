export const LAYOUT_STORAGE_KEY = "exclusive-dashboard-section-order-v1";
export const EXPAND_STORAGE_KEY = "exclusive-dashboard-section-expand-v2";

export type DashboardSectionId =
  | "overview-cards"
  | "series-plays"
  | "growth-charts"
  | "curated-hubs"
  | "signups-resurrections"
  | "top-content";

export const DEFAULT_SECTION_ORDER: DashboardSectionId[] = [
  "overview-cards",
  "series-plays",
  "growth-charts",
  "curated-hubs",
  "signups-resurrections",
  "top-content",
];

export const SECTION_LABELS: Record<DashboardSectionId, string> = {
  "overview-cards": "Portfolio KPI cards",
  "series-plays": "Play counts by series",
  "growth-charts": "Curated series growth",
  "curated-hubs": "Curated hubs",
  "signups-resurrections": "Signups, resurrections, and subscriptions",
  "top-content": "Top exclusive content",
};

/** Titles shown on collapsible module headers. */
export const SECTION_DISPLAY_TITLES: Record<DashboardSectionId, string> = {
  "overview-cards": "Portfolio overview",
  "series-plays": "Play counts by series",
  "growth-charts": "Curated series growth",
  "curated-hubs": "Curated hubs",
  "signups-resurrections": "Signups, resurrections, and subscriptions",
  "top-content": "Top exclusive content",
};

/** Default collapse state for every visitor (v2 storage key resets prior browser saves). */
export const DEFAULT_SECTION_EXPANDED: Record<DashboardSectionId, boolean> = {
  "overview-cards": true,
  "series-plays": false,
  "growth-charts": false,
  "curated-hubs": false,
  "signups-resurrections": false,
  "top-content": false,
};

export function parseStoredExpanded(raw: string | null): Record<DashboardSectionId, boolean> {
  const base = { ...DEFAULT_SECTION_EXPANDED };
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null) return base;
    const legacy = (parsed as Record<string, unknown>)["subscription-growth"];
    if (typeof legacy === "boolean" && base["signups-resurrections"] === DEFAULT_SECTION_EXPANDED["signups-resurrections"]) {
      base["signups-resurrections"] = legacy;
    }
    for (const id of DEFAULT_SECTION_ORDER) {
      const val = (parsed as Record<string, unknown>)[id];
      if (typeof val === "boolean") base[id] = val;
    }
  } catch {
    /* use defaults */
  }
  return base;
}

export function parseStoredOrder(raw: string | null): DashboardSectionId[] {
  if (!raw) return [...DEFAULT_SECTION_ORDER];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...DEFAULT_SECTION_ORDER];
    const allowed = new Set(DEFAULT_SECTION_ORDER);
    const normalized = parsed.map((id) =>
      id === "subscription-growth" ? "signups-resurrections" : id,
    );
    const filtered = normalized.filter(
      (id): id is DashboardSectionId =>
        typeof id === "string" && allowed.has(id as DashboardSectionId),
    );
    const missing = DEFAULT_SECTION_ORDER.filter((id) => !filtered.includes(id));
    return [...filtered, ...missing];
  } catch {
    return [...DEFAULT_SECTION_ORDER];
  }
}
