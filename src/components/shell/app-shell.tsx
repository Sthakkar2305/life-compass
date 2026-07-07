"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckSquare,
  Flame,
  Home,
  ListTodo,
  PenLine,
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OfflineStatus } from "@/components/shell/offline-status";
import { InstallPrompt } from "@/components/shell/install-prompt";

const routes = [
  { href: "/", label: "Home", icon: Home },
  { href: "/diary", label: "Diary", icon: PenLine },
  { href: "/habits", label: "Habits", icon: Flame },
  { href: "/negative-points", label: "Growth", icon: Sparkles },
  { href: "/motivation", label: "Motivation", icon: BookOpen },
  { href: "/todo", label: "Todo", icon: CheckSquare },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {!isHome ? (
        <aside className="fixed left-4 top-4 z-40 hidden h-[calc(100vh-2rem)] w-20 flex-col items-center justify-between rounded-[1.8rem] border bg-white/48 py-4 shadow-glass backdrop-blur-2xl dark:bg-slate-950/50 lg:flex">
          <Link href="/" className="grid size-12 place-items-center rounded-2xl leather-texture text-white shadow-leather focus-ring">
            <ListTodo className="size-5" aria-hidden />
            <span className="sr-only">Life Changer Book</span>
          </Link>
          <nav className="flex flex-col gap-2">
            {routes.slice(1).map((route) => {
              const active = pathname === route.href;
              const Icon = route.icon;
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  aria-label={route.label}
                  title={route.label}
                  className={cn(
                    "focus-ring grid size-12 place-items-center rounded-2xl transition",
                    active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </Link>
              );
            })}
          </nav>
          <OfflineStatus compact />
        </aside>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className={cn(!isHome && "lg:pl-28")}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!isHome ? (
        <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-6 rounded-[1.45rem] border bg-white/58 p-2 shadow-glass backdrop-blur-2xl dark:bg-slate-950/65 lg:hidden">
          {routes.slice(1).map((route) => {
            const active = pathname === route.href;
            const Icon = route.icon;
            return (
              <Link
                key={route.href}
                href={route.href}
                aria-label={route.label}
                className={cn(
                  "focus-ring grid h-12 place-items-center rounded-2xl transition",
                  active ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                )}
              >
                <Icon className="size-5" aria-hidden />
              </Link>
            );
          })}
        </nav>
      ) : null}
      <InstallPrompt />
    </>
  );
}
