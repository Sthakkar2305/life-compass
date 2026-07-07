"use client";

import { BookOpen, CheckSquare, Flame, PenLine, Sparkles, Mic, Edit2 } from "lucide-react";
import { AmbientParticles } from "@/components/home/ambient-particles";
import { BookCard } from "@/components/home/book-card";
import { OfflineStatus } from "@/components/shell/offline-status";

const cards = [
  {
    title: "Diary",
    href: "/diary",
    icon: PenLine,
    gradient: "bg-[linear-gradient(135deg,#6b2f1a,#1f1210_58%,#111827)]",
    accent: "bg-amber-300"
  },
  {
    title: "Habit Tracker",
    href: "/habits",
    icon: Flame,
    gradient: "bg-[linear-gradient(135deg,#16a34a,#2563eb)]",
    accent: "bg-emerald-200"
  },
  {
    title: "Negative Points",
    href: "/negative-points",
    icon: Sparkles,
    gradient: "bg-[linear-gradient(135deg,#f59e0b,#1e3a8a)]",
    accent: "bg-white"
  },
  {
    title: "Motivation",
    href: "/motivation",
    icon: BookOpen,
    gradient: "bg-[linear-gradient(135deg,#7c3aed,#ec4899,#f59e0b)]",
    accent: "bg-sky-100"
  },
  {
    title: "Todo List",
    href: "/todo",
    icon: CheckSquare,
    gradient: "bg-[linear-gradient(135deg,#0f766e,#2563eb,#111827)]",
    accent: "bg-lime-200"
  },
  {
    title: "Naam Jap",
    href: "/naam-jap",
    icon: Mic,
    gradient: "bg-[linear-gradient(135deg,#db2777,#4f46e5,#0f172a)]",
    accent: "bg-pink-300"
  },
  {
    title: "Name Write",
    href: "/name-write",
    icon: Edit2,
    gradient: "bg-[linear-gradient(135deg,#047857,#0ea5e9,#1e3a8a)]",
    accent: "bg-teal-200"
  }
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-10">
      <AmbientParticles />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl leather-texture text-white shadow-leather">
              <BookOpen className="size-6" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-muted-foreground">Offline Companion</p>
              <h1 className="font-display text-3xl leading-none sm:text-4xl">Life Changer Book</h1>
            </div>
          </div>
          <OfflineStatus />
        </header>

        <section className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[0.9fr_1.4fr]">
          <div className="max-w-xl">
            <div className="relative mb-8 aspect-[4/5] max-w-[340px] rounded-[2rem] border border-white/30 leather-texture p-7 text-white shadow-leather">
              <div className="absolute inset-y-7 left-10 w-px bg-white/20" />
              <div className="absolute right-6 top-6 rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em]">
                Premium
              </div>
              <div className="relative flex h-full flex-col justify-end">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-amber-200">Open When Stuck</p>
                <h2 className="font-display text-6xl leading-[0.9]">Life Changer Book</h2>
                <p className="mt-5 max-w-[15rem] text-sm leading-6 text-white/78">
                  When you are stuck in life, open this book.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((card, index) => (
              <BookCard key={card.href} {...card} index={index} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
