export type WorkspaceUserId = "okan" | "emre" | "bora";

export const GATE_SESSION_KEY = "group-strategy-gate";

export interface GateSession {
  userId: WorkspaceUserId;
  token: "v2-access";
}

export interface WorkspaceUserDefinition {
  id: WorkspaceUserId;
  label: string;
}

export const WORKSPACE_USERS: WorkspaceUserDefinition[] = [
  { id: "okan", label: "Okan" },
  { id: "emre", label: "Emre" },
  { id: "bora", label: "Bora" },
];

export function getUserLabel(userId: WorkspaceUserId): string {
  return WORKSPACE_USERS.find((user) => user.id === userId)?.label ?? userId;
}

export function resolveUsername(username: string): WorkspaceUserId | null {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername) {
    return null;
  }

  return WORKSPACE_USERS.find((entry) => entry.id === normalizedUsername)?.id ?? null;
}

export function readGateSession(): GateSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(GATE_SESSION_KEY);
    if (!raw) {
      return null;
    }

    if (raw === "v1-access") {
      return { userId: "okan", token: "v2-access" };
    }

    const parsed = JSON.parse(raw) as GateSession;
    if (
      parsed.token === "v2-access" &&
      WORKSPACE_USERS.some((user) => user.id === parsed.userId)
    ) {
      return parsed;
    }
  } catch {
    return null;
  }

  return null;
}

export function writeGateSession(userId: WorkspaceUserId) {
  const session: GateSession = { userId, token: "v2-access" };
  sessionStorage.setItem(GATE_SESSION_KEY, JSON.stringify(session));
}

export function clearGateSession() {
  sessionStorage.removeItem(GATE_SESSION_KEY);
}
