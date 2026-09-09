"use client";

import { FormEvent, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { WorkspaceUserId } from "@/lib/gate-config";
import { WorkspaceNote } from "@/lib/canvas-types";
import { Button } from "@/components/ui/button";

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

  const visibleNotes = useMemo(
    () =>
      currentUserId
        ? notes.filter((note) => note.authorId === currentUserId)
        : [],
    [currentUserId, notes],
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

      {visibleNotes.length === 0 ? (
        <p className="rounded-lg border border-dashed px-3 py-3 text-sm text-muted-foreground">
          Henüz not eklenmedi. Aşağıdan bir not ekleyebilirsiniz.
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleNotes.map((note) => (
            <li
              key={note.id}
              className="flex items-start gap-2 rounded-lg border bg-background px-3 py-2.5"
            >
              <p className="min-w-0 flex-1 text-sm leading-relaxed">{note.text}</p>
              {!disabled && currentUserId ? (
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
          ))}
        </ul>
      )}
    </div>
  );
}
