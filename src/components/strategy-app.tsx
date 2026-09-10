"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { getUserLabel, WorkspaceUserId } from "@/lib/gate-config";
import {
  getAccessibleCompanies,
  getDefaultCompanyIdForUser,
  isCompanyAccessible,
  readCompanyIdFromUrl,
  resolveCompanyIdForUser,
  writeCompanyIdToUrl,
} from "@/lib/company-access";
import { COMPANIES } from "@/lib/companies";
import { useCanvasStorage } from "@/hooks/use-canvas-storage";
import { useSessionGate } from "@/hooks/use-session-gate";
import { CompanySidebar } from "@/components/company-sidebar";
import { StrategyCanvas } from "@/components/strategy-canvas";
import { WorkspaceToolbar } from "@/components/workspace-toolbar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface StrategyAppProps {
  currentUserId: WorkspaceUserId;
  changePassword: ReturnType<typeof useSessionGate>["changePassword"];
  onLogout: () => void;
}

export function StrategyApp({
  currentUserId,
  changePassword,
  onLogout,
}: StrategyAppProps) {
  const accessibleCompanies = useMemo(
    () => getAccessibleCompanies(currentUserId),
    [currentUserId],
  );

  const [selectedCompanyId, setSelectedCompanyId] = useState(() =>
    resolveCompanyIdForUser(
      currentUserId,
      readCompanyIdFromUrl() ?? getDefaultCompanyIdForUser(currentUserId),
    ),
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { status, zones, addZoneNote, removeZoneNote } = useCanvasStorage(
    selectedCompanyId,
    currentUserId,
  );

  useEffect(() => {
    const fromUrl = readCompanyIdFromUrl();
    const resolved = resolveCompanyIdForUser(
      currentUserId,
      fromUrl ?? getDefaultCompanyIdForUser(currentUserId),
    );

    setSelectedCompanyId(resolved);
    writeCompanyIdToUrl(resolved);
  }, [currentUserId]);

  useEffect(() => {
    if (isCompanyAccessible(currentUserId, selectedCompanyId)) {
      return;
    }

    const resolved = getDefaultCompanyIdForUser(currentUserId);
    setSelectedCompanyId(resolved);
    writeCompanyIdToUrl(resolved);
  }, [currentUserId, selectedCompanyId]);

  const selectedCompany = useMemo(
    () =>
      accessibleCompanies.find((company) => company.id === selectedCompanyId) ??
      accessibleCompanies[0] ??
      COMPANIES[0],
    [accessibleCompanies, selectedCompanyId],
  );

  const handleSelectCompany = (companyId: string) => {
    const resolved = resolveCompanyIdForUser(currentUserId, companyId);
    setSelectedCompanyId(resolved);
    writeCompanyIdToUrl(resolved);
    setMobileNavOpen(false);
  };

  const showCompanyPicker = accessibleCompanies.length > 1;

  const mobileNavButton = showCompanyPicker ? (
    <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Şirket listesini aç" />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex h-full min-h-0 w-[min(100vw-2rem,320px)] flex-col gap-0 overflow-hidden p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Grup şirketleri</SheetTitle>
          <SheetDescription>
            Strateji workspace için bir grup şirketi seçin.
          </SheetDescription>
        </SheetHeader>
        <CompanySidebar
          companies={accessibleCompanies}
          selectedId={selectedCompanyId}
          onSelect={handleSelectCompany}
          className="border-0"
        />
      </SheetContent>
    </Sheet>
  ) : null;

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <header className="app-header-surface relative flex shrink-0 items-start justify-between gap-3 px-5 py-4 lg:px-8 after:pointer-events-none after:absolute after:inset-x-8 after:bottom-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-primary after:to-transparent after:opacity-55">
        <div className="min-w-0">
          <p className="gold-label">Grup Strateji Workspace</p>
          <h1 className="font-heading truncate text-xl font-semibold lg:text-[1.375rem]">
            {selectedCompany.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Oturum: {getUserLabel(currentUserId)}
          </p>
        </div>

        <WorkspaceToolbar
          company={selectedCompany}
          zones={zones}
          changePassword={changePassword}
          onLogout={onLogout}
          exportDisabled={status !== "ready"}
          extraActions={mobileNavButton}
        />
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {showCompanyPicker ? (
          <div className="hidden h-full min-h-0 w-[320px] shrink-0 overflow-hidden lg:block">
            <CompanySidebar
              companies={accessibleCompanies}
              selectedId={selectedCompanyId}
              onSelect={handleSelectCompany}
            />
          </div>
        ) : null}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-7">
            <div className="mb-6 hidden lg:block">
              <p className="gold-label">Strateji workspace</p>
              <h2 className="font-heading text-[1.75rem] font-semibold tracking-tight">
                {selectedCompany.name}
              </h2>
              <p className="mt-2 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
                Notlar kullanıcıya göre etiketlenir; yalnızca kendi notlarınızı
                silebilirsiniz. Veriler tarayıcıda saklanır.
              </p>
            </div>

            <StrategyCanvas
              company={selectedCompany}
              zones={zones}
              currentUserId={currentUserId}
              status={status}
              onAddZoneNote={addZoneNote}
              onRemoveZoneNote={removeZoneNote}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
