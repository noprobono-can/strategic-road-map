export interface CanvasFields {
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

export type CanvasFieldKey = keyof CanvasFields;

export interface CanvasZoneDefinition {
  key: CanvasFieldKey | "roadmap";
  labelTr: string;
  labelEn?: string;
  helperTr: string;
  span?: "wide" | "tall" | "default";
}

export const EMPTY_CANVAS: CanvasFields = {
  ambition: "",
  marketsCustomers: "",
  offerings: "",
  howWeWin: "",
  roadmapNow: "",
  roadmapNext: "",
  roadmapLater: "",
  groupSynergies: "",
  risksConstraints: "",
  successMetrics: "",
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

export type CanvasStore = Record<string, CanvasFields>;

export const STORAGE_KEY = "group-strategic-roadmap-canvas-v1";
