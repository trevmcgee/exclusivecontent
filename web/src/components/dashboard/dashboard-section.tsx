"use client";

import type { ReactNode } from "react";
import type { DashboardSectionId } from "@/lib/dashboard-layout";

/**
 * Slot marker for DashboardLayoutShell (client). The shell reads `id` + `children` from
 * its React children and renders collapsible modules. This component does not paint to the DOM.
 */
export function DashboardSection({
  id: _id,
  children: _children,
}: {
  id: DashboardSectionId;
  children: ReactNode;
}) {
  return null;
}
