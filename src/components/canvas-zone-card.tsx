"use client";

import { CanvasFieldKey, WorkspaceNote } from "@/lib/canvas-types";
import { WorkspaceUserId } from "@/lib/gate-config";
import { ZoneNotesList } from "@/components/zone-notes-list";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CanvasZoneCardProps {
  labelTr: string;
  labelEn?: string;
  helperTr: string;
  notes: WorkspaceNote[];
  currentUserId: WorkspaceUserId | null;
  disabled?: boolean;
  className?: string;
  onAddNote: (text: string) => boolean;
  onRemoveNote: (noteId: string) => void;
}

export function CanvasZoneCard({
  labelTr,
  labelEn,
  helperTr,
  notes,
  currentUserId,
  disabled,
  className,
  onAddNote,
  onRemoveNote,
}: CanvasZoneCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-[240px] flex-col border-dashed bg-card/80 shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-base font-semibold">{labelTr}</CardTitle>
        {labelEn ? (
          <CardDescription className="text-xs uppercase tracking-wide">
            {labelEn}
          </CardDescription>
        ) : null}
        <CardDescription className="text-sm leading-relaxed">
          {helperTr}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <ZoneNotesList
          notes={notes}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={onAddNote}
          onRemoveNote={onRemoveNote}
        />
      </CardContent>
    </Card>
  );
}

interface RoadmapZoneCardProps {
  columns: Array<{
    key: CanvasFieldKey;
    labelTr: string;
    labelEn: string;
    helperTr: string;
    notes: WorkspaceNote[];
  }>;
  currentUserId: WorkspaceUserId | null;
  disabled?: boolean;
  className?: string;
  onAddNote: (key: CanvasFieldKey, text: string) => boolean;
  onRemoveNote: (key: CanvasFieldKey, noteId: string) => void;
}

export function RoadmapZoneCard({
  columns,
  currentUserId,
  disabled,
  className,
  onAddNote,
  onRemoveNote,
}: RoadmapZoneCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-[280px] flex-col border-dashed bg-card/80 shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-base font-semibold">Yol Haritası</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wide">
          Now / Next / Later roadmap
        </CardDescription>
        <CardDescription className="text-sm leading-relaxed">
          Şimdi, sonra ve ileride odaklanılacak adımlar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 gap-4 pt-0 md:grid-cols-3">
        {columns.map((column) => (
          <div key={column.key} className="flex min-h-[180px] flex-col gap-2">
            <div>
              <p className="text-sm font-semibold">{column.labelTr}</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {column.labelEn}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {column.helperTr}
              </p>
            </div>
            <ZoneNotesList
              notes={column.notes}
              currentUserId={currentUserId}
              disabled={disabled}
              compact
              onAddNote={(text) => onAddNote(column.key, text)}
              onRemoveNote={(noteId) => onRemoveNote(column.key, noteId)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
