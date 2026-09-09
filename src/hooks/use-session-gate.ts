"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearGateSession,
  GateSession,
  readGateSession,
  validateCredentials,
  WorkspaceUserId,
  writeGateSession,
} from "@/lib/gate-config";

type GateStatus = "loading" | "locked" | "unlocked";

export function useSessionGate() {
  const [status, setStatus] = useState<GateStatus>("loading");
  const [session, setSession] = useState<GateSession | null>(null);

  useEffect(() => {
    const existing = readGateSession();
    setSession(existing);
    setStatus(existing ? "unlocked" : "locked");
  }, []);

  const unlock = useCallback((username: string, password: string) => {
    const userId = validateCredentials(username, password);
    if (!userId) {
      return false;
    }

    try {
      writeGateSession(userId);
      const nextSession = readGateSession();
      setSession(nextSession);
      setStatus("unlocked");
      return true;
    } catch {
      setStatus("locked");
      return false;
    }
  }, []);

  const lock = useCallback(() => {
    try {
      clearGateSession();
    } catch {
      // Ignore storage errors and still show the gate.
    }

    setSession(null);
    setStatus("locked");
  }, []);

  return {
    status,
    session,
    currentUserId: session?.userId ?? null,
    unlock,
    lock,
  };
}

export type { WorkspaceUserId };
