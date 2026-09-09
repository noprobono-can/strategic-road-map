import { WorkspaceUserId } from "@/lib/gate-config";

export const PASSWORD_STORE_KEY = "group-strategy-passwords-v1";
export const MIN_PASSWORD_LENGTH = 8;
const PBKDF2_ITERATIONS = 100_000;

interface StoredPasswordRecord {
  salt: string;
  hash: string;
  iterations: number;
}

type PasswordStore = Partial<Record<WorkspaceUserId, StoredPasswordRecord>>;

function readPasswordStore(): PasswordStore {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(PASSWORD_STORE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw) as PasswordStore;
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writePasswordStore(store: PasswordStore) {
  window.localStorage.setItem(PASSWORD_STORE_KEY, JSON.stringify(store));
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function derivePasswordHash(
  password: string,
  salt: Uint8Array,
  iterations: number,
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  return crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );
}

async function hashPassword(password: string): Promise<StoredPasswordRecord> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hashBuffer = await derivePasswordHash(password, salt, PBKDF2_ITERATIONS);

  return {
    salt: bytesToBase64(salt),
    hash: bytesToBase64(new Uint8Array(hashBuffer)),
    iterations: PBKDF2_ITERATIONS,
  };
}

async function verifyPassword(
  password: string,
  record: StoredPasswordRecord,
): Promise<boolean> {
  const salt = base64ToBytes(record.salt);
  const hashBuffer = await derivePasswordHash(
    password,
    salt,
    record.iterations || PBKDF2_ITERATIONS,
  );
  const actualHash = bytesToBase64(new Uint8Array(hashBuffer));

  return actualHash === record.hash;
}

export function hasStoredPassword(userId: WorkspaceUserId): boolean {
  const store = readPasswordStore();
  return Boolean(store[userId]?.hash && store[userId]?.salt);
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Şifre en az ${MIN_PASSWORD_LENGTH} karakter olmalıdır.`;
  }

  return null;
}

export async function createStoredPassword(
  userId: WorkspaceUserId,
  password: string,
): Promise<void> {
  const record = await hashPassword(password);
  const store = readPasswordStore();
  store[userId] = record;
  writePasswordStore(store);
}

export async function verifyStoredPassword(
  userId: WorkspaceUserId,
  password: string,
): Promise<boolean> {
  const store = readPasswordStore();
  const record = store[userId];

  if (!record) {
    return false;
  }

  return verifyPassword(password, record);
}

export async function changeStoredPassword(
  userId: WorkspaceUserId,
  currentPassword: string,
  newPassword: string,
): Promise<"invalid-current" | "success"> {
  const valid = await verifyStoredPassword(userId, currentPassword);
  if (!valid) {
    return "invalid-current";
  }

  await createStoredPassword(userId, newPassword);
  return "success";
}
