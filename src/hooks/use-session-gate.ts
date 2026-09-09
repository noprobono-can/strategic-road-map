"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GATE_SESSION_KEY,
  GATE_SESSION_TOKEN,
} from "@/lib/gate-config";

type GateStatus = "loading" | "locked" | "unlocked";

function readSessionUnlock(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return sessionStorage.getItem(GATE_SESSION_KEY) === GATE_SESSION_TOKEN;
  } catch {
    return false;
  }
}

export function useSessionGate() {
  const [status, setStatus] = useState<GateStatus>("loading");

  useEffect(() => {
    setStatus(readSessionUnlock() ? "unlocked" : "locked");
  }, []);

  const unlock = useCallback(() => {
    try {
      sessionStorage.setItem(GATE_SESSION_KEY, GATE_SESSION_TOKEN);
      setStatus("unlocked");
    } catch {
      setStatus("locked");
    }
  }, []);

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(GATE_SESSION_KEY);
    } catch {
      // Ignore storage errors and still show the gate.
    }

    setStatus("locked");
  }, []);

  return { status, unlock, lock };
}
