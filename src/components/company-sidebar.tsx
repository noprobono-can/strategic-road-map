"use client";

import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Company } from "@/lib/companies";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface CompanySidebarProps {
  companies: Company[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function CompanySidebar({
  companies,
  selectedId,
  onSelect,
  className,
}: CompanySidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-border bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Building2 className="size-4 text-sidebar-primary" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Grup
            </p>
            <h2 className="text-sm font-semibold leading-tight">
              Strateji Workspace
            </h2>
          </div>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Şirket seçin; sağdaki workspace'te stratejik alanları birlikte
          dolduracağız.
        </p>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-2 py-3">
        <nav aria-label="Grup şirketleri" className="space-y-1">
          {companies.map((company, index) => {
            const isSelected = company.id === selectedId;

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => onSelect(company.id)}
                className={cn(
                  "w-full rounded-lg border px-3 py-3 text-left transition-colors",
                  isSelected
                    ? "border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "border-transparent hover:border-sidebar-border hover:bg-sidebar-accent/60",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-snug">
                    {company.name}
                  </span>
                  <Badge
                    variant={isSelected ? "default" : "secondary"}
                    className="shrink-0 text-[10px]"
                  >
                    {index + 1}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                  {company.role}
                </p>
              </button>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
