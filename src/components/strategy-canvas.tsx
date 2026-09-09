"use client";

import { AlertCircle, Sparkles } from "lucide-react";
import { Company } from "@/lib/companies";
import { CanvasFieldKey, ZoneNotes } from "@/lib/canvas-types";
import { WorkspaceUserId } from "@/lib/gate-config";
import { CanvasZoneCard, RoadmapZoneCard } from "@/components/canvas-zone-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StrategyCanvasProps {
  company: Company;
  zones: ZoneNotes;
  currentUserId: WorkspaceUserId;
  status: "loading" | "ready" | "error";
  onAddZoneNote: (zoneKey: CanvasFieldKey, text: string) => boolean;
  onRemoveZoneNote: (zoneKey: CanvasFieldKey, noteId: string) => void;
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
          <CardTitle className="text-lg">Veriler yüklenemedi</CardTitle>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
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
  zones,
  currentUserId,
  status,
  onAddZoneNote,
  onRemoveZoneNote,
}: StrategyCanvasProps) {
  if (status === "loading") {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border bg-muted/30 px-4 py-3">
          <p className="text-base text-muted-foreground">Workspace yükleniyor…</p>
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
            <Badge variant="outline" className="text-xs">
              Seçili varlık
            </Badge>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Sparkles className="size-3.5" />
              Canlı doldurma
            </Badge>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Varlık adı
            </p>
            <CardTitle className="text-3xl font-semibold tracking-tight">
              {company.name}
            </CardTitle>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Birincil rol
            </p>
            <p className="mt-1.5 max-w-3xl text-base leading-relaxed text-foreground">
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
          notes={zones.ambition}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("ambition", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("ambition", noteId)}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Pazarlar ve Müşteriler"
          labelEn="Markets & customers"
          helperTr="Hedef segmentler, müşteri profilleri ve coğrafyalar."
          notes={zones.marketsCustomers}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("marketsCustomers", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("marketsCustomers", noteId)}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Teklifler"
          labelEn="Offerings"
          helperTr="Ürünler, hizmetler ve değer önerileri."
          notes={zones.offerings}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("offerings", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("offerings", noteId)}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Nasıl Kazanırız"
          labelEn="How we win"
          helperTr="Rekabet avantajları ve farklılaştırıcı yetenekler."
          notes={zones.howWeWin}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("howWeWin", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("howWeWin", noteId)}
        />

        <RoadmapZoneCard
          className="xl:col-span-12"
          currentUserId={currentUserId}
          disabled={disabled}
          columns={[
            {
              key: "roadmapNow",
              labelTr: "Şimdi",
              labelEn: "Now",
              helperTr: "Mevcut odak ve acil adımlar.",
              notes: zones.roadmapNow,
            },
            {
              key: "roadmapNext",
              labelTr: "Sonra",
              labelEn: "Next",
              helperTr: "Yakın dönem büyüme ve teslimat.",
              notes: zones.roadmapNext,
            },
            {
              key: "roadmapLater",
              labelTr: "İleride",
              labelEn: "Later",
              helperTr: "Uzun vadeli dönüşüm ve genişleme.",
              notes: zones.roadmapLater,
            },
          ]}
          onAddNote={onAddZoneNote}
          onRemoveNote={onRemoveZoneNote}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Grup Sinerjileri"
          labelEn="Group synergies"
          helperTr="Diğer grup varlıklarıyla bağlantılar ve ortak fırsatlar."
          notes={zones.groupSynergies}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("groupSynergies", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("groupSynergies", noteId)}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Riskler ve Kısıtlar"
          labelEn="Risks & constraints"
          helperTr="Dış tehditler, iç kısıtlar ve azaltma yaklaşımları."
          notes={zones.risksConstraints}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("risksConstraints", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("risksConstraints", noteId)}
        />

        <CanvasZoneCard
          className="xl:col-span-4"
          labelTr="Başarı Metrikleri"
          labelEn="Success metrics"
          helperTr="Ölçülebilir sonuçlar ve izleme göstergeleri."
          notes={zones.successMetrics}
          currentUserId={currentUserId}
          disabled={disabled}
          onAddNote={(text) => onAddZoneNote("successMetrics", text)}
          onRemoveNote={(noteId) => onRemoveZoneNote("successMetrics", noteId)}
        />
      </div>
    </div>
  );
}
