"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import { Company } from "@/lib/companies";
import { CanvasFields, CompanyNote } from "@/lib/canvas-types";
import { CanvasZoneCard, RoadmapZoneCard } from "@/components/canvas-zone-card";
import { CompanyNotesPanel } from "@/components/company-notes-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StrategyCanvasProps {
  company: Company;
  fields: CanvasFields;
  notes: CompanyNote[];
  status: "loading" | "ready" | "error";
  onFieldChange: (key: keyof CanvasFields, value: string) => void;
  onAddNote: (text: string) => boolean;
  onRemoveNote: (noteId: string) => void;
}

function CanvasSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-xl" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

function CanvasErrorState() {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0">
        <AlertCircle className="mt-0.5 size-5 text-destructive" />
        <div>
          <CardTitle className="text-base">Veriler yüklenemedi</CardTitle>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Tarayıcı depolamasına erişilemiyor. Gizli mod, depolama
            kısıtlaması veya tarayıcı ayarları nedeniyle workspace
            kaydedilemeyebilir. Sayfayı yenileyin veya normal bir tarayıcı
            penceresinde tekrar deneyin.
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}

export function StrategyCanvas({
  company,
  fields,
  notes,
  status,
  onFieldChange,
  onAddNote,
  onRemoveNote,
}: StrategyCanvasProps) {
  if (status === "loading") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/30 px-4 py-3">
          <p className="text-sm text-muted-foreground">Workspace yükleniyor…</p>
        </div>
        <CanvasSkeleton />
      </div>
    );
  }

  if (status === "error") {
    return <CanvasErrorState />;
  }

  const disabled = status !== "ready";

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="gap-3 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[11px]">
              Seçili varlık
            </Badge>
            <Badge variant="secondary" className="gap-1 text-[11px]">
              <Sparkles className="size-3" />
              Canlı doldurma
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Varlık adı
            </p>
            <CardTitle className="text-2xl font-semibold tracking-tight">
              {company.name}
            </CardTitle>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Birincil rol
            </p>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-foreground/90">
              {company.role}
            </p>
          </div>
        </CardHeader>
      </Card>

      <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-12">
        <CanvasZoneCard
          className="xl:col-span-12"
          labelTr="Niyet / Kuzey Yıldızı"
          labelEn="Ambition"
          helperTr="Uzun vadeli yön ve stratejik niyet."
          value={fields.ambition}
          onChange={(value) => onFieldChange("ambition", value)}
          disabled={disabled}
          fieldKey="ambition"
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Pazarlar ve Müşteriler"
          labelEn="Markets & customers"
          helperTr="Hedef segmentler, müşteri profilleri ve coğrafyalar."
          value={fields.marketsCustomers}
          onChange={(value) => onFieldChange("marketsCustomers", value)}
          disabled={disabled}
          fieldKey="marketsCustomers"
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Teklifler"
          labelEn="Offerings"
          helperTr="Ürünler, hizmetler ve değer önerileri."
          value={fields.offerings}
          onChange={(value) => onFieldChange("offerings", value)}
          disabled={disabled}
          fieldKey="offerings"
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Nasıl Kazanırız"
          labelEn="How we win"
          helperTr="Rekabet avantajları ve farklılaştırıcı yetenekler."
          value={fields.howWeWin}
          onChange={(value) => onFieldChange("howWeWin", value)}
          disabled={disabled}
          fieldKey="howWeWin"
        />

        <RoadmapZoneCard
          className="xl:col-span-12"
          values={{
            now: fields.roadmapNow,
            next: fields.roadmapNext,
            later: fields.roadmapLater,
          }}
          onChange={onFieldChange}
          disabled={disabled}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Grup Sinerjileri"
          labelEn="Group synergies"
          helperTr="Diğer grup varlıklarıyla bağlantılar ve ortak fırsatlar."
          value={fields.groupSynergies}
          onChange={(value) => onFieldChange("groupSynergies", value)}
          disabled={disabled}
          fieldKey="groupSynergies"
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Riskler ve Kısıtlar"
          labelEn="Risks & constraints"
          helperTr="Dış tehditler, iç kısıtlar ve azaltma yaklaşımları."
          value={fields.risksConstraints}
          onChange={(value) => onFieldChange("risksConstraints", value)}
          disabled={disabled}
          fieldKey="risksConstraints"
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Başarı Metrikleri"
          labelEn="Success metrics"
          helperTr="Ölçülebilir sonuçlar ve izleme göstergeleri."
          value={fields.successMetrics}
          onChange={(value) => onFieldChange("successMetrics", value)}
          disabled={disabled}
          fieldKey="successMetrics"
        />

        <div className="xl:col-span-12">
          <CompanyNotesPanel
            notes={notes}
            disabled={disabled}
            onAddNote={onAddNote}
            onRemoveNote={onRemoveNote}
          />
        </div>
      </div>
    </div>
  );
}
