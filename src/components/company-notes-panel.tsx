"use client";

import { FormEvent, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CompanyNote } from "@/lib/canvas-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CompanyNotesPanelProps {
  notes: CompanyNote[];
  disabled?: boolean;
  onAddNote: (text: string) => boolean;
  onRemoveNote: (noteId: string) => void;
}

export function CompanyNotesPanel({
  notes,
  disabled,
  onAddNote,
  onRemoveNote,
}: CompanyNotesPanelProps) {
  const [draft, setDraft] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onAddNote(draft)) {
      setDraft("");
    }
  };

  return (
    <Card className="border-dashed bg-card/80 shadow-none">
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-sm font-semibold">Notlar</CardTitle>
        <CardDescription className="text-[11px] uppercase tracking-wide">
          Notes
        </CardDescription>
        <CardDescription className="text-xs leading-relaxed">
          Oturum sırasında eklenen kısa notlar. Her şirket için ayrı saklanır.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <form className="flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={disabled}
            placeholder="Yeni not yazın…"
            className="flex h-10 min-w-0 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
          />
          <Button type="submit" disabled={disabled || draft.trim().length === 0}>
            <Plus className="size-4" />
            Not ekle
          </Button>
        </form>

        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed px-3 py-4 text-sm text-muted-foreground">
            Henüz not eklenmedi. Aşağıdan bir not ekleyebilirsiniz.
          </p>
        ) : (
          <ul className="space-y-2">
            {notes.map((note) => (
              <li
                key={note.id}
                className="flex items-start gap-3 rounded-lg border bg-background px-3 py-3"
              >
                <p className="min-w-0 flex-1 text-sm leading-relaxed">{note.text}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label="Notu sil"
                  onClick={() => onRemoveNote(note.id)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
