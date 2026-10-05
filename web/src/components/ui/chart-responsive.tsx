"use client";

import { ResponsiveContainer } from "recharts";
import { useEffect, useState, type ReactElement } from "react";

type Props = {
  height: number;
  children: ReactElement;
  className?: string;
};

/**
 * Recharts ResponsiveContainer often renders 0×0 with height="100%" after SSR/hydration
 * (React 19 + grid layouts). Mount charts client-side with an explicit pixel height.
 */
export function ChartResponsive({ height, children, className }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={className ?? "w-full rounded-md bg-muted/25 animate-pulse"}
        style={{ height, minHeight: height }}
        aria-hidden
      />
    );
  }

  return (
    <div className={className ?? "w-full"} style={{ height, minHeight: height }}>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}
