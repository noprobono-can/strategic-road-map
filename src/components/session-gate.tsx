"use client";

import { FormEvent, useMemo, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useSessionGate } from "@/hooks/use-session-gate";
import { WorkspaceUserId } from "@/lib/gate-config";
import {
  MIN_PASSWORD_LENGTH,
  validatePasswordStrength,
} from "@/lib/password-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";

interface SessionGateProps {
  children: (context: {
    currentUserId: NonNullable<ReturnType<typeof useSessionGate>["currentUserId"]>;
    changePassword: ReturnType<typeof useSessionGate>["changePassword"];
    logout: ReturnType<typeof useSessionGate>["lock"];
  }) => React.ReactNode;
}

type AuthStep = "username" | "login" | "setup";

export function SessionGate({ children }: SessionGateProps) {
  const {
    status,
    currentUserId,
    login,
    setupPassword,
    changePassword,
    hasStoredPassword,
    resolveUsername,
    lock,
  } = useSessionGate();

  const [step, setStep] = useState<AuthStep>("username");
  const [resolvedUserId, setResolvedUserId] = useState<WorkspaceUserId | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSetup = step === "setup";

  const title = useMemo(() => {
    if (step === "setup") {
      return "Şifre oluştur";
    }

    if (step === "login") {
      return "Giriş";
    }

    return "Giriş";
  }, [step]);

  const resetPasswordFields = () => {
    setPassword("");
    setConfirmPassword("");
  };

  const handleUsernameContinue = () => {
    const userId = resolveUsername(username);
    if (!userId) {
      setError("Bu kullanıcı adı tanınmıyor. Yalnızca kayıtlı hesaplar giriş yapabilir.");
      setResolvedUserId(null);
      return;
    }

    setResolvedUserId(userId);
    resetPasswordFields();
    setError(null);
    setStep(hasStoredPassword(userId) ? "login" : "setup");
  };

  const handleBackToUsername = () => {
    setStep("username");
    setResolvedUserId(null);
    resetPasswordFields();
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (step === "username") {
      handleUsernameContinue();
      return;
    }

    const userId = resolvedUserId ?? resolveUsername(username);
    if (!userId) {
      setError("Bu kullanıcı adı tanınmıyor. Yalnızca kayıtlı hesaplar giriş yapabilir.");
      setStep("username");
      return;
    }

    const strengthError = validatePasswordStrength(password);
    if (strengthError) {
      setError(strengthError);
      return;
    }

    if (step === "setup") {
      if (password !== confirmPassword) {
        setError("Şifreler eşleşmiyor. Lütfen tekrar deneyin.");
        return;
      }

      setIsSubmitting(true);
      const success = await setupPassword(username, password);
      setIsSubmitting(false);

      if (!success) {
        setError("Şifre oluşturulamadı. Lütfen tekrar deneyin.");
      }

      return;
    }

    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);

    if (!success) {
      setError("Kullanıcı adı veya şifre hatalı. Lütfen tekrar deneyin.");
    }
  };

  if (status === "loading") {
    return (
      <div className="relative min-h-screen">
        <div className="absolute top-5 right-5 z-10">
          <ThemeToggle />
        </div>
        <div className="flex min-h-screen items-center justify-center px-6 py-8">
          <Card className="w-full max-w-md rounded-[18px]">
            <CardHeader className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-11 w-full rounded-[10px]" />
              <Skeleton className="h-11 w-full rounded-[10px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (status === "unlocked" && currentUserId) {
    return (
      <div className="h-dvh overflow-hidden">
        {children({ currentUserId, changePassword, logout: lock })}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-5 right-5 z-10">
        <ThemeToggle />
      </div>
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(700px_320px_at_50%_0%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_55%)] px-6 py-8">
        <Card className="w-full max-w-md rounded-[18px]">
          <CardHeader className="gap-4">
            <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-accent text-accent-foreground">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <p className="gold-label">Grup Strateji Workspace</p>
              <CardTitle className="font-heading text-[1.375rem] font-semibold leading-tight">
                {title}
              </CardTitle>
            </div>
            <CardDescription className="text-[0.95rem] leading-relaxed">
            {step === "setup"
              ? "İlk girişiniz için kendi şifrenizi belirleyin. Şifre yalnızca bu tarayıcıda güvenli biçimde saklanır."
              : step === "login"
                ? "Devam etmek için kullanıcı adınızı ve şifrenizi girin. Başarılı giriş bu oturum boyunca hatırlanır."
                : "Devam etmek için kullanıcı adınızı girin. İlk girişte kendi şifrenizi oluşturursunuz."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium text-muted-foreground"
              >
                Kullanıcı adı
              </label>
              <input
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                readOnly={step !== "username"}
                disabled={isSubmitting}
                onChange={(event) => {
                  setUsername(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                className="sim-input disabled:opacity-70"
                placeholder="Kullanıcı adınız"
              />
            </div>

            {step !== "username" ? (
              <>
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-muted-foreground"
                  >
                    {isSetup ? "Yeni şifre" : "Şifre"}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete={isSetup ? "new-password" : "current-password"}
                    value={password}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    className="sim-input disabled:opacity-50"
                    placeholder={isSetup ? "En az 8 karakter" : "Şifreniz"}
                  />
                </div>

                {isSetup ? (
                  <div className="space-y-2">
                    <label
                      htmlFor="confirm-password"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Şifre tekrar
                    </label>
                    <input
                      id="confirm-password"
                      name="confirmPassword"
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
                      className="sim-input disabled:opacity-50"
                      placeholder="Şifrenizi tekrar yazın"
                    />
                    <p className="text-sm text-muted-foreground">
                      En az {MIN_PASSWORD_LENGTH} karakter kullanın.
                    </p>
                  </div>
                ) : null}
              </>
            ) : null}

            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-base text-destructive"
              >
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {step === "username"
                  ? "Devam et"
                  : isSetup
                    ? "Şifre oluştur"
                    : "Giriş yap"}
              </Button>

              {step !== "username" ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  disabled={isSubmitting}
                  onClick={handleBackToUsername}
                >
                  Kullanıcı adını değiştir
                </Button>
              ) : null}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Bu yalnızca tarayıcı tarafında basit bir kilit mekanizmasıdır;
              gerçek kimlik doğrulama değildir.
            </p>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
