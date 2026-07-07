"use client";

import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { BookHeart, Copy, Heart, Languages, Share2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dailyBackground, getDailyMotivation, motivationTabs, type MotivationTab } from "@/lib/motivation";
import { todayKey } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { useLifeStore } from "@/stores/life-store";
import type { Language } from "@/types/life";

const languageLabels: Record<Language, string> = {
  english: "English",
  hindi: "Hindi",
  gujarati: "Gujarati"
};

const speechLang: Record<Language, string> = {
  english: "en-IN",
  hindi: "hi-IN",
  gujarati: "gu-IN"
};

export function MotivationCenter() {
  const settings = useLifeStore((state) => state.settings);
  const updateSettings = useLifeStore((state) => state.updateSettings);
  const favorites = useLifeStore((state) => state.motivationFavorites);
  const addFavorite = useLifeStore((state) => state.addMotivationFavorite);
  const removeFavorite = useLifeStore((state) => state.removeMotivationFavorite);
  const [activeTab, setActiveTab] = useState<MotivationTab>("Daily Quote");
  const [autoRead, setAutoRead] = useState(false);
  const [copied, setCopied] = useState(false);
  const speech = useSpeechSynthesis();
  const date = todayKey();
  const language = settings.language;

  const item = useMemo(() => getDailyMotivation(language, activeTab, date), [activeTab, date, language]);
  const favorite = favorites.find(
    (entry) => entry.dateKey === date && entry.language === language && entry.tab === activeTab && entry.title === item.title
  );

  const fullText = `${item.title}. ${item.body}`;

  const copy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const share = async () => {
    if ("share" in navigator) {
      await navigator.share({ title: item.title, text: item.body });
    } else {
      await copy();
    }
  };

  const toggleFavorite = () => {
    if (favorite) {
      removeFavorite(favorite.id);
      return;
    }
    addFavorite({ dateKey: date, language, tab: activeTab, title: item.title, body: item.body });
  };

  const toggleSpeech = () => {
    if (speech.speaking) {
      speech.stop();
      return;
    }
    speech.speak(fullText, speechLang[language]);
  };

  return (
    <ModuleFrame
      eyebrow="Daily inner fuel"
      title="Motivation Center"
      subtitle="Offline daily guidance, spiritual reflection, challenge, affirmation, visualization, and spoken encouragement."
      icon={BookHeart}
      actions={
        <>
          <select
            value={language}
            onChange={(event) => updateSettings({ language: event.target.value as Language })}
            className="h-11 rounded-full border bg-white/58 px-4 text-sm font-bold shadow-sm dark:bg-white/8"
            aria-label="Language"
          >
            {(Object.keys(languageLabels) as Language[]).map((key) => (
              <option key={key} value={key}>
                {languageLabels[key]}
              </option>
            ))}
          </select>
          <Badge>
            <Languages className="size-3.5" aria-hidden />
            {languageLabels[language]}
          </Badge>
        </>
      }
    >
      <section className={cn("relative overflow-hidden rounded-[2rem] border bg-gradient-to-br p-4 shadow-glass sm:p-6", dailyBackground(date))}>
        <div className="absolute inset-0 opacity-40 paper-texture" aria-hidden />
        <div className="relative grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as MotivationTab)} className="min-w-0">
            <Tabs.List className="grid max-h-[720px] gap-2 overflow-auto rounded-[1.6rem] border bg-white/48 p-2 shadow-inner backdrop-blur-xl dark:bg-slate-950/45">
              {motivationTabs.map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className="focus-ring rounded-2xl px-4 py-3 text-left text-sm font-bold text-muted-foreground transition data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-glow"
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          <div className="min-w-0 space-y-5">
            <motion.article
              key={`${language}-${activeTab}-${item.title}`}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative min-h-[500px] overflow-hidden rounded-[1.8rem] border bg-white/68 p-6 shadow-paper backdrop-blur-xl dark:bg-slate-950/62 sm:p-9"
            >
              <div className="absolute -right-16 -top-16 size-56 rounded-full bg-amber-300/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-36 w-full bg-gradient-to-t from-blue-500/10 to-transparent" />
              <div className="relative flex min-h-[430px] flex-col justify-between">
                <div>
                  <Badge className="mb-5 bg-white/60 dark:bg-white/8">
                    <Sparkles className="size-3.5 text-amber-500" aria-hidden />
                    {activeTab}
                  </Badge>
                  <h2 className="font-display text-5xl leading-none sm:text-7xl">{item.title}</h2>
                  <p className="mt-8 max-w-3xl font-note text-2xl leading-relaxed text-foreground/86">{item.body}</p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2">
                  <Button onClick={toggleSpeech} variant={speech.speaking ? "destructive" : "default"}>
                    {speech.speaking ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
                    Read
                  </Button>
                  <Button
                    variant={autoRead ? "warm" : "secondary"}
                    onClick={() => {
                      const next = !autoRead;
                      setAutoRead(next);
                      if (next) speech.speak(fullText, speechLang[language]);
                    }}
                  >
                    <Volume2 className="size-4" aria-hidden />
                    Auto
                  </Button>
                  <Button variant="secondary" onClick={copy}>
                    <Copy className="size-4" aria-hidden />
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="secondary" onClick={share}>
                    <Share2 className="size-4" aria-hidden />
                    Share
                  </Button>
                  <Button variant={favorite ? "warm" : "secondary"} onClick={toggleFavorite}>
                    <Heart className={cn("size-4", favorite && "fill-current")} aria-hidden />
                    Favorite
                  </Button>
                </div>
              </div>
            </motion.article>

            <section className="grid gap-3 md:grid-cols-3">
              {favorites.slice(0, 3).map((entry) => (
                <article key={entry.id} className="rounded-[1.4rem] border bg-white/55 p-4 shadow-glass backdrop-blur dark:bg-white/7">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">{entry.tab}</p>
                  <h3 className="mt-2 font-display text-2xl">{entry.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{entry.body}</p>
                </article>
              ))}
            </section>
          </div>
        </div>
      </section>
    </ModuleFrame>
  );
}
