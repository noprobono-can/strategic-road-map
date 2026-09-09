export const GATE_SESSION_KEY = "group-strategy-gate";
export const GATE_SESSION_TOKEN = "v1-access";

export const ACCESS_CODES = ["ebo"] as const;

export function isAccessCodeValid(input: string): boolean {
  const normalized = input.trim();
  if (!normalized) {
    return false;
  }

  return ACCESS_CODES.some((code) => normalized === code);
}
