import { jsPDF } from "jspdf";
import { Company } from "@/lib/companies";
import {
  CANVAS_ZONES,
  CanvasFieldKey,
  WorkspaceNote,
  ZoneNotes,
} from "@/lib/canvas-types";
import { getUserLabel, WorkspaceUserId } from "@/lib/gate-config";

const AUTHOR_ORDER: WorkspaceUserId[] = ["okan", "emre", "bora"];
const FONT_FILE = "NotoSans-Regular.ttf";
const FONT_NAME = "NotoSans";
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSans/NotoSans-Regular.ttf";
const PAGE_MARGIN = 18;
const LINE_HEIGHT = 6;

let fontLoadPromise: Promise<string> | null = null;

interface ReportSection {
  titleTr: string;
  titleEn?: string;
  keys: CanvasFieldKey[];
}

const REPORT_SECTIONS: ReportSection[] = [
  {
    titleTr: "Niyet / Kuzey Yıldızı",
    titleEn: "Ambition",
    keys: ["ambition"],
  },
  {
    titleTr: "Pazarlar ve Müşteriler",
    titleEn: "Markets & customers",
    keys: ["marketsCustomers"],
  },
  {
    titleTr: "Teklifler",
    titleEn: "Offerings",
    keys: ["offerings"],
  },
  {
    titleTr: "Nasıl Kazanırız",
    titleEn: "How we win",
    keys: ["howWeWin"],
  },
  {
    titleTr: "Yol Haritası — Şimdi",
    titleEn: "Now",
    keys: ["roadmapNow"],
  },
  {
    titleTr: "Yol Haritası — Sonra",
    titleEn: "Next",
    keys: ["roadmapNext"],
  },
  {
    titleTr: "Yol Haritası — İleride",
    titleEn: "Later",
    keys: ["roadmapLater"],
  },
  {
    titleTr: "Grup Sinerjileri",
    titleEn: "Group synergies",
    keys: ["groupSynergies"],
  },
  {
    titleTr: "Riskler ve Kısıtlar",
    titleEn: "Risks & constraints",
    keys: ["risksConstraints"],
  },
  {
    titleTr: "Başarı Metrikleri",
    titleEn: "Success metrics",
    keys: ["successMetrics"],
  },
];

async function loadFontData(): Promise<string> {
  if (!fontLoadPromise) {
    fontLoadPromise = fetch(FONT_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Font download failed");
        }
        return response.arrayBuffer();
      })
      .then((buffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = "";
        bytes.forEach((byte) => {
          binary += String.fromCharCode(byte);
        });
        return btoa(binary);
      });
  }

  return fontLoadPromise;
}

function getPageWidth(doc: jsPDF): number {
  return doc.internal.pageSize.getWidth();
}

function getPageHeight(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight();
}

function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function formatReportDate(date: Date): string {
  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}

function groupNotesByAuthor(notes: WorkspaceNote[]) {
  return AUTHOR_ORDER.map((authorId) => ({
    authorId,
    label: getUserLabel(authorId),
    notes: notes.filter((note) => note.authorId === authorId),
  })).filter((group) => group.notes.length > 0);
}

function getNotesForSection(zones: ZoneNotes, keys: CanvasFieldKey[]): WorkspaceNote[] {
  return keys.flatMap((key) => zones[key] ?? []);
}

function getSectionHelper(section: ReportSection): string | undefined {
  const roadmapHelpers: Partial<Record<CanvasFieldKey, string>> = {
    roadmapNow: "Mevcut odak ve acil adımlar.",
    roadmapNext: "Yakın dönem büyüme ve teslimat.",
    roadmapLater: "Uzun vadeli dönüşüm ve genişleme.",
  };

  const key = section.keys[0];
  if (key && roadmapHelpers[key]) {
    return roadmapHelpers[key];
  }

  return CANVAS_ZONES.find((zone) => zone.key === key)?.helperTr;
}

function addPageIfNeeded(doc: jsPDF, y: number, requiredSpace: number): number {
  const maxY = getPageHeight(doc) - PAGE_MARGIN;
  if (y + requiredSpace <= maxY) {
    return y;
  }

  doc.addPage();
  return PAGE_MARGIN;
}

function writeLines(
  doc: jsPDF,
  lines: string[],
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
  fontStyle: "normal" | "bold" = "normal",
): number {
  doc.setFont(FONT_NAME, fontStyle);
  doc.setFontSize(fontSize);

  for (const line of lines) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT + 2);
    doc.text(line, x, y, { maxWidth });
    y += LINE_HEIGHT;
  }

  return y;
}

function writeParagraph(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  fontSize: number,
): number {
  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxWidth) as string[];
  return writeLines(doc, lines, x, y, maxWidth, fontSize);
}

function writeSectionNotes(
  doc: jsPDF,
  notes: WorkspaceNote[],
  y: number,
  contentWidth: number,
): number {
  const grouped = groupNotesByAuthor(notes);

  if (grouped.length === 0) {
    doc.setFont(FONT_NAME, "normal");
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    y = addPageIfNeeded(doc, y, LINE_HEIGHT + 2);
    y = writeLines(
      doc,
      ["Henüz not eklenmedi."],
      PAGE_MARGIN,
      y,
      contentWidth,
      10,
    );
    doc.setTextColor(0, 0, 0);
    return y + 2;
  }

  for (const group of grouped) {
    y = addPageIfNeeded(doc, y, LINE_HEIGHT * 2);
    y = writeLines(
      doc,
      [group.label],
      PAGE_MARGIN,
      y,
      contentWidth,
      10,
      "bold",
    );

    for (const note of group.notes) {
      const bulletLines = doc.splitTextToSize(`• ${note.text}`, contentWidth - 6) as string[];
      y = writeLines(doc, bulletLines, PAGE_MARGIN + 4, y, contentWidth - 6, 10);
    }

    y += 2;
  }

  return y;
}

export async function downloadWorkspacePdfReport(
  company: Company,
  zones: ZoneNotes,
): Promise<void> {
  const fontBase64 = await loadFontData();
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.addFileToVFS(FONT_FILE, fontBase64);
  doc.addFont(FONT_FILE, FONT_NAME, "normal");
  doc.addFont(FONT_FILE, FONT_NAME, "bold");
  doc.setFont(FONT_NAME, "normal");

  const contentWidth = getPageWidth(doc) - PAGE_MARGIN * 2;
  let y = PAGE_MARGIN;

  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(16);
  y = writeLines(
    doc,
    ["Grup Strateji Workspace — Rapor"],
    PAGE_MARGIN,
    y,
    contentWidth,
    16,
    "bold",
  );
  y += 2;

  doc.setFont(FONT_NAME, "bold");
  doc.setFontSize(14);
  y = writeLines(doc, [company.name], PAGE_MARGIN, y, contentWidth, 14, "bold");
  y += 1;

  doc.setFont(FONT_NAME, "normal");
  doc.setFontSize(10);
  doc.setTextColor(70, 70, 70);
  y = writeParagraph(doc, `Birincil rol: ${company.role}`, PAGE_MARGIN, y, contentWidth, 10);
  y = writeParagraph(
    doc,
    `Oluşturulma: ${formatReportDate(new Date())}`,
    PAGE_MARGIN,
    y + 1,
    contentWidth,
    10,
  );
  doc.setTextColor(0, 0, 0);
  y += 6;

  for (const section of REPORT_SECTIONS) {
    const helperTr = getSectionHelper(section);
    const title = section.titleEn
      ? `${section.titleTr} (${section.titleEn})`
      : section.titleTr;

    y = addPageIfNeeded(doc, y, LINE_HEIGHT * 4);
    doc.setDrawColor(210, 210, 210);
    doc.line(PAGE_MARGIN, y, getPageWidth(doc) - PAGE_MARGIN, y);
    y += 5;

    y = writeLines(doc, [title], PAGE_MARGIN, y, contentWidth, 12, "bold");

    if (helperTr) {
      doc.setTextColor(90, 90, 90);
      y = writeParagraph(doc, helperTr, PAGE_MARGIN, y + 1, contentWidth, 9);
      doc.setTextColor(0, 0, 0);
    }

    y += 2;
    y = writeSectionNotes(
      doc,
      getNotesForSection(zones, section.keys),
      y,
      contentWidth,
    );
    y += 4;
  }

  const filename = `${sanitizeFilename(company.name)}-strateji-raporu.pdf`;
  doc.save(filename);
}
