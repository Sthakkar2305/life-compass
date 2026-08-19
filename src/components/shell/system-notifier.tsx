"use client";

import { useEffect, useRef } from "react";
import { useLifeStore } from "@/stores/life-store";
import { todayKey } from "@/lib/date";
import { getDailyMotivation } from "@/lib/motivation";

export function SystemNotifier() {
  const tasks = useLifeStore((state) => state.tasks);
  const habits = useLifeStore((state) => state.habits);
  const settings = useLifeStore((state) => state.settings);
  const hydrated = useLifeStore((state) => state.hydrated);
  
  const lastTypeRef = useRef<"todo" | "habit" | "motivation">("motivation");

  useEffect(() => {
    if (!hydrated) return;

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      if (Notification.permission !== "granted") return;

      const today = todayKey();
      const incompleteTasks = tasks.filter((t) => !t.completed && t.dueDate <= today);
      const incompleteHabits = habits.filter((h) => !h.archived && !h.completions[today]);

      let nextType = lastTypeRef.current;
      if (lastTypeRef.current === "motivation") nextType = "todo";
      else if (lastTypeRef.current === "todo") nextType = "habit";
      else nextType = "motivation";

      if (nextType === "todo" && incompleteTasks.length === 0) nextType = "habit";
      if (nextType === "habit" && incompleteHabits.length === 0) nextType = "motivation";

      lastTypeRef.current = nextType;

      let title = "";
      let body = "";

      if (nextType === "todo") {
        title = "Tasks waiting";
        body = `You have ${incompleteTasks.length} incomplete task(s) scheduled for today.`;
      } else if (nextType === "habit") {
        title = "Daily Habits";
        body = `Don't forget to complete your habits! You have ${incompleteHabits.length} remaining today.`;
      } else {
        const quote = getDailyMotivation(settings.language, "Daily Quote", today);
        title = "Daily Motivation";
        body = quote.body;
      }

      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.showNotification(title, {
            body,
            icon: "/icons/icon-192x192.png",
            badge: "/icons/icon-192x192.png",
            vibrate: [200, 100, 200]
          });
        } else {
          new Notification(title, { body, icon: "/icons/icon-192x192.png" });
        }
      });
    }, 180000); // 3 minutes

    return () => clearInterval(interval);
  }, [hydrated, tasks, habits, settings.language]);

  return null;
}
