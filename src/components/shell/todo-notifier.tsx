"use client";

import { useEffect, useState } from "react";
import { ListTodo, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLifeStore } from "@/stores/life-store";
import { todayKey } from "@/lib/date";

export function TodoNotifier() {
  const tasks = useLifeStore((state) => state.tasks);
  const hydrated = useLifeStore((state) => state.hydrated);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!hydrated) return;

    // Check every 5 minutes (300000 ms)
    const interval = setInterval(() => {
      const today = todayKey();
      const incomplete = tasks.filter((t) => !t.completed && t.dueDate <= today);
      if (incomplete.length > 0) {
        setShow(true);
        // Auto-hide after 15 seconds
        setTimeout(() => setShow(false), 15000);
      }
    }, 300000);

    return () => clearInterval(interval);
  }, [hydrated, tasks]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className="fixed left-1/2 top-4 z-50 flex w-[calc(100%-2rem)] max-w-sm items-start gap-3 rounded-[1.4rem] border bg-white/90 p-4 shadow-glass backdrop-blur dark:bg-slate-900/90"
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <ListTodo className="size-5" aria-hidden />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold leading-none">Tasks waiting</h3>
            <p className="mt-2 text-sm text-muted-foreground">You have incomplete tasks scheduled for today. Don't forget to complete them!</p>
          </div>
          <button onClick={() => setShow(false)} className="rounded-md p-1 opacity-60 hover:bg-muted hover:opacity-100" aria-label="Close">
            <X className="size-4" aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
