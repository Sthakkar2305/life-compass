"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import {
  AlertTriangle,
  CheckCircle2,
  FlameKindling,
  Plus,
  Sparkles,
  TrendingUp,
  Trash2,
  type LucideIcon
} from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Textarea } from "@/components/ui/textarea";
import { useConfetti } from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import { useLifeStore } from "@/stores/life-store";
import type { NegativeStatus } from "@/types/life";

type NegativeForm = {
  title: string;
  category: string;
  severity: number;
  notes: string;
  reflection: string;
};

const categories = [
  "Bad habit",
  "Weakness",
  "Mistake",
  "Negative thought",
  "Anger",
  "Fear",
  "Overthinking",
  "Procrastination",
  "Laziness",
  "Self doubt"
];

const growthQuotes = [
  "Awareness is not shame. Awareness is the first clean light in the room.",
  "A weakness becomes smaller the moment it receives honest attention.",
  "Progress does not need noise. It needs repetition.",
  "You can outgrow an old pattern without hating the person who had it."
];

const statCards: { label: string; key: "attention" | "improving" | "completed"; icon: LucideIcon }[] = [
  { label: "Attention", key: "attention", icon: AlertTriangle },
  { label: "Improving", key: "improving", icon: TrendingUp },
  { label: "Completed", key: "completed", icon: CheckCircle2 }
];

function statusStyle(status: NegativeStatus) {
  if (status === "Completed") return "bg-success text-success-foreground";
  if (status === "Improving") return "bg-amber-400 text-amber-950";
  return "bg-blue-950 text-white";
}

export function NegativePointsStudio() {
  const points = useLifeStore((state) => state.negativePoints);
  const addNegativePoint = useLifeStore((state) => state.addNegativePoint);
  const updateNegativePoint = useLifeStore((state) => state.updateNegativePoint);
  const deleteNegativePoint = useLifeStore((state) => state.deleteNegativePoint);
  const hydrated = useLifeStore((state) => state.hydrated);
  const confetti = useConfetti();
  const { register, handleSubmit, reset, watch } = useForm<NegativeForm>({
    defaultValues: {
      title: "",
      category: "Procrastination",
      severity: 5,
      notes: "",
      reflection: ""
    }
  });

  const severity = watch("severity");
  const stats = useMemo(() => {
    const completed = points.filter((point) => point.status === "Completed").length;
    const improving = points.filter((point) => point.status === "Improving").length;
    const attention = points.filter((point) => point.status === "Need Attention").length;
    const average = points.length ? points.reduce((sum, point) => sum + point.progress, 0) / points.length : 0;
    return { completed, improving, attention, average };
  }, [points]);

  const onSubmit = (values: NegativeForm) => {
    addNegativePoint({
      title: values.title.trim(),
      category: values.category,
      severity: Number(values.severity),
      status: "Need Attention",
      progress: 0,
      notes: values.notes,
      reflection: values.reflection
    });
    reset({ title: "", category: "Procrastination", severity: 5, notes: "", reflection: "" });
  };

  return (
    <ModuleFrame
      eyebrow="Growth mirror"
      title="Negative Points"
      subtitle="Turn weaknesses, mistakes, fear, anger, and self doubt into visible improvement."
      icon={FlameKindling}
      tone="bg-[linear-gradient(135deg,rgba(245,158,11,.28),rgba(255,255,255,.55),rgba(30,58,138,.18))] border-white/35 shadow-glass dark:bg-[linear-gradient(135deg,rgba(245,158,11,.12),rgba(15,23,42,.70),rgba(30,58,138,.28))]"
      actions={
        <>
          <Badge>{stats.improving} improving</Badge>
          <Badge>{stats.completed} completed</Badge>
          <Badge>{stats.attention} need attention</Badge>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="rounded-[1.8rem] border bg-blue-950 p-5 text-white shadow-leather">
            <div className="relative overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-amber-300/25 to-white/5 p-5">
              <div className="absolute -right-10 -top-10 size-36 rounded-full bg-amber-300/20 blur-2xl" />
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-200">Transformation</p>
              <h2 className="mt-2 font-display text-4xl">The point is not punishment.</h2>
              <p className="mt-3 text-sm leading-6 text-white/72">{growthQuotes[points.length % growthQuotes.length]}</p>
            </div>
          </section>

          <form onSubmit={handleSubmit(onSubmit)} className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                <Plus className="size-5" aria-hidden />
              </div>
              <h2 className="font-display text-3xl">Add point</h2>
            </div>
            <div className="space-y-3">
              <Input {...register("title", { required: true })} placeholder="Overthinking at night" />
              <select
                {...register("category")}
                className="h-12 w-full rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="rounded-2xl border bg-white/42 p-3 dark:bg-white/6">
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>Severity</span>
                  <span>{severity}/10</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  {...register("severity", { valueAsNumber: true })}
                  className="w-full accent-amber-500"
                />
              </div>
              <Textarea {...register("notes")} placeholder="What triggers it?" />
              <Textarea {...register("reflection")} placeholder="What better response will I practice?" />
              <Button type="submit" className="w-full" variant="warm">
                <Plus className="size-4" aria-hidden />
                Save Point
              </Button>
            </div>
          </form>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="paper-texture rounded-[1.6rem] border p-4 shadow-paper md:col-span-2">
              <div className="flex items-center gap-4">
                <ProgressRing value={stats.average} label="growth" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Overall</p>
                  <h2 className="font-display text-4xl">Improvement</h2>
                  <p className="mt-2 text-sm text-muted-foreground">Every point here is a promise to become lighter.</p>
                </div>
              </div>
            </div>
            {statCards.map(({ label, key, icon: Icon }) => (
              <div key={label} className="glass-panel rounded-[1.6rem] border p-4">
                <Icon className="mb-3 size-6 text-amber-600" aria-hidden />
                <p className="text-3xl font-black">{stats[key]}</p>
                <p className="text-sm font-bold text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {!hydrated ? (
              Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-64 animate-pulse rounded-[1.8rem] border bg-white/35 shadow-glass" />)
            ) : points.length ? (
              points.map((point, index) => (
                <motion.article
                  key={point.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="relative overflow-hidden rounded-[1.8rem] border bg-white/62 p-5 shadow-glass backdrop-blur dark:bg-white/7"
                >
                  <div className="absolute -right-10 -top-10 size-36 rounded-full bg-amber-400/18 blur-2xl" />
                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <Badge className={cn("border-0", statusStyle(point.status))}>{point.status}</Badge>
                      <h3 className="mt-3 font-display text-3xl">{point.title}</h3>
                      <p className="text-sm font-semibold text-muted-foreground">
                        {point.category} · severity {point.severity}/10
                      </p>
                    </div>
                    <Button size="iconSm" variant="ghost" onClick={() => deleteNegativePoint(point.id)} aria-label="Delete">
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>

                  <div className="relative mt-5">
                    <div className="mb-2 flex items-center justify-between text-sm font-bold">
                      <span>Progress</span>
                      <span>{point.progress}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={point.progress}
                      onChange={(event) =>
                        updateNegativePoint(point.id, {
                          progress: Number(event.target.value),
                          status: Number(event.target.value) >= 100 ? "Completed" : Number(event.target.value) > 0 ? "Improving" : "Need Attention"
                        })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {point.notes ? <p className="relative mt-4 rounded-2xl bg-muted/60 p-3 text-sm leading-6">{point.notes}</p> : null}
                  {point.reflection ? (
                    <p className="relative mt-3 rounded-2xl border border-amber-300/40 bg-amber-300/12 p-3 text-sm leading-6">
                      {point.reflection}
                    </p>
                  ) : null}

                  <div className="relative mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateNegativePoint(point.id, { status: "Improving", progress: Math.max(point.progress, 15) })}
                    >
                      <TrendingUp className="size-4" aria-hidden />
                      Improving
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => {
                        updateNegativePoint(point.id, { status: "Completed", progress: 100 });
                        confetti(["#F59E0B", "#22C55E", "#1E3A8A", "#FFFFFF"]);
                      }}
                    >
                      <Sparkles className="size-4" aria-hidden />
                      Completed
                    </Button>
                  </div>
                </motion.article>
              ))
            ) : (
              <div className="paper-texture col-span-full min-h-[420px] rounded-[1.8rem] border p-8 shadow-paper">
                <div className="max-w-lg">
                  <div className="mb-5 grid size-16 place-items-center rounded-3xl bg-blue-950 text-white shadow-leather">
                    <FlameKindling className="size-8" aria-hidden />
                  </div>
                  <h2 className="font-display text-5xl">Name one pattern</h2>
                  <p className="mt-3 text-muted-foreground">
                    The first honest point can become the first visible improvement. Add it from the left panel.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </ModuleFrame>
  );
}
