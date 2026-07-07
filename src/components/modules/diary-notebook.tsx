"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Heart,
  Lock,
  Mic,
  Music2,
  Plus,
  Save,
  Search,
  SquarePen,
  Type,
  Unlock
} from "lucide-react";
import { WritingCanvas } from "@/components/canvas/writing-canvas";
import { ModuleFrame } from "@/components/modules/module-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAmbientSound, type AmbientSound } from "@/hooks/use-ambient-sound";
import { useClock } from "@/hooks/use-clock";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { IST_TIMEZONE, monthLabel, todayKey } from "@/lib/date";
import { hashPin, isValidPin } from "@/lib/security";
import { cn } from "@/lib/utils";
import { useLifeStore } from "@/stores/life-store";
import type { DiaryPage, Mood } from "@/types/life";

const moods: { value: Mood; label: string }[] = [
  { value: "happy", label: "😀" },
  { value: "calm", label: "😐" },
  { value: "sad", label: "😢" },
  { value: "angry", label: "😡" },
  { value: "love", label: "😍" },
  { value: "tired", label: "😴" }
];

const sounds: { value: AmbientSound; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "rain", label: "Rain" },
  { value: "forest", label: "Forest" },
  { value: "library", label: "Library" },
  { value: "temple", label: "Temple bells" },
  { value: "ocean", label: "Ocean" },
  { value: "soft-piano", label: "Soft piano" }
];

function groupPages(pages: DiaryPage[]) {
  return pages.reduce<Record<string, DiaryPage[]>>((groups, page) => {
    const key = page.dateKey.slice(0, 7);
    groups[key] = groups[key] ? [...groups[key], page] : [page];
    return groups;
  }, {});
}

export function DiaryNotebook() {
  const {
    hydrated,
    diaryPages,
    settings,
    addDiaryPage,
    updateDiaryPage,
    deleteDiaryPage,
    updateSettings
  } = useLifeStore();
  const clock = useClock(IST_TIMEZONE);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [mode, setMode] = useState<"typing" | "handwriting">("typing");
  const [fullscreen, setFullscreen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinCreate, setPinCreate] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinSetup, setPinSetup] = useState(false);
  const ambient = useAmbientSound();

  const appendSpeech = useCallback((text: string) => {
    setDraftContent((value) => `${value}${text}`);
  }, []);

  const speech = useSpeechRecognition(
    appendSpeech,
    settings.language === "hindi" ? "hi-IN" : settings.language === "gujarati" ? "gu-IN" : "en-IN"
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!diaryPages.length) {
      const id = addDiaryPage({ title: `Page for ${todayKey()}`, dateKey: todayKey() });
      setSelectedId(id);
      return;
    }
    if (!selectedId || !diaryPages.some((page) => page.id === selectedId)) setSelectedId(diaryPages[0].id);
  }, [addDiaryPage, diaryPages, hydrated, selectedId]);

  const currentPage = diaryPages.find((page) => page.id === selectedId) ?? diaryPages[0];

  useEffect(() => {
    if (!currentPage) return;
    setDraftTitle(currentPage.title);
    setDraftContent(currentPage.content);
  }, [currentPage?.id]);

  useEffect(() => {
    if (!currentPage) return;
    if (draftTitle === currentPage.title && draftContent === currentPage.content) return;
    const id = window.setTimeout(() => {
      updateDiaryPage(currentPage.id, { title: draftTitle || "Untitled page", content: draftContent });
    }, 650);
    return () => window.clearTimeout(id);
  }, [currentPage, draftContent, draftTitle, updateDiaryPage]);

  const filteredPages = useMemo(() => {
    const value = search.trim().toLowerCase();
    return [...diaryPages]
      .filter((page) =>
        value ? `${page.title} ${page.content} ${page.tags.join(" ")}`.toLowerCase().includes(value) : true
      )
      .sort((a, b) => b.dateKey.localeCompare(a.dateKey) || b.updatedAt.localeCompare(a.updatedAt));
  }, [diaryPages, search]);

  const grouped = useMemo(() => groupPages(filteredPages), [filteredPages]);

  const openDate = (dateKeyValue: string) => {
    const existing = diaryPages.find((page) => page.dateKey === dateKeyValue);
    if (existing) setSelectedId(existing.id);
    else setSelectedId(addDiaryPage({ title: `Page for ${dateKeyValue}`, dateKey: dateKeyValue }));
  };

  const navigateRelative = (offset: number) => {
    if (!currentPage) return;
    const sorted = [...diaryPages].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    const index = sorted.findIndex((page) => page.id === currentPage.id);
    const next = sorted[index + offset];
    if (next) setSelectedId(next.id);
  };

  const hasPin = Boolean(settings.diaryPinHash);

  const verifyPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPinError("");
    if (!settings.diaryPinHash) return;
    const hash = await hashPin(pinInput);
    if (hash === settings.diaryPinHash) {
      setUnlocked(true);
      setPinInput("");
    } else {
      setPinError("PIN did not match.");
    }
  };

  const createPin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPinError("");
    if (!isValidPin(pinCreate)) {
      setPinError("Use 4 to 8 digits.");
      return;
    }
    updateSettings({ diaryPinHash: await hashPin(pinCreate) });
    setPinCreate("");
    setPinSetup(false);
    setUnlocked(true);
  };

  if (!hydrated || !currentPage) {
    return (
      <ModuleFrame
        eyebrow="Private pages"
        title="Diary"
        subtitle="Preparing your local notebook."
        icon={SquarePen}
      >
        <div className="paper-texture h-80 animate-pulse rounded-book border shadow-paper" />
      </ModuleFrame>
    );
  }

  if (hasPin && !unlocked) {
    return (
      <ModuleFrame
        eyebrow="Private pages"
        title="Diary locked"
        subtitle="Your diary PIN is stored only on this device."
        icon={Lock}
        tone="leather-texture border-white/20 text-white"
      >
        <form onSubmit={verifyPin} className="mx-auto max-w-md rounded-book border bg-white/70 p-6 shadow-paper backdrop-blur dark:bg-slate-950/70">
          <label className="text-sm font-bold" htmlFor="pin">
            Local PIN
          </label>
          <Input
            id="pin"
            inputMode="numeric"
            type="password"
            value={pinInput}
            onChange={(event) => setPinInput(event.target.value)}
            className="mt-2 text-center text-2xl tracking-[0.55em]"
            autoFocus
          />
          {pinError ? <p className="mt-3 text-sm font-semibold text-destructive">{pinError}</p> : null}
          <Button type="submit" className="mt-5 w-full">
            <Unlock className="size-4" aria-hidden />
            Unlock
          </Button>
        </form>
      </ModuleFrame>
    );
  }

  const pageSurface = (
    <motion.section
      layout
      className={cn(
        "paper-texture relative overflow-hidden rounded-[1.8rem] border p-4 shadow-paper sm:p-6",
        fullscreen && "fixed inset-3 z-50 overflow-auto"
      )}
    >
      <div className="absolute inset-y-0 left-8 hidden w-px bg-blue-500/16 sm:block" />
      <div className="relative flex flex-col gap-4">
        <div className="flex flex-col gap-3 border-b border-dashed pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{clock.date}</Badge>
              <Badge>{clock.time}</Badge>
              <Badge>IST</Badge>
            </div>
            <Input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              className="mt-3 border-0 bg-transparent px-0 font-display text-4xl shadow-none focus-visible:ring-0"
              aria-label="Diary title"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {moods.map((mood) => (
              <Button
                key={mood.value}
                size="iconSm"
                variant={currentPage.mood === mood.value ? "warm" : "secondary"}
                onClick={() => updateDiaryPage(currentPage.id, { mood: mood.value })}
                aria-label={mood.value}
                title={mood.value}
              >
                <span aria-hidden>{mood.label}</span>
              </Button>
            ))}
            <Button
              size="iconSm"
              variant={currentPage.favorite ? "warm" : "secondary"}
              onClick={() => updateDiaryPage(currentPage.id, { favorite: !currentPage.favorite })}
              aria-label="Favorite"
            >
              <Heart className={cn("size-4", currentPage.favorite && "fill-current")} aria-hidden />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant={mode === "typing" ? "default" : "secondary"} onClick={() => setMode("typing")}>
            <Type className="size-4" aria-hidden />
            Typing
          </Button>
          <Button size="sm" variant={mode === "handwriting" ? "default" : "secondary"} onClick={() => setMode("handwriting")}>
            <SquarePen className="size-4" aria-hidden />
            Handwriting
          </Button>
          <Button
            size="sm"
            variant={speech.listening ? "destructive" : "secondary"}
            onClick={speech.listening ? speech.stop : speech.start}
            disabled={!speech.supported}
          >
            <Mic className="size-4" aria-hidden />
            Voice
          </Button>
          <select
            aria-label="Background sound"
            className="h-10 rounded-full border bg-white/58 px-3 text-sm font-semibold shadow-sm dark:bg-white/8"
            value={ambient.active}
            onChange={(event) => {
              const value = event.target.value as AmbientSound;
              updateSettings({ soundsEnabled: value !== "off" });
              ambient.play(value);
            }}
          >
            {sounds.map((sound) => (
              <option key={sound.value} value={sound.value}>
                {sound.label}
              </option>
            ))}
          </select>
          <Button size="iconSm" variant="ghost" onClick={() => ambient.stop()} aria-label="Stop sounds">
            <Music2 className="size-4" aria-hidden />
          </Button>
          <Badge className="ml-auto">
            <Save className="size-3.5" aria-hidden />
            Auto saved
          </Badge>
        </div>

        {mode === "typing" ? (
          <Textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            className="ink-lines min-h-[540px] resize-y border-0 bg-transparent px-2 py-1 font-note text-[1.08rem] leading-8 shadow-none focus-visible:ring-0"
            placeholder="Let the page hold what your mind has been carrying..."
          />
        ) : (
          <WritingCanvas
            value={currentPage.canvasDataUrl}
            onChange={(dataUrl) => updateDiaryPage(currentPage.id, { canvasDataUrl: dataUrl })}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen((value) => !value)}
          />
        )}
      </div>
    </motion.section>
  );

  return (
    <ModuleFrame
      eyebrow="Private pages"
      title="Diary"
      subtitle="A luxury offline notebook for thoughts, reflection, handwriting, voice, mood, and memory."
      icon={SquarePen}
      tone="leather-texture border-white/20 text-white"
      actions={
        <>
          <Button
            variant="secondary"
            onClick={() => setSelectedId(addDiaryPage({ title: `Page for ${todayKey()}`, dateKey: todayKey() }))}
          >
            <Plus className="size-4" aria-hidden />
            Page
          </Button>
          <Button variant="secondary" onClick={() => (hasPin ? setUnlocked(false) : setPinSetup((value) => !value))}>
            <Lock className="size-4" aria-hidden />
            Lock
          </Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="glass-panel rounded-[1.6rem] border p-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search diary" className="pl-10" />
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                type="date"
                defaultValue={currentPage.dateKey}
                onChange={(event) => event.target.value && openDate(event.target.value)}
                aria-label="Open date"
              />
              <Button size="icon" variant="secondary" onClick={() => openDate(todayKey())} aria-label="Today">
                <CalendarDays className="size-4" aria-hidden />
              </Button>
            </div>
          </div>

          {pinSetup ? (
            <form onSubmit={createPin} className="paper-texture rounded-[1.6rem] border p-4 shadow-paper">
              <label className="text-sm font-bold" htmlFor="new-pin">
                New local PIN
              </label>
              <Input
                id="new-pin"
                inputMode="numeric"
                type="password"
                value={pinCreate}
                onChange={(event) => setPinCreate(event.target.value)}
                className="mt-2 text-center tracking-[0.42em]"
              />
              {pinError ? <p className="mt-2 text-sm font-semibold text-destructive">{pinError}</p> : null}
              <Button type="submit" className="mt-3 w-full" size="sm">
                Save PIN
              </Button>
            </form>
          ) : null}

          <div className="max-h-[620px] space-y-4 overflow-auto pr-1 no-scrollbar">
            {Object.entries(grouped).map(([month, pages]) => (
              <div key={month} className="glass-panel rounded-[1.6rem] border p-3">
                <p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
                  {monthLabel(month)}
                </p>
                <div className="space-y-2">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => setSelectedId(page.id)}
                      className={cn(
                        "focus-ring w-full rounded-2xl p-3 text-left transition",
                        page.id === currentPage.id ? "bg-primary text-primary-foreground shadow-glow" : "bg-white/45 hover:bg-white/75 dark:bg-white/6"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-bold">{page.title}</span>
                        <span>{moods.find((mood) => mood.value === page.mood)?.label}</span>
                      </div>
                      <p className="mt-1 text-xs opacity-75">{page.dateKey}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Button size="sm" variant="secondary" onClick={() => navigateRelative(-1)}>
              <ChevronLeft className="size-4" aria-hidden />
              Previous
            </Button>
            <Button size="sm" variant="ghost" onClick={() => deleteDiaryPage(currentPage.id)}>
              Delete
            </Button>
            <Button size="sm" variant="secondary" onClick={() => navigateRelative(1)}>
              Next
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
          {pageSurface}
        </div>
      </div>
    </ModuleFrame>
  );
}
