"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, VolumeX, Heart } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { useLifeStore } from "@/stores/life-store";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";

const DEITIES = [
  { name: "Radha", color: "#EC4899" },
  { name: "Krishna", color: "#3B82F6" },
  { name: "Shiv", color: "#6366F1" },
  { name: "Parvati", color: "#10B981" },
  { name: "Vishnu", color: "#F59E0B" },
  { name: "Ganesh", color: "#EF4444" }
];

export function NaamJapModule() {
  const [selectedDeity, setSelectedDeity] = useState(DEITIES[0]);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const incrementNaamJap = useLifeStore((state) => state.incrementNaamJap);
  const naamJapCounts = useLifeStore((state) => state.naamJapCounts);
  const hydrated = useLifeStore((state) => state.hydrated);
  const confetti = useConfetti();
  
  const currentCount = naamJapCounts.find((n) => n.deity === selectedDeity.name)?.count || 0;

  useEffect(() => {
    // Attempt to preload voices
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const speakName = (name: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(name);
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find(v => 
      v.lang.includes("hi-IN") || 
      (v.lang.includes("en-IN") && v.name.toLowerCase().includes("female"))
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.volume = 1;
    utterance.rate = 0.8;
    utterance.pitch = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleTap = () => {
    incrementNaamJap(selectedDeity.name);
    if (soundEnabled) {
      speakName(selectedDeity.name);
    }
    if ((currentCount + 1) % 108 === 0) {
      confetti([selectedDeity.color, "#FFFFFF", "#FBBF24"]);
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      if (audioRef.current) {
         audioRef.current.volume = 0.15;
         audioRef.current.play().catch(() => {
           console.log("Audio file not found or playback prevented.");
         });
      }
    } else {
      if (audioRef.current) {
         audioRef.current.pause();
      }
    }
  };

  return (
    <ModuleFrame
      eyebrow="Spiritual practice"
      title="Naam Jap"
      subtitle="Chant the holy names and track your devotion."
      icon={Mic}
      actions={
        <button
          onClick={toggleSound}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border px-4 text-xs font-bold transition-colors",
            soundEnabled ? "bg-primary text-primary-foreground border-primary" : "bg-white/50 text-foreground"
          )}
        >
          {soundEnabled ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      }
    >
      <audio 
        ref={audioRef} 
        src="/audio/shankh.mp3" 
        loop 
        onLoadedMetadata={(e) => {
          e.currentTarget.volume = 0.15;
        }}
      />
      
      <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4">
          <div className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <h2 className="mb-4 font-display text-2xl">Select Deity</h2>
            <div className="flex flex-col gap-2">
              {DEITIES.map((deity) => (
                <button
                  key={deity.name}
                  onClick={() => setSelectedDeity(deity)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 text-left transition",
                    selectedDeity.name === deity.name
                      ? "bg-primary text-primary-foreground shadow-md border-transparent"
                      : "bg-white/50 hover:bg-white/80 dark:bg-white/5 dark:hover:bg-white/10"
                  )}
                >
                  <span className="font-bold">{deity.name}</span>
                  {selectedDeity.name === deity.name && <Heart className="size-4 fill-current" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="relative flex flex-col items-center justify-center rounded-[1.8rem] border bg-gradient-to-br from-white/60 to-white/20 p-10 shadow-glass dark:from-white/10 dark:to-white/5 overflow-hidden min-h-[400px]">
           <div 
             className="absolute inset-0 opacity-20 blur-[100px] transition-colors duration-1000" 
             style={{ backgroundColor: selectedDeity.color }} 
           />
           
           <div className="relative z-10 flex flex-col items-center">
             <p className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-muted-foreground">
               {selectedDeity.name}
             </p>
             
             <motion.button
               whileTap={{ scale: 0.95 }}
               onClick={handleTap}
               className="group relative flex size-64 items-center justify-center rounded-full border-4 border-white/40 bg-white/30 shadow-2xl backdrop-blur-md transition-all hover:bg-white/40 dark:border-white/10 dark:bg-black/20 dark:hover:bg-black/30"
             >
               <div className="absolute inset-2 rounded-full border border-white/20" />
               <AnimatePresence mode="popLayout">
                 <motion.span
                   key={currentCount}
                   initial={{ opacity: 0, y: -20, scale: 0.8 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   className="font-display text-7xl font-bold tracking-tighter text-foreground drop-shadow-sm"
                 >
                   {hydrated ? currentCount : 0}
                 </motion.span>
               </AnimatePresence>
             </motion.button>
             
             <p className="mt-8 text-center text-sm font-medium text-muted-foreground max-w-sm">
               Tap the circle to chant. Every 108 chants completes one mala.
             </p>
           </div>
        </section>
      </div>
    </ModuleFrame>
  );
}
