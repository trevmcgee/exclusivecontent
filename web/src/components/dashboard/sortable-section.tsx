"use client";

import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SortableSectionProps = {
  id: string;
  label: string;
  editMode: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragStart: (id: string) => void;
  onDragOver: (e: React.DragEvent, id: string) => void;
  onDrop: (id: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDropTarget: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  children: ReactNode;
};

export function SortableSection({
  id,
  label,
  editMode,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isDropTarget,
  canMoveUp,
  canMoveDown,
  children,
}: SortableSectionProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl transition",
        editMode && "ring-1 ring-border/80",
        isDragging && "opacity-50",
        isDropTarget && editMode && "ring-2 ring-primary",
      )}
      onDragOver={(e) => {
        if (!editMode) return;
        e.preventDefault();
        onDragOver(e, id);
      }}
      onDrop={(e) => {
        if (!editMode) return;
        e.preventDefault();
        onDrop(id);
      }}
    >
      {editMode ? (
        <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-border/80 bg-muted/30 px-3 py-2">
          <button
            type="button"
            draggable
            onDragStart={() => onDragStart(id)}
            onDragEnd={onDragEnd}
            className="cursor-grab touch-none rounded p-1 text-muted-foreground hover:bg-muted active:cursor-grabbing"
            aria-label={`Drag ${label}`}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <div className="ml-auto flex gap-1">
            <button
              type="button"
              disabled={!canMoveUp}
              onClick={onMoveUp}
              className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
              aria-label={`Move ${label} up`}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={!canMoveDown}
              onClick={onMoveDown}
              className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-30"
              aria-label={`Move ${label} down`}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}
      {children}
    </div>
  );
}
