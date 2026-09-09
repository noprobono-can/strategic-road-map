"use client";

import { SessionGate } from "@/components/session-gate";
import { StrategyApp } from "@/components/strategy-app";

export function AuthWorkspace() {
  return (
    <SessionGate>
      {({ currentUserId, changePassword }) => (
        <StrategyApp currentUserId={currentUserId} changePassword={changePassword} />
      )}
    </SessionGate>
  );
}
