import { WorkspaceUserId } from "@/lib/gate-config";

export interface WorkspaceNote {
  id: string;
  text: string;
  authorId: WorkspaceUserId;
}

export type CanvasFieldKey =
  | "ambition"
  | "marketsCustomers"
  | "offerings"
  | "howWeWin"
  | "roadmapNow"
  | "roadmapNext"
  | "roadmapLater"
  | "groupSynergies"
  | "risksConstraints"
  | "successMetrics";

export type ZoneNotes = Record<CanvasFieldKey, WorkspaceNote[]>;

export interface CompanyWorkspaceData {
  zones: ZoneNotes;
}

export interface CanvasZoneDefinition {
  key: CanvasFieldKey | "roadmap";
  labelTr: string;
  labelEn?: string;
  helperTr: string;
  span?: "wide" | "tall" | "default";
}

export const CANVAS_FIELD_KEYS: CanvasFieldKey[] = [
  "ambition",
  "marketsCustomers",
  "offerings",
  "howWeWin",
  "roadmapNow",
  "roadmapNext",
  "roadmapLater",
  "groupSynergies",
  "risksConstraints",
  "successMetrics",
];

export function createEmptyZoneNotes(): ZoneNotes {
  return {
    ambition: [],
    marketsCustomers: [],
    offerings: [],
    howWeWin: [],
    roadmapNow: [],
    roadmapNext: [],
    roadmapLater: [],
    groupSynergies: [],
    risksConstraints: [],
    successMetrics: [],
  };
}

export const EMPTY_COMPANY_DATA: CompanyWorkspaceData = {
  zones: createEmptyZoneNotes(),
};

export const CANVAS_ZONES: CanvasZoneDefinition[] = [
  {
    key: "ambition",
    labelTr: "Niyet / Kuzey Yıldızı",
    labelEn: "Ambition",
    helperTr: "Uzun vadeli yön ve stratejik niyet.",
    span: "wide",
  },
  {
    key: "marketsCustomers",
    labelTr: "Pazarlar ve Müşteriler",
    labelEn: "Markets & customers",
    helperTr: "Hedef segmentler, müşteri profilleri ve coğrafyalar.",
  },
  {
    key: "offerings",
    labelTr: "Teklifler",
    labelEn: "Offerings",
    helperTr: "Ürünler, hizmetler ve değer önerileri.",
  },
  {
    key: "howWeWin",
    labelTr: "Nasıl Kazanırız",
    labelEn: "How we win",
    helperTr: "Rekabet avantajları ve farklılaştırıcı yetenekler.",
  },
  {
    key: "roadmap",
    labelTr: "Yol Haritası",
    labelEn: "Now / Next / Later",
    helperTr: "Şimdi, sonra ve ileride odaklanılacak adımlar.",
    span: "wide",
  },
  {
    key: "groupSynergies",
    labelTr: "Grup Sinerjileri",
    labelEn: "Group synergies",
    helperTr: "Diğer grup varlıklarıyla bağlantılar ve ortak fırsatlar.",
  },
  {
    key: "risksConstraints",
    labelTr: "Riskler ve Kısıtlar",
    labelEn: "Risks & constraints",
    helperTr: "Dış tehditler, iç kısıtlar ve azaltma yaklaşımları.",
  },
  {
    key: "successMetrics",
    labelTr: "Başarı Metrikleri",
    labelEn: "Success metrics",
    helperTr: "Ölçülebilir sonuçlar ve izleme göstergeleri.",
  },
];

export type WorkspaceStore = Record<string, CompanyWorkspaceData>;

export const STORAGE_KEY = "group-strategic-roadmap-canvas-v2";
export const LEGACY_STORAGE_KEY = "group-strategic-roadmap-canvas-v1";

interface LegacyCanvasFields {
  ambition: string;
  marketsCustomers: string;
  offerings: string;
  howWeWin: string;
  roadmapNow: string;
  roadmapNext: string;
  roadmapLater: string;
  groupSynergies: string;
  risksConstraints: string;
  successMetrics: string;
}

interface LegacyCompanyNote {
  id: string;
  text: string;
  authorId?: WorkspaceUserId;
}

function createNoteId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createMigratedNote(text: string, authorId: WorkspaceUserId = "okan"): WorkspaceNote {
  return {
    id: createNoteId(),
    text,
    authorId,
  };
}

function migrateLegacyFields(fields: LegacyCanvasFields): ZoneNotes {
  const zones = createEmptyZoneNotes();

  (Object.keys(fields) as CanvasFieldKey[]).forEach((key) => {
    const value = fields[key]?.trim();
    if (value) {
      zones[key] = [createMigratedNote(value)];
    }
  });

  return zones;
}

function migrateLegacyCompanyValue(value: unknown): CompanyWorkspaceData {
  if (typeof value !== "object" || value === null) {
    return EMPTY_COMPANY_DATA;
  }

  if ("zones" in value && typeof (value as CompanyWorkspaceData).zones === "object") {
    const data = value as CompanyWorkspaceData;
    const zones = createEmptyZoneNotes();

    CANVAS_FIELD_KEYS.forEach((key) => {
      const notes = data.zones?.[key];
      zones[key] = Array.isArray(notes)
        ? notes
            .filter((note) => typeof note?.text === "string" && note.text.trim())
            .map((note) => ({
              id: note.id || createNoteId(),
              text: note.text.trim(),
              authorId:
                note.authorId === "emre" || note.authorId === "bora"
                  ? note.authorId
                  : "okan",
            }))
        : [];
    });

    return { zones };
  }

  if ("fields" in value && typeof (value as { fields: LegacyCanvasFields }).fields === "object") {
    const legacy = value as {
      fields: LegacyCanvasFields;
      notes?: LegacyCompanyNote[];
    };
    const zones = migrateLegacyFields(legacy.fields);

    legacy.notes?.forEach((note) => {
      const text = note.text?.trim();
      if (text) {
        zones.ambition.push(
          createMigratedNote(
            text,
            note.authorId === "emre" || note.authorId === "bora"
              ? note.authorId
              : "okan",
          ),
        );
      }
    });

    return { zones };
  }

  if ("ambition" in value) {
    return { zones: migrateLegacyFields(value as LegacyCanvasFields) };
  }

  return EMPTY_COMPANY_DATA;
}

export function normalizeStore(raw: unknown): WorkspaceStore {
  if (typeof raw !== "object" || raw === null) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(raw).map(([companyId, value]) => [
      companyId,
      migrateLegacyCompanyValue(value),
    ]),
  );
}

export function createNote(text: string, authorId: WorkspaceUserId): WorkspaceNote {
  return {
    id: createNoteId(),
    text: text.trim(),
    authorId,
  };
}
