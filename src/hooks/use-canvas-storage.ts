"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CanvasFieldKey,
  CanvasStore,
  CompanyCanvasData,
  CompanyNote,
  EMPTY_COMPANY_DATA,
  STORAGE_KEY,
  normalizeStore,
} from "@/lib/canvas-types";

type StorageStatus = "loading" | "ready" | "error";

function readStore(): CanvasStore {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {};
  }

  const parsed = JSON.parse(raw) as unknown;
  return normalizeStore(parsed);
}

function writeStore(store: CanvasStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function createNoteId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useCanvasStorage(companyId: string) {
  const [status, setStatus] = useState<Exclude<StorageStatus, "loading">>("ready");
  const [store, setStore] = useState<CanvasStore>({});
  const [data, setData] = useState<CompanyCanvasData>(EMPTY_COMPANY_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const loaded = readStore();
      setStore(loaded);
      setData(loaded[companyId] ?? EMPTY_COMPANY_DATA);
      setIsHydrated(true);
    } catch {
      setStatus("error");
      setIsHydrated(true);
    }
  }, [companyId]);

  const persistCompanyData = useCallback(
    (next: CompanyCanvasData) => {
      setData(next);
      setStore((previous) => {
        const updated = { ...previous, [companyId]: next };
        try {
          writeStore(updated);
        } catch {
          setStatus("error");
        }
        return updated;
      });
    },
    [companyId],
  );

  const updateField = useCallback(
    (key: CanvasFieldKey, value: string) => {
      setData((current) => {
        const next: CompanyCanvasData = {
          ...current,
          fields: { ...current.fields, [key]: value },
        };
        persistCompanyData(next);
        return next;
      });
    },
    [persistCompanyData],
  );

  const addNote = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return false;
      }

      const note: CompanyNote = {
        id: createNoteId(),
        text: trimmed,
      };

      setData((current) => {
        const next: CompanyCanvasData = {
          ...current,
          notes: [...current.notes, note],
        };
        persistCompanyData(next);
        return next;
      });

      return true;
    },
    [persistCompanyData],
  );

  const removeNote = useCallback(
    (noteId: string) => {
      setData((current) => {
        const next: CompanyCanvasData = {
          ...current,
          notes: current.notes.filter((note) => note.id !== noteId),
        };
        persistCompanyData(next);
        return next;
      });
    },
    [persistCompanyData],
  );

  const uiStatus: StorageStatus = !isHydrated ? "loading" : status;

  return {
    status: uiStatus,
    fields: data.fields,
    notes: data.notes,
    updateField,
    addNote,
    removeNote,
  };
}
