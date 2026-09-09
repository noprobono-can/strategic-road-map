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
  const { status, fields, updateField } = useCanvasStorage(selectedCompanyId);

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
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b px-4 py-3 lg:hidden">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Grup Strateji Tuvali
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
                Strateji tuvali için bir grup şirketi seçin.
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

      <div className="flex min-h-0 flex-1">
        <div className="hidden w-[320px] shrink-0 lg:block">
          <CompanySidebar
            companies={COMPANIES}
            selectedId={selectedCompanyId}
            onSelect={handleSelectCompany}
          />
        </div>

        <main className="min-w-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-5 lg:px-6 lg:py-6">
            <div className="mb-5 hidden lg:block">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Strateji tuvali
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
              status={status}
              onFieldChange={updateField}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
