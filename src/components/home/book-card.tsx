"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BookCardProps = {
  title: string;
  href: string;
  icon: LucideIcon;
  gradient: string;
  accent: string;
  index: number;
};

export function BookCard({ title, href, icon: Icon, gradient, accent, index }: BookCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 18 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.55, ease: "easeOut" }}
      whileHover={{ y: -10, rotate: index % 2 === 0 ? -1.2 : 1.2 }}
      whileTap={{ scale: 0.97 }}
      className="perspective-1000"
    >
      <Link
        href={href}
        className={cn(
          "book-spine focus-ring group relative flex min-h-[224px] flex-col justify-between overflow-hidden rounded-book border border-white/35 p-5 text-white shadow-leather transition",
          gradient
        )}
      >
        <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(255,255,255,.22),transparent_36%,rgba(255,255,255,.08)_61%,transparent)] opacity-80" />
        <motion.div
          className="absolute -right-8 -top-10 size-32 rounded-full bg-white/18 blur-2xl"
          animate={{ scale: [1, 1.18, 1], opacity: [0.28, 0.5, 0.28] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-start justify-between">
          <div className="grid size-14 place-items-center rounded-2xl bg-white/18 shadow-inner backdrop-blur">
            <Icon className="size-7" aria-hidden />
          </div>
          <div className={cn("h-16 w-2 rounded-full", accent)} />
        </div>
        <div className="relative">
          <div className="mb-5 h-px w-full bg-white/22" />
          <h2 className="font-display text-4xl leading-none">{title}</h2>
        </div>
        <motion.span
          className="absolute inset-y-3 left-8 w-px bg-white/20"
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity }}
        />
      </Link>
    </motion.div>
  );
}
