"use client";

import { LayoutGrid, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { CollapsibleDashboardModule } from "@/components/dashboard/collapsible-dashboard-module";
import { SortableSection } from "@/components/dashboard/sortable-section";
import {
  DEFAULT_SECTION_EXPANDED,
  DEFAULT_SECTION_ORDER,
  EXPAND_STORAGE_KEY,
  LAYOUT_STORAGE_KEY,
  type DashboardSectionId,
  parseStoredExpanded,
  parseStoredOrder,
  SECTION_DISPLAY_TITLES,
  SECTION_LABELS,
} from "@/lib/dashboard-layout";

export type DashboardSections = Partial<Record<DashboardSectionId, ReactNode>>;

type ShellProps = {
  source: string;
  updatedLabel: string;
  sections: DashboardSections;
};

function moveSection(order: DashboardSectionId[], id: DashboardSectionId, dir: -1 | 1) {
  const idx = order.indexOf(id);
  if (idx < 0) return order;
  const next = idx + dir;
  if (next < 0 || next >= order.length) return order;
  const copy = [...order];
  [copy[idx], copy[next]] = [copy[next], copy[idx]];
  return copy;
}

export function DashboardLayoutShell({ source, updatedLabel, sections }: ShellProps) {
  const [editMode, setEditMode] = useState(false);
  const [order, setOrder] = useState<DashboardSectionId[]>(DEFAULT_SECTION_ORDER);
  const [dragId, setDragId] = useState<DashboardSectionId | null>(null);
  const [dropTarget, setDropTarget] = useState<DashboardSectionId | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [expanded, setExpanded] = useState<Record<DashboardSectionId, boolean>>(
    DEFAULT_SECTION_EXPANDED,
  );

  const availableIds = useMemo(
    () => DEFAULT_SECTION_ORDER.filter((id) => sections[id] != null),
    [sections],
  );

  useEffect(() => {
    setOrder(parseStoredOrder(localStorage.getItem(LAYOUT_STORAGE_KEY)));
    setExpanded(parseStoredExpanded(localStorage.getItem(EXPAND_STORAGE_KEY)));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(order));
    localStorage.setItem(EXPAND_STORAGE_KEY, JSON.stringify(expanded));
  }, [order, expanded, hydrated]);

  const toggleExpanded = useCallback((id: DashboardSectionId) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const visibleOrder = useMemo(
    () => order.filter((id) => availableIds.includes(id)),
    [order, availableIds],
  );

  const handleDrop = useCallback(
    (targetId: DashboardSectionId) => {
      if (!dragId || dragId === targetId) return;
      const from = order.indexOf(dragId);
      const to = order.indexOf(targetId);
      if (from < 0 || to < 0) return;
      const copy = [...order];
      copy.splice(from, 1);
      copy.splice(to, 0, dragId);
      setOrder(copy);
      setDragId(null);
      setDropTarget(null);
    },
    [dragId, order],
  );

  return (
    <div className="mx-auto min-w-0 max-w-7xl overflow-x-hidden px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">SoundCloud</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Original Content Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Account, Series and partner exclusives — one view of the KPIs that matter.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Source: {source}</Badge>
            <Badge variant="outline">Updated {updatedLabel}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setEditMode((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                editMode
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              {editMode ? "Done reordering" : "Reorder sections"}
            </button>
            {editMode ? (
              <button
                type="button"
                onClick={() => {
                  setOrder([...DEFAULT_SECTION_ORDER]);
                  setExpanded({ ...DEFAULT_SECTION_EXPANDED });
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted/50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset layout
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {editMode ? (
        <p className="mb-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
          Drag sections or use arrows to reorder. Your layout is saved in this browser automatically.
        </p>
      ) : null}

      <section className="flex flex-col gap-4">
        {(visibleOrder.length ? visibleOrder : availableIds).map((sectionId, index) => {
          const orderList = visibleOrder.length ? visibleOrder : availableIds;
          const block = sections[sectionId];
          if (block == null) return null;
          const moduleBody = (
            <CollapsibleDashboardModule
              title={SECTION_DISPLAY_TITLES[sectionId]}
              expanded={expanded[sectionId] ?? DEFAULT_SECTION_EXPANDED[sectionId]}
              onToggle={() => toggleExpanded(sectionId)}
            >
              {block}
            </CollapsibleDashboardModule>
          );

          if (!editMode) {
            return (
              <div key={sectionId} className="min-w-0">
                {moduleBody}
              </div>
            );
          }

          return (
            <SortableSection
              key={sectionId}
              id={sectionId}
              label={SECTION_LABELS[sectionId]}
              editMode={editMode}
              isDragging={dragId === sectionId}
              isDropTarget={dropTarget === sectionId}
              canMoveUp={index > 0}
              canMoveDown={index < orderList.length - 1}
              onMoveUp={() => setOrder(moveSection(order, sectionId, -1))}
              onMoveDown={() => setOrder(moveSection(order, sectionId, 1))}
              onDragStart={(id) => setDragId(id as DashboardSectionId)}
              onDragOver={(_, id) => setDropTarget(id as DashboardSectionId)}
              onDrop={(id) => handleDrop(id as DashboardSectionId)}
              onDragEnd={() => {
                setDragId(null);
                setDropTarget(null);
              }}
            >
              {moduleBody}
            </SortableSection>
          );
        })}
      </section>
    </div>
  );
}
