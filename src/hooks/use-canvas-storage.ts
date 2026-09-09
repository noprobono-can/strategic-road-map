"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkspaceUserId } from "@/lib/gate-config";
import {
  CanvasFieldKey,
  CompanyWorkspaceData,
  EMPTY_COMPANY_DATA,
  LEGACY_STORAGE_KEY,
  normalizeStore,
  STORAGE_KEY,
  WorkspaceStore,
  createNote,
} from "@/lib/canvas-types";

type StorageStatus = "loading" | "ready" | "error";

function readStore(): WorkspaceStore {
  if (typeof window === "undefined") {
    return {};
  }

  const raw =
    window.localStorage.getItem(STORAGE_KEY) ??
    window.localStorage.getItem(LEGACY_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  const parsed = JSON.parse(raw) as unknown;
  const normalized = normalizeStore(parsed);

  if (window.localStorage.getItem(STORAGE_KEY) !== JSON.stringify(normalized)) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}

function writeStore(store: WorkspaceStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function useCanvasStorage(companyId: string, currentUserId: WorkspaceUserId | null) {
  const [status, setStatus] = useState<Exclude<StorageStatus, "loading">>("ready");
  const [data, setData] = useState<CompanyWorkspaceData>(EMPTY_COMPANY_DATA);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const loaded = readStore();
      setData(loaded[companyId] ?? EMPTY_COMPANY_DATA);
      setIsHydrated(true);
    } catch {
      setStatus("error");
      setIsHydrated(true);
    }
  }, [companyId]);

  const persistCompanyData = useCallback(
    (next: CompanyWorkspaceData) => {
      setData(next);

      try {
        const loaded = readStore();
        writeStore({ ...loaded, [companyId]: next });
      } catch {
        setStatus("error");
      }
    },
    [companyId],
  );

  const addZoneNote = useCallback(
    (zoneKey: CanvasFieldKey, text: string) => {
      const trimmed = text.trim();
      if (!trimmed || !currentUserId) {
        return false;
      }

      setData((current) => {
        const next: CompanyWorkspaceData = {
          zones: {
            ...current.zones,
            [zoneKey]: [...current.zones[zoneKey], createNote(trimmed, currentUserId)],
          },
        };
        persistCompanyData(next);
        return next;
      });

      return true;
    },
    [currentUserId, persistCompanyData],
  );

  const removeZoneNote = useCallback(
    (zoneKey: CanvasFieldKey, noteId: string) => {
      if (!currentUserId) {
        return;
      }

      setData((current) => {
        const note = current.zones[zoneKey].find((entry) => entry.id === noteId);
        if (!note || note.authorId !== currentUserId) {
          return current;
        }

        const next: CompanyWorkspaceData = {
          zones: {
            ...current.zones,
            [zoneKey]: current.zones[zoneKey].filter((entry) => entry.id !== noteId),
          },
        };
        persistCompanyData(next);
        return next;
      });
    },
    [currentUserId, persistCompanyData],
  );

  const uiStatus: StorageStatus = !isHydrated ? "loading" : status;

  return {
    status: uiStatus,
    zones: data.zones,
    addZoneNote,
    removeZoneNote,
  };
}
