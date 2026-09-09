"use client";

import { CanvasFieldKey } from "@/lib/canvas-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CanvasZoneCardProps {
  labelTr: string;
  labelEn?: string;
  helperTr: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  fieldKey?: CanvasFieldKey;
}

export function CanvasZoneCard({
  labelTr,
  labelEn,
  helperTr,
  value,
  onChange,
  disabled,
  className,
  fieldKey,
}: CanvasZoneCardProps) {
  const isEmpty = value.trim().length === 0;

  return (
    <Card
      className={cn(
        "flex h-full min-h-[180px] flex-col border-dashed bg-card/80 shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-sm font-semibold">{labelTr}</CardTitle>
        {labelEn ? (
          <CardDescription className="text-[11px] uppercase tracking-wide">
            {labelEn}
          </CardDescription>
        ) : null}
        <CardDescription className="text-xs leading-relaxed">
          {helperTr}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <Textarea
          id={fieldKey}
          name={fieldKey}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          placeholder={
            isEmpty
              ? "Henüz not eklenmedi. Canlı oturumda doldurulacak."
              : undefined
          }
          className="min-h-[96px] flex-1 resize-none text-sm leading-relaxed"
        />
      </CardContent>
    </Card>
  );
}

interface RoadmapZoneCardProps {
  values: {
    now: string;
    next: string;
    later: string;
  };
  onChange: (key: "roadmapNow" | "roadmapNext" | "roadmapLater", value: string) => void;
  disabled?: boolean;
  className?: string;
}

const ROADMAP_COLUMNS = [
  {
    key: "roadmapNow" as const,
    labelTr: "Şimdi",
    labelEn: "Now",
    helperTr: "Mevcut odak ve acil adımlar.",
  },
  {
    key: "roadmapNext" as const,
    labelTr: "Sonra",
    labelEn: "Next",
    helperTr: "Yakın dönem büyüme ve teslimat.",
  },
  {
    key: "roadmapLater" as const,
    labelTr: "İleride",
    labelEn: "Later",
    helperTr: "Uzun vadeli dönüşüm ve genişleme.",
  },
];

export function RoadmapZoneCard({
  values,
  onChange,
  disabled,
  className,
}: RoadmapZoneCardProps) {
  return (
    <Card
      className={cn(
        "flex h-full min-h-[220px] flex-col border-dashed bg-card/80 shadow-none",
        className,
      )}
    >
      <CardHeader className="gap-1 pb-3">
        <CardTitle className="text-sm font-semibold">Yol Haritası</CardTitle>
        <CardDescription className="text-[11px] uppercase tracking-wide">
          Now / Next / Later roadmap
        </CardDescription>
        <CardDescription className="text-xs leading-relaxed">
          Şimdi, sonra ve ileride odaklanılacak adımlar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid flex-1 gap-3 pt-0 md:grid-cols-3">
        {ROADMAP_COLUMNS.map((column) => {
          const value = values[
            column.key === "roadmapNow"
              ? "now"
              : column.key === "roadmapNext"
                ? "next"
                : "later"
          ];

          return (
            <div key={column.key} className="flex min-h-[120px] flex-col gap-2">
              <div>
                <p className="text-xs font-semibold">{column.labelTr}</p>
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  {column.labelEn}
                </p>
              </div>
              <Textarea
                id={column.key}
                name={column.key}
                value={value}
                onChange={(event) => onChange(column.key, event.target.value)}
                disabled={disabled}
                placeholder="Henüz not eklenmedi. Canlı oturumda doldurulacak."
                className="min-h-[88px] flex-1 resize-none text-sm leading-relaxed"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
