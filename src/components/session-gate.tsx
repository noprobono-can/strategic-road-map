"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { isAccessCodeValid } from "@/lib/gate-config";
import { useSessionGate } from "@/hooks/use-session-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionGateProps {
  children: React.ReactNode;
}

export function SessionGate({ children }: SessionGateProps) {
  const { status, unlock } = useSessionGate();
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAccessCodeValid(code)) {
      setError(null);
      unlock();
      return;
    }

    setError("Erişim kodu hatalı. Lütfen tekrar deneyin.");
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "unlocked") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background px-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg">
        <CardHeader className="gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <LockKeyhole className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Grup Strateji Tuvali
            </p>
            <CardTitle className="text-2xl">Giriş</CardTitle>
          </div>
          <CardDescription className="leading-relaxed">
            Devam etmek için erişim kodunu girin. Başarılı giriş bu oturum
            boyunca hatırlanır; sayfa yenilense bile açık kalır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="access-code"
                className="text-sm font-medium leading-none"
              >
                Erişim kodu
              </label>
              <input
                id="access-code"
                name="access-code"
                type="password"
                autoComplete="off"
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                placeholder="Erişim kodunuzu yazın"
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

            <Button type="submit" className="w-full">
              Devam et
            </Button>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Bu yalnızca tarayıcı tarafında basit bir kilit mekanizmasıdır;
              gerçek kimlik doğrulama değildir.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
