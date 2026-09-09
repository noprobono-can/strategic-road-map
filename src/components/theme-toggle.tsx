"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center rounded-lg border bg-background p-0.5 ${className ?? ""}`}
      role="group"
      aria-label="Tema seçimi"
    >
      <Button
        type="button"
        size="sm"
        variant={theme === "light" ? "secondary" : "ghost"}
        className="h-9 gap-1.5 px-3 text-sm"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
        Açık tema
      </Button>
      <Button
        type="button"
        size="sm"
        variant={theme === "dark" ? "secondary" : "ghost"}
        className="h-9 gap-1.5 px-3 text-sm"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />
        Koyu tema
      </Button>
    </div>
  );
}
