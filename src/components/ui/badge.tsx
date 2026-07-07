import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border bg-white/50 px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm dark:bg-white/8",
        className
      )}
      {...props}
    />
  );
}
