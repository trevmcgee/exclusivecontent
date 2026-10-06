"use client";

import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CollapsibleDashboardModuleProps = {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CollapsibleDashboardModule({
  title,
  expanded,
  onToggle,
  children,
}: CollapsibleDashboardModuleProps) {
  return (
    <div className="w-full min-w-0 rounded-xl border border-border/80 bg-card/40 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 rounded-t-xl px-4 py-3.5 text-left transition hover:bg-muted/40"
        onClick={onToggle}
        aria-expanded={expanded}
      >
        <span className="text-base font-semibold tracking-tight">{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
            expanded && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "min-w-0 border-t border-border/60",
          expanded ? "block p-4 sm:p-5" : "hidden",
        )}
        aria-hidden={!expanded}
      >
        {expanded ? children : null}
      </div>
    </div>
  );
}
