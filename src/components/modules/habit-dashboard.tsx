"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { Award, Flame, Lightbulb, Plus, Sparkles, Target, Trash2 } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ui/progress-ring";
import { achievementBadges, completionPercent, currentDailyStreak, habitCategories, habitSuggestions, monthlyCompletion, weeklyStreak } from "@/lib/habits";
import { lastNDays, todayKey } from "@/lib/date";
import { cn, formatPercent } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import { useLifeStore } from "@/stores/life-store";
import type { HabitCategory } from "@/types/life";

type HabitForm = {
  name: string;
  category: HabitCategory;
  targetPerWeek: number;
  icon: string;
  color: string;
};

const colorChoices = ["#2563EB", "#22C55E", "#F59E0B", "#A855F7", "#EC4899", "#14B8A6"];

export function HabitDashboard() {
  const habits = useLifeStore((state) => state.habits);
  const addHabit = useLifeStore((state) => state.addHabit);
  const updateHabit = useLifeStore((state) => state.updateHabit);
  const toggleHabitCompletion = useLifeStore((state) => state.toggleHabitCompletion);
  const hydrated = useLifeStore((state) => state.hydrated);
  const confetti = useConfetti();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory>("Health");
  const today = todayKey();

  const { register, handleSubmit, reset, setValue, watch } = useForm<HabitForm>({
    defaultValues: {
      name: "",
      category: "Health",
      targetPerWeek: 7,
      icon: "✨",
      color: "#2563EB"
    }
  });

  const watchedCategory = watch("category");
  const activeHabits = habits.filter((habit) => !habit.archived);
  const doneToday = activeHabits.filter((habit) => habit.completions[today]).length;
  const todayPercent = activeHabits.length ? (doneToday / activeHabits.length) * 100 : 0;

  const dashboardStats = useMemo(() => {
    const average =
      activeHabits.length === 0
        ? 0
        : activeHabits.reduce((sum, habit) => sum + completionPercent(habit, 30, today), 0) / activeHabits.length;
    const bestStreak = activeHabits.reduce((max, habit) => Math.max(max, currentDailyStreak(habit, today)), 0);
    return { average, bestStreak };
  }, [activeHabits, today]);

  const onSubmit = (values: HabitForm) => {
    addHabit({
      name: values.name.trim(),
      category: values.category,
      targetPerWeek: Number(values.targetPerWeek),
      icon: values.icon || "✨",
      color: values.color
    });
    reset({ name: "", category: values.category, targetPerWeek: 7, icon: "✨", color: values.color });
  };

  return (
    <ModuleFrame
      eyebrow="Identity system"
      title="Habit Tracker"
      subtitle="Create daily rituals, watch streaks compound, and celebrate the quiet proof that you are changing."
      icon={Flame}
      actions={
        <>
          <Badge>
            <Target className="size-3.5" aria-hidden />
            {doneToday}/{activeHabits.length} today
          </Badge>
          <Badge>
            <Award className="size-3.5" aria-hidden />
            {dashboardStats.bestStreak} best streak
          </Badge>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Today</p>
                <h2 className="font-display text-4xl">Progress</h2>
              </div>
              <ProgressRing value={todayPercent} size={96} label="done" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{activeHabits.length}</p>
                <p className="text-xs font-bold text-muted-foreground">Habits</p>
              </div>
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{formatPercent(dashboardStats.average)}</p>
                <p className="text-xs font-bold text-muted-foreground">30 days</p>
              </div>
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{dashboardStats.bestStreak}</p>
                <p className="text-xs font-bold text-muted-foreground">Streak</p>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-[1.8rem] border p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-lg">
                <Plus className="size-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Create</p>
                <h2 className="font-display text-3xl">New habit</h2>
              </div>
            </div>
            <div className="space-y-3">
              <Input {...register("name", { required: true })} placeholder="Drink Water" />
              <div className="grid grid-cols-[1fr_88px] gap-3">
                <select
                  {...register("category")}
                  className="h-12 rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6"
                  onChange={(event) => {
                    const value = event.target.value as HabitCategory;
                    setValue("category", value);
                    setSelectedCategory(value);
                  }}
                >
                  {habitCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Input {...register("icon")} maxLength={2} className="text-center text-xl" aria-label="Icon" />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <div className="flex flex-wrap gap-2 rounded-2xl border bg-white/40 p-2 dark:bg-white/6">
                  {colorChoices.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      className="size-8 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: color }}
                      onClick={() => setValue("color", color)}
                    />
                  ))}
                </div>
                <Input
                  type="number"
                  min={1}
                  max={7}
                  {...register("targetPerWeek", { valueAsNumber: true, min: 1, max: 7 })}
                  aria-label="Weekly target"
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="size-4" aria-hidden />
                Add Habit
              </Button>
            </div>
          </form>

          <section className="rounded-[1.8rem] border bg-gradient-to-br from-amber-300/25 via-white/50 to-blue-300/20 p-5 shadow-glass dark:from-amber-500/10 dark:via-white/5 dark:to-blue-500/10">
            <div className="mb-3 flex items-center gap-2">
              <Lightbulb className="size-5 text-amber-600" aria-hidden />
              <h2 className="font-display text-3xl">Suggestions</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {habitSuggestions[watchedCategory || selectedCategory].map((suggestion) => (
                <Button
                  key={suggestion}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setValue("name", suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </section>
        </aside>

        <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {!hydrated ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-72 animate-pulse rounded-[1.8rem] border bg-white/35 shadow-glass" />
            ))
          ) : activeHabits.length ? (
            activeHabits.map((habit, index) => {
              const completed = Boolean(habit.completions[today]);
              const badges = achievementBadges(habit);
              return (
                <motion.article
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="relative overflow-hidden rounded-[1.8rem] border bg-white/58 p-5 shadow-glass backdrop-blur dark:bg-white/7"
                >
                  <div className="absolute right-0 top-0 size-36 rounded-full opacity-20 blur-2xl" style={{ backgroundColor: habit.color }} />
                  <div className="relative flex items-start justify-between gap-4">
                    <button
                      onClick={() => {
                        toggleHabitCompletion(habit.id, today);
                        if (!completed) confetti([habit.color, "#F59E0B", "#22C55E", "#FFFFFF"]);
                      }}
                      className={cn(
                        "focus-ring grid size-16 shrink-0 place-items-center rounded-3xl text-3xl shadow-lg transition active:scale-95",
                        completed ? "bg-success text-success-foreground" : "bg-white/70 dark:bg-white/10"
                      )}
                      aria-label={`Toggle ${habit.name}`}
                    >
                      {completed ? "✓" : habit.icon}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-display text-3xl">{habit.name}</h3>
                      <p className="text-sm font-semibold text-muted-foreground">{habit.category}</p>
                    </div>
                    <Button size="iconSm" variant="ghost" onClick={() => updateHabit(habit.id, { archived: true })} aria-label="Archive">
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>

                  <div className="relative mt-5 grid grid-cols-[112px_1fr] gap-4">
                    <ProgressRing value={completionPercent(habit, 30, today)} label="30d" />
                    <div className="space-y-2">
                      <Badge>
                        <Flame className="size-3.5" aria-hidden />
                        {currentDailyStreak(habit, today)} day streak
                      </Badge>
                      <Badge>{weeklyStreak(habit, today)} week streak</Badge>
                      <Badge>{formatPercent(monthlyCompletion(habit, today))} monthly</Badge>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-12 gap-1">
                    {lastNDays(84, today).map((key) => (
                      <span
                        key={key}
                        title={key}
                        className={cn(
                          "aspect-square rounded-[5px] border",
                          habit.completions[key] ? "border-transparent" : "bg-muted/60"
                        )}
                        style={habit.completions[key] ? { backgroundColor: habit.color } : undefined}
                      />
                    ))}
                  </div>

                  {badges.length ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <Badge key={badge} className="bg-amber-400/18 text-amber-800 dark:text-amber-200">
                          <Sparkles className="size-3.5" aria-hidden />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </motion.article>
              );
            })
          ) : (
            <div className="paper-texture col-span-full min-h-[420px] rounded-[1.8rem] border p-8 shadow-paper">
              <div className="max-w-lg">
                <div className="mb-5 grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow">
                  <Flame className="size-8" aria-hidden />
                </div>
                <h2 className="font-display text-5xl">Start with one ritual</h2>
                <p className="mt-3 text-muted-foreground">
                  A premium tracker is only useful when it helps you keep a promise. Add the first small habit from the left panel.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </ModuleFrame>
  );
}
