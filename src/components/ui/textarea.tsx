import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "focus-ring min-h-32 w-full rounded-2xl border bg-white/58 px-4 py-3 text-sm shadow-inner transition placeholder:text-muted-foreground/70 dark:bg-white/6",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
