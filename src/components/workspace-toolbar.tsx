"use client";

import { useState } from "react";
import { FileDown, LogOut } from "lucide-react";
import { Company } from "@/lib/companies";
import { ZoneNotes } from "@/lib/canvas-types";
import { useSessionGate } from "@/hooks/use-session-gate";
import { downloadWorkspacePdfReport } from "@/lib/workspace-pdf-report";
import { ChangePasswordSheet } from "@/components/change-password-sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

interface WorkspaceToolbarProps {
  company: Company;
  zones: ZoneNotes;
  changePassword: ReturnType<typeof useSessionGate>["changePassword"];
  onLogout: () => void;
  exportDisabled?: boolean;
  extraActions?: React.ReactNode;
}

export function WorkspaceToolbar({
  company,
  zones,
  changePassword,
  onLogout,
  exportDisabled,
  extraActions,
}: WorkspaceToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExportPdf = async () => {
    setExportError(null);
    setIsExporting(true);

    try {
      await downloadWorkspacePdfReport(company, zones);
    } catch {
      setExportError("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {extraActions}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={exportDisabled || isExporting}
          onClick={handleExportPdf}
        >
          <FileDown className="size-4" />
          {isExporting ? "PDF hazırlanıyor…" : "Rapor · PDF indir"}
        </Button>
        <ChangePasswordSheet changePassword={changePassword} />
        <ThemeToggle />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onLogout}
        >
          <LogOut className="size-4" />
          Çıkış
        </Button>
      </div>
      {exportError ? (
        <p role="alert" className="max-w-xs text-right text-sm text-destructive">
          {exportError}
        </p>
      ) : null}
    </div>
  );
}
