"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CanvasFields,
  CanvasFieldKey,
  CanvasStore,
  EMPTY_CANVAS,
  STORAGE_KEY,
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

  const parsed = JSON.parse(raw) as CanvasStore;
  return parsed;
}

function writeStore(store: CanvasStore) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function useCanvasStorage(companyId: string) {
  const [status, setStatus] = useState<StorageStatus>("loading");
  const [store, setStore] = useState<CanvasStore>({});
  const [fields, setFields] = useState<CanvasFields>(EMPTY_CANVAS);

  useEffect(() => {
    try {
      const loaded = readStore();
      setStore(loaded);
      setFields(loaded[companyId] ?? EMPTY_CANVAS);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [companyId]);

  const updateField = useCallback(
    (key: CanvasFieldKey, value: string) => {
      setFields((current) => {
        const next = { ...current, [key]: value };
        setStore((previous) => {
          const updated = { ...previous, [companyId]: next };
          try {
            writeStore(updated);
          } catch {
            setStatus("error");
          }
          return updated;
        });
        return next;
      });
    },
    [companyId],
  );

  return { status, fields, updateField };
}
