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
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-accent text-accent-foreground">
            <Building2 className="size-5" />
          </div>
          <div>
            <p className="gold-label">Grup</p>
            <h2 className="font-heading text-base font-semibold leading-tight">
              Strateji Workspace
            </h2>
          </div>
        </div>
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-4">
        <nav aria-label="Grup şirketleri" className="space-y-2">
          {companies.map((company, index) => {
            const isSelected = company.id === selectedId;

            return (
              <button
                key={company.id}
                type="button"
                onClick={() => onSelect(company.id)}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-3.5 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-accent text-accent-foreground shadow-[inset_0_1px_0_var(--primary)]"
                    : "border-border bg-secondary/70 hover:border-primary/70 hover:bg-accent/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[0.95rem] font-semibold leading-snug">
                    {company.name}
                  </span>
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className="shrink-0 px-2 text-[11px] uppercase tracking-[0.12em]"
                  >
                    {index + 1}
                  </Badge>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
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
