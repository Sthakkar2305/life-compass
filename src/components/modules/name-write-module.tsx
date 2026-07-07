"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Edit2, Sparkles, Send } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { useLifeStore } from "@/stores/life-store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function NameWriteModule() {
  const [nameInput, setNameInput] = useState("");
  const [lastWritten, setLastWritten] = useState("");
  
  const incrementNameWrite = useLifeStore((state) => state.incrementNameWrite);
  const nameWriteCounts = useLifeStore((state) => state.nameWriteCounts);
  const hydrated = useLifeStore((state) => state.hydrated);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    
    incrementNameWrite(trimmed);
    setLastWritten(trimmed);
    setNameInput("");
  };

  return (
    <ModuleFrame
      eyebrow="Spiritual practice"
      title="Name Write"
      subtitle="Write the holy name of any deity and watch your devotion grow."
      icon={Edit2}
    >
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="space-y-5">
           <form onSubmit={handleSubmit} className="paper-texture rounded-[1.8rem] border p-6 shadow-paper flex flex-col gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Write Name</p>
                <h2 className="font-display text-3xl">Devotion</h2>
              </div>
              
              <div className="relative">
                <Input 
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Ram, Sita, Krishna" 
                  className="h-14 text-lg pr-14 rounded-2xl bg-white/50 dark:bg-black/10"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2 top-2 h-10 w-10 rounded-xl"
                  disabled={!nameInput.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </div>
              
              {lastWritten && (
                 <motion.p 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="text-sm text-center font-medium text-primary mt-2"
                 >
                   You wrote "{lastWritten}"
                 </motion.p>
              )}
           </form>
        </aside>
        
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-max">
           {!hydrated ? (
             Array.from({ length: 3 }).map((_, index) => (
               <div key={index} className="h-40 animate-pulse rounded-[1.8rem] border bg-white/35 shadow-glass" />
             ))
           ) : nameWriteCounts.length === 0 ? (
              <div className="col-span-full paper-texture rounded-[1.8rem] border p-8 shadow-paper min-h-[300px] flex flex-col justify-center items-center text-center">
                 <div className="mb-5 grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow">
                   <Sparkles className="size-8" aria-hidden />
                 </div>
                 <h2 className="font-display text-4xl">Start Writing</h2>
                 <p className="mt-3 text-muted-foreground max-w-sm">
                   Type any deity's name on the left to begin your spiritual writing journey.
                 </p>
              </div>
           ) : (
             nameWriteCounts.map((record, index) => (
               <motion.div
                 key={record.name}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.05 }}
                 className="relative overflow-hidden rounded-[1.8rem] border bg-white/58 p-6 shadow-glass backdrop-blur dark:bg-white/7 flex flex-col justify-between h-40"
               >
                 <div className="absolute right-0 top-0 size-24 rounded-full bg-primary/10 blur-2xl" />
                 <h3 className="font-display text-2xl truncate relative z-10">{record.name}</h3>
                 
                 <div className="flex items-end justify-between relative z-10">
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Written</p>
                      <p className="text-4xl font-black leading-none">{record.count}</p>
                    </div>
                    <Edit2 className="size-6 text-primary opacity-20" />
                 </div>
               </motion.div>
             ))
           )}
        </section>
      </div>
    </ModuleFrame>
  );
}
