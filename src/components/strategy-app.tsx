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
import { ChangePasswordSheet } from "@/components/change-password-sheet";
import { CompanySidebar } from "@/components/company-sidebar";
import { StrategyCanvas } from "@/components/strategy-canvas";
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
}

export function StrategyApp({ currentUserId, changePassword }: StrategyAppProps) {
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

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Grup Strateji Workspace
          </p>
          <h1 className="text-sm font-semibold">{selectedCompany.name}</h1>
          <p className="text-xs text-muted-foreground">
            Oturum: {getUserLabel(currentUserId)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ChangePasswordSheet changePassword={changePassword} />
          {showCompanyPicker ? (
            <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
              <SheetTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Şirket listesini aç"
                  />
                }
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[min(100vw-2rem,320px)] p-0">
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
          ) : null}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {showCompanyPicker ? (
          <div className="hidden h-full min-h-0 w-[320px] shrink-0 lg:block">
            <CompanySidebar
              companies={accessibleCompanies}
              selectedId={selectedCompanyId}
              onSelect={handleSelectCompany}
            />
          </div>
        ) : null}

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-6">
            <div className="mb-5 hidden lg:block">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Strateji workspace
                  </p>
                  <h1 className="text-xl font-semibold tracking-tight">
                    {selectedCompany.name}
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Alanları birlikte dolduracağız. Notlar kullanıcıya göre
                    etiketlenir; yalnızca kendi notlarınızı silebilirsiniz. Veriler
                    tarayıcıda saklanır.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Oturum: {getUserLabel(currentUserId)}
                  </p>
                </div>
                <ChangePasswordSheet changePassword={changePassword} />
              </div>
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
