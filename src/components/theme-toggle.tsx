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
      className={`inline-flex items-center gap-0 rounded-full border border-border bg-card p-1 ${className ?? ""}`}
      role="group"
      aria-label="Tema seçimi"
    >
      <Button
        type="button"
        size="sm"
        variant={theme === "light" ? "default" : "ghost"}
        className="h-8 rounded-full px-3.5 text-sm"
        aria-pressed={theme === "light"}
        onClick={() => setTheme("light")}
      >
        <Sun className="size-4" />
        Açık tema
      </Button>
      <Button
        type="button"
        size="sm"
        variant={theme === "dark" ? "default" : "ghost"}
        className="h-8 rounded-full px-3.5 text-sm"
        aria-pressed={theme === "dark"}
        onClick={() => setTheme("dark")}
      >
        <Moon className="size-4" />
        Koyu tema
      </Button>
    </div>
  );
}
