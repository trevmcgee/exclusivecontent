"use client";

import { ResponsiveContainer } from "recharts";
import { useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type Props = {
  height: number;
  children: ReactElement;
  className?: string;
};

/**
 * Recharts needs a concrete pixel width inside CSS grid/flex (React 19 + Next 15).
 * Measure the host element instead of relying on width="100%" alone.
 */
export function ChartResponsive({ height, children, className }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const measure = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 0) setWidth(next);
    };

    measure();
    const raf = requestAnimationFrame(() => {
      measure();
      requestAnimationFrame(measure);
    });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className={cn("w-full min-w-0", className)}
      style={{ height, minHeight: height }}
    >
      {width > 0 ? (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div
          className="h-full w-full rounded-md bg-muted/20"
          aria-hidden
          data-chart-measuring
        />
      )}
    </div>
  );
}
