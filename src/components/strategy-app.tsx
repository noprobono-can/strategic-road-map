"use client";

import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { COMPANIES, DEFAULT_COMPANY_ID } from "@/lib/companies";
import { useCanvasStorage } from "@/hooks/use-canvas-storage";
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

export function StrategyApp() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(DEFAULT_COMPANY_ID);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { status, fields, notes, updateField, addNote, removeNote } =
    useCanvasStorage(selectedCompanyId);

  const selectedCompany = useMemo(
    () =>
      COMPANIES.find((company) => company.id === selectedCompanyId) ??
      COMPANIES[0],
    [selectedCompanyId],
  );

  const handleSelectCompany = (companyId: string) => {
    setSelectedCompanyId(companyId);
    setMobileNavOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Grup Strateji Workspace
          </p>
          <h1 className="text-sm font-semibold">{selectedCompany.name}</h1>
        </div>
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
              companies={COMPANIES}
              selectedId={selectedCompanyId}
              onSelect={handleSelectCompany}
              className="border-0"
            />
          </SheetContent>
        </Sheet>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="hidden h-full min-h-0 w-[320px] shrink-0 lg:block">
          <CompanySidebar
            companies={COMPANIES}
            selectedId={selectedCompanyId}
            onSelect={handleSelectCompany}
          />
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-6">
            <div className="mb-5 hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Strateji workspace
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                {selectedCompany.name}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Alanları birlikte dolduracağız. Yazdıklarınız tarayıcıda
                saklanır; sayfa yenilense bile kalır.
              </p>
            </div>

            <StrategyCanvas
              company={selectedCompany}
              fields={fields}
              notes={notes}
              status={status}
              onFieldChange={updateField}
              onAddNote={addNote}
              onRemoveNote={removeNote}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
