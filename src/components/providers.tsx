"use client";

import { useEffect } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { AppShell } from "@/components/shell/app-shell";
import { useLifeStore } from "@/stores/life-store";
import { hexToHsl } from "@/lib/utils";

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useLifeStore((state) => state.hydrate);
  const settings = useLifeStore((state) => state.settings);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = settings.themeMode === "dark" || (settings.themeMode === "system" && prefersDark);
    root.classList.toggle("dark", dark);
    root.dataset.font = settings.font;
    root.style.setProperty("--primary", hexToHsl(settings.themeColor));
    const meta = document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute("content", dark ? "#111827" : settings.themeColor);
  }, [settings.font, settings.themeColor, settings.themeMode]);

  return (
    <Tooltip.Provider delayDuration={250}>
      <AppShell>{children}</AppShell>
    </Tooltip.Provider>
  );
}
