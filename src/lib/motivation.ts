import type { Language } from "@/types/life";
import { hashString } from "@/lib/utils";
import { english } from "./motivation-en";
import { hindi } from "./motivation-hi";
import { gujarati } from "./motivation-gu";

export type MotivationTab =
  | "Daily Quote"
  | "Success Story"
  | "Premanand Maharaj Thoughts"
  | "Bhagavad Gita Verse"
  | "Today's Challenge"
  | "Positive Affirmation"
  | "Daily Mission"
  | "Visualization Exercise"
  | "Morning Motivation"
  | "Night Reflection";

export const motivationTabs: MotivationTab[] = [
  "Daily Quote",
  "Success Story",
  "Premanand Maharaj Thoughts",
  "Bhagavad Gita Verse",
  "Today's Challenge",
  "Positive Affirmation",
  "Daily Mission",
  "Visualization Exercise",
  "Morning Motivation",
  "Night Reflection"
];

type MotivationItem = {
  title: string;
  body: string;
};

const content: Record<Language, Record<MotivationTab, MotivationItem[]>> = {
  english,
  hindi,
  gujarati
};

export function getDailyMotivation(language: Language, tab: MotivationTab, dateKey: string) {
  const pool = content[language][tab];
  const index = hashString(`${language}:${tab}:${dateKey}`) % pool.length;
  return pool[index];
}

export function dailyBackground(dateKey: string) {
  const gradients = [
    "from-blue-500/24 via-amber-300/20 to-white/50 dark:from-blue-500/18 dark:via-amber-400/10 dark:to-slate-950/60",
    "from-emerald-400/20 via-white/40 to-amber-300/25 dark:from-emerald-500/14 dark:via-slate-900/40 dark:to-amber-500/10",
    "from-rose-300/22 via-orange-200/28 to-blue-200/20 dark:from-rose-500/12 dark:via-orange-400/10 dark:to-blue-500/12",
    "from-violet-300/24 via-white/40 to-sky-200/25 dark:from-violet-500/14 dark:via-slate-950/50 dark:to-sky-500/12"
  ];
  return gradients[hashString(dateKey) % gradients.length];
}
