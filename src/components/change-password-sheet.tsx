"use client";

import { FormEvent, useState } from "react";
import { KeyRound } from "lucide-react";
import { useSessionGate } from "@/hooks/use-session-gate";
import { validatePasswordStrength } from "@/lib/password-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ChangePasswordSheetProps {
  changePassword: ReturnType<typeof useSessionGate>["changePassword"];
}

export function ChangePasswordSheet({ changePassword }: ChangePasswordSheetProps) {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(null);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const strengthError = validatePasswordStrength(newPassword);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor. Lütfen tekrar deneyin.");
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsSubmitting(false);

    if (result === "invalid-current") {
      setError("Mevcut şifre hatalı. Lütfen tekrar deneyin.");
      return;
    }

    if (result === "not-logged-in") {
      setError("Oturum bulunamadı. Lütfen yeniden giriş yapın.");
      return;
    }

    resetForm();
    setSuccess("Şifreniz güncellendi.");
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5">
            <KeyRound className="size-4" />
            Şifre değiştir
          </Button>
        }
      />
      <SheetContent side="right" className="w-[min(100vw-2rem,420px)]">
        <SheetHeader>
          <SheetTitle>Şifre değiştir</SheetTitle>
          <SheetDescription>
            Yeni şifreniz yalnızca bu tarayıcıda güvenli biçimde saklanır.
          </SheetDescription>
        </SheetHeader>

        <form className="flex flex-1 flex-col gap-4 px-4 pb-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium">
              Mevcut şifre
            </label>
            <input
              id="current-password"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              disabled={isSubmitting}
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium">
              Yeni şifre
            </label>
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={newPassword}
              disabled={isSubmitting}
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-new-password" className="text-sm font-medium">
              Yeni şifre tekrar
            </label>
            <input
              id="confirm-new-password"
              name="confirmNewPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              disabled={isSubmitting}
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (error) {
                  setError(null);
                }
              }}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          {error ? (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          ) : null}

          {success ? (
            <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-foreground">
              {success}
            </p>
          ) : null}

          <Button type="submit" disabled={isSubmitting}>
            Şifreyi güncelle
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
