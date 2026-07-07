import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ModuleFrameProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
};

export function ModuleFrame({ eyebrow, title, subtitle, icon: Icon, tone, children, actions }: ModuleFrameProps) {
  return (
    <main className="min-h-screen px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-8">
      <section className="mx-auto max-w-7xl">
        <header
          className={cn(
            "mb-6 overflow-hidden rounded-[1.8rem] border p-5 shadow-glass sm:p-7",
            tone ?? "glass-panel"
          )}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-start gap-4">
              <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                <Icon className="size-7" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">{eyebrow}</p>
                <h1 className="mt-1 font-display text-4xl leading-none sm:text-6xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>
              </div>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
