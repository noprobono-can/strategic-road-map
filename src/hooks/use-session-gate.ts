"use client";

import { useCallback, useEffect, useState } from "react";
import {
  clearGateSession,
  GateSession,
  readGateSession,
  resolveUsername,
  WorkspaceUserId,
  writeGateSession,
} from "@/lib/gate-config";
import {
  changeStoredPassword,
  createStoredPassword,
  hasStoredPassword,
  verifyStoredPassword,
} from "@/lib/password-auth";

type GateStatus = "loading" | "locked" | "unlocked";

export function useSessionGate() {
  const [status, setStatus] = useState<GateStatus>("loading");
  const [session, setSession] = useState<GateSession | null>(null);

  useEffect(() => {
    const existing = readGateSession();
    setSession(existing);
    setStatus(existing ? "unlocked" : "locked");
  }, []);

  const completeUnlock = useCallback((userId: WorkspaceUserId) => {
    writeGateSession(userId);
    const nextSession = readGateSession();
    setSession(nextSession);
    setStatus("unlocked");
    return true;
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const userId = resolveUsername(username);
    if (!userId || !hasStoredPassword(userId)) {
      return false;
    }

    try {
      const valid = await verifyStoredPassword(userId, password);
      if (!valid) {
        return false;
      }

      return completeUnlock(userId);
    } catch {
      return false;
    }
  }, [completeUnlock]);

  const setupPassword = useCallback(
    async (username: string, password: string) => {
      const userId = resolveUsername(username);
      if (!userId || hasStoredPassword(userId)) {
        return false;
      }

      try {
        await createStoredPassword(userId, password);
        return completeUnlock(userId);
      } catch {
        return false;
      }
    },
    [completeUnlock],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const userId = session?.userId;
      if (!userId) {
        return "not-logged-in" as const;
      }

      try {
        return await changeStoredPassword(userId, currentPassword, newPassword);
      } catch {
        return "invalid-current" as const;
      }
    },
    [session?.userId],
  );

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
    login,
    setupPassword,
    changePassword,
    hasStoredPassword,
    resolveUsername,
    lock,
  };
}

export type { WorkspaceUserId };
