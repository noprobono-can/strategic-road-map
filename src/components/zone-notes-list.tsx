"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getUserLabel, WorkspaceUserId } from "@/lib/gate-config";
import { WorkspaceNote } from "@/lib/canvas-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AUTHOR_ORDER: WorkspaceUserId[] = ["okan", "emre", "bora"];

interface ZoneNotesListProps {
  notes: WorkspaceNote[];
  currentUserId: WorkspaceUserId | null;
  disabled?: boolean;
  compact?: boolean;
  onAddNote: (text: string) => boolean;
  onRemoveNote: (noteId: string) => void;
}

export function ZoneNotesList({
  notes,
  currentUserId,
  disabled,
  compact,
  onAddNote,
  onRemoveNote,
}: ZoneNotesListProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onAddNote(draft)) {
      setDraft("");
    }
  };

  const groupedNotes = useMemo(
    () =>
      AUTHOR_ORDER.map((authorId) => ({
        authorId,
        label: getUserLabel(authorId),
        notes: notes.filter((note) => note.authorId === authorId),
      })).filter((group) => group.notes.length > 0),
    [notes],
  );

  return (
    <div className="flex flex-1 flex-col gap-3">
      <form
        className={compact ? "flex flex-col gap-2" : "flex flex-col gap-2 sm:flex-row"}
        onSubmit={handleSubmit}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={disabled || !currentUserId}
          placeholder="Yeni not yazın…"
          className="flex h-9 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
        />
        <Button
          type="submit"
          size={compact ? "sm" : "default"}
          disabled={disabled || !currentUserId || draft.trim().length === 0}
        >
          <Plus className="size-4" />
          Not ekle
        </Button>
      </form>

      {groupedNotes.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-3 text-sm text-muted-foreground">
          Henüz not eklenmedi. Aşağıdan bir not ekleyebilirsiniz.
        </p>
      ) : (
        <div className="space-y-3">
          {groupedNotes.map((group) => (
            <div key={group.authorId} className="space-y-2">
              <Badge variant="outline" className="text-[11px]">
                {group.label}
              </Badge>
              <ul className="space-y-2">
                {group.notes.map((note) => {
                  const canDelete =
                    !disabled &&
                    currentUserId !== null &&
                    note.authorId === currentUserId;

                  return (
                    <li
                      key={note.id}
                      className="flex items-start gap-2 rounded-lg border bg-background px-3 py-2.5"
                    >
                      <p className="min-w-0 flex-1 text-sm leading-relaxed">{note.text}</p>
                      {canDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Notu sil"
                          onClick={() => onRemoveNote(note.id)}
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
