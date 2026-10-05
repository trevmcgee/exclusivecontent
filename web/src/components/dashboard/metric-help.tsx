"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getMetricDefinition } from "@/lib/metric-definitions";
import { cn } from "@/lib/utils";

type Props = {
  metricKey: string;
  children?: React.ReactNode;
  className?: string;
  as?: "inline" | "block";
};

export function MetricLabel({ metricKey, children, className, as = "inline" }: Props) {
  const def = getMetricDefinition(metricKey);
  const label = children ?? def?.title ?? metricKey;

  if (!def) {
    return <span className={className}>{label}</span>;
  }

  const Wrapper = as === "block" ? "div" : "span";

  return (
    <Tooltip delayDuration={200}>
      <TooltipTrigger asChild>
        <Wrapper
          className={cn(
            "inline-flex max-w-full cursor-help items-center gap-1 text-left",
            as === "block" && "w-full",
            className,
          )}
        >
          <span className="truncate">{label}</span>
          <Info className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
          <span className="sr-only">Definition for {def.title}</span>
        </Wrapper>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm space-y-1.5 text-sm">
        <p className="font-medium leading-snug">{def.title}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{def.description}</p>
        {def.formula ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground/90">Formula: </span>
            {def.formula}
          </p>
        ) : null}
        {def.source ? (
          <p className="text-xs leading-relaxed text-muted-foreground/90">
            <span className="font-medium text-foreground/80">Source: </span>
            {def.source}
          </p>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
}
