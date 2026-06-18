"use client";

import type { ReactNode } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

interface DraggableListProps<T> {
  items: T[];
  /** Stable unique id for each item (used as the dnd-kit sortable id). */
  getId: (item: T, index: number) => string;
  /** Called with the new id order after a drag settles (use for id-based APIs). */
  onReorder?: (orderedIds: string[]) => void;
  /** Called with from/to indices (use with react-hook-form's `move`). */
  onMove?: (from: number, to: number) => void;
  /** Render the body of a row; the drag handle is rendered for you. */
  renderItem: (item: T, index: number) => ReactNode;
  disabled?: boolean;
  className?: string;
}

/**
 * Generic vertical sortable list (drag + keyboard) built on @dnd-kit.
 * The grip handle is supplied automatically on the left of each row.
 */
export function DraggableList<T>({
  items,
  getId,
  onReorder,
  onMove,
  renderItem,
  disabled,
  className,
}: DraggableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const ids = items.map(getId);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onMove?.(oldIndex, newIndex);
    onReorder?.(arrayMove(ids, oldIndex, newIndex));
  }

  if (disabled) {
    return (
      <ul className={cn("space-y-3", className)}>
        {items.map((item, index) => (
          <li key={getId(item, index)} className="flex gap-3">
            <span className="mt-3 flex h-8 w-5 items-center justify-center text-muted-foreground/30">
              <GripVertical className="h-4 w-4" />
            </span>
            <div className="flex-1">{renderItem(item, index)}</div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className={cn("space-y-3", className)}>
          {items.map((item, index) => (
            <SortableRow key={getId(item, index)} id={getId(item, index)}>
              {renderItem(item, index)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex gap-3", isDragging && "relative z-10 opacity-80")}
    >
      <button
        type="button"
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="mt-3 flex h-8 w-5 cursor-grab touch-none items-center justify-center text-muted-foreground transition hover:text-foreground active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1">{children}</div>
    </li>
  );
}
