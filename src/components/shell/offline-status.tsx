"use client";

import { Wifi, WifiOff } from "lucide-react";
import { useOfflineStatus } from "@/hooks/use-offline-status";
import { cn } from "@/lib/utils";

export function OfflineStatus({ compact = false }: { compact?: boolean }) {
  const { online } = useOfflineStatus();
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold shadow-sm",
        online
          ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
          : "bg-amber-500/16 text-amber-800 dark:text-amber-200"
      )}
      aria-live="polite"
    >
      {online ? <Wifi className="size-4" aria-hidden /> : <WifiOff className="size-4" aria-hidden />}
      {compact ? null : <span>{online ? "Online" : "Offline ready"}</span>}
    </div>
  );
}
