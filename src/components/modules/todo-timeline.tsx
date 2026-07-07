"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { CalendarClock, CheckCircle2, Circle, ListTodo, Plus, RotateCcw, Trash2, Zap } from "lucide-react";
import { ModuleFrame } from "@/components/modules/module-frame";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Switch } from "@/components/ui/switch";
import { useConfetti } from "@/hooks/use-confetti";
import { todayKey } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useLifeStore } from "@/stores/life-store";
import type { TaskCategory, TaskPriority, TodoTask } from "@/types/life";

type TaskForm = {
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  dueDate: string;
  carryForward: boolean;
};

const categories: TaskCategory[] = ["Personal", "Study", "Work", "Health", "Fitness", "Shopping", "Family"];
const priorities: TaskPriority[] = ["High", "Medium", "Low"];

const priorityClass: Record<TaskPriority, string> = {
  High: "bg-red-500 text-white",
  Medium: "bg-amber-400 text-amber-950",
  Low: "bg-emerald-500 text-white"
};

function taskSort(a: TodoTask, b: TodoTask) {
  if (a.completed !== b.completed) return a.completed ? 1 : -1;
  if (a.dueDate !== b.dueDate) return a.dueDate.localeCompare(b.dueDate);
  const priorityWeight = { High: 0, Medium: 1, Low: 2 };
  return priorityWeight[a.priority] - priorityWeight[b.priority];
}

export function TodoTimeline() {
  const tasks = useLifeStore((state) => state.tasks);
  const hydrated = useLifeStore((state) => state.hydrated);
  const addTask = useLifeStore((state) => state.addTask);
  const toggleTask = useLifeStore((state) => state.toggleTask);
  const deleteTask = useLifeStore((state) => state.deleteTask);
  const carryForwardTasks = useLifeStore((state) => state.carryForwardTasks);
  const clearCompletedTasks = useLifeStore((state) => state.clearCompletedTasks);
  const confetti = useConfetti();
  const today = todayKey();
  const { register, handleSubmit, reset, setValue, watch } = useForm<TaskForm>({
    defaultValues: {
      title: "",
      category: "Personal",
      priority: "Medium",
      dueDate: today,
      carryForward: true
    }
  });
  const carryForward = watch("carryForward");

  const stats = useMemo(() => {
    const todayTasks = tasks.filter((task) => task.dueDate === today);
    const done = todayTasks.filter((task) => task.completed).length;
    const overdue = tasks.filter((task) => !task.completed && task.dueDate < today).length;
    const percent = todayTasks.length ? (done / todayTasks.length) * 100 : 0;
    return { todayTasks, done, overdue, percent };
  }, [tasks, today]);

  const sortedTasks = useMemo(() => [...tasks].sort(taskSort), [tasks]);

  const onSubmit = (values: TaskForm) => {
    addTask({
      title: values.title.trim(),
      category: values.category,
      priority: values.priority,
      dueDate: values.dueDate || today,
      carryForward: values.carryForward
    });
    reset({ title: "", category: values.category, priority: values.priority, dueDate: today, carryForward: values.carryForward });
  };

  const complete = (task: TodoTask) => {
    if (!task.completed) confetti(["#2563EB", "#22C55E", "#F59E0B", "#FFFFFF"]);
    toggleTask(task.id);
  };

  return (
    <ModuleFrame
      eyebrow="Daily execution"
      title="Todo List"
      subtitle="A premium daily timeline for the practical promises that move life forward."
      icon={ListTodo}
      actions={
        <>
          <Badge>{stats.done}/{stats.todayTasks.length} today</Badge>
          <Badge>{stats.overdue} overdue</Badge>
          <Button variant="secondary" size="sm" onClick={carryForwardTasks}>
            <RotateCcw className="size-4" aria-hidden />
            Carry
          </Button>
        </>
      }
    >
      <div className="grid gap-5 xl:grid-cols-[390px_minmax(0,1fr)]">
        <aside className="space-y-5">
          <section className="paper-texture rounded-[1.8rem] border p-5 shadow-paper">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Today</p>
                <h2 className="font-display text-4xl">Timeline</h2>
              </div>
              <ProgressRing value={stats.percent} size={104} label="done" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{stats.todayTasks.length}</p>
                <p className="text-xs font-bold text-muted-foreground">Today</p>
              </div>
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{stats.done}</p>
                <p className="text-xs font-bold text-muted-foreground">Done</p>
              </div>
              <div className="rounded-2xl bg-white/55 p-3 text-center shadow-inner dark:bg-white/6">
                <p className="text-2xl font-black">{stats.overdue}</p>
                <p className="text-xs font-bold text-muted-foreground">Late</p>
              </div>
            </div>
          </section>

          <form onSubmit={handleSubmit(onSubmit)} className="glass-panel rounded-[1.8rem] border p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
                <Plus className="size-5" aria-hidden />
              </div>
              <h2 className="font-display text-3xl">New task</h2>
            </div>
            <div className="space-y-3">
              <Input {...register("title", { required: true })} placeholder="Finish one important thing" />
              <div className="grid grid-cols-2 gap-3">
                <select {...register("category")} className="h-12 rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6">
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select {...register("priority")} className="h-12 rounded-2xl border bg-white/58 px-4 text-sm font-semibold shadow-inner dark:bg-white/6">
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>
              <Input type="date" {...register("dueDate")} />
              <div className="flex items-center justify-between rounded-2xl border bg-white/42 p-3 dark:bg-white/6">
                <div>
                  <p className="text-sm font-bold">Carry forward</p>
                  <p className="text-xs text-muted-foreground">Unfinished daily tasks move to today.</p>
                </div>
                <Switch checked={carryForward} onCheckedChange={(value) => setValue("carryForward", value)} />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="size-4" aria-hidden />
                Add Task
              </Button>
            </div>
          </form>

          <Button variant="secondary" className="w-full" onClick={clearCompletedTasks}>
            <Trash2 className="size-4" aria-hidden />
            Clear Completed
          </Button>
        </aside>

        <section className="relative rounded-[2rem] border bg-white/44 p-4 shadow-glass backdrop-blur dark:bg-white/6 sm:p-6">
          <div className="absolute bottom-6 left-10 top-6 hidden w-px bg-primary/20 md:block" />
          <div className="space-y-4">
            {!hydrated ? (
              Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-[1.5rem] bg-white/50 dark:bg-white/8" />)
            ) : sortedTasks.length ? (
              sortedTasks.map((task, index) => {
                const overdue = !task.completed && task.dueDate < today;
                const dueToday = task.dueDate === today;
                return (
                  <motion.article
                    key={task.id}
                    layout
                    drag="x"
                    dragConstraints={{ left: 0, right: 110 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 80) complete(task);
                    }}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.035 }}
                    className={cn(
                      "relative ml-0 rounded-[1.6rem] border bg-white/74 p-4 shadow-glass backdrop-blur dark:bg-slate-950/58 md:ml-8",
                      task.completed && "opacity-68",
                      overdue && "border-red-400/55"
                    )}
                  >
                    <span className="absolute -left-[2.75rem] top-7 hidden size-5 rounded-full border-4 border-background bg-primary shadow-glow md:block" />
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => complete(task)}
                        className={cn(
                          "focus-ring mt-1 grid size-11 shrink-0 place-items-center rounded-2xl border transition active:scale-95",
                          task.completed ? "bg-success text-success-foreground" : "bg-white/70 dark:bg-white/8"
                        )}
                        aria-label={`Toggle ${task.title}`}
                      >
                        {task.completed ? <CheckCircle2 className="size-5" aria-hidden /> : <Circle className="size-5" aria-hidden />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={cn("border-0", priorityClass[task.priority])}>{task.priority}</Badge>
                          <Badge>{task.category}</Badge>
                          {overdue ? <Badge className="bg-red-500/12 text-red-700 dark:text-red-300">Overdue</Badge> : null}
                          {dueToday ? <Badge>Today</Badge> : null}
                        </div>
                        <h3 className={cn("mt-3 font-display text-3xl", task.completed && "line-through decoration-2 opacity-70")}>
                          {task.title}
                        </h3>
                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                          <CalendarClock className="size-4" aria-hidden />
                          {task.dueDate}
                        </p>
                      </div>
                      <Button size="iconSm" variant="ghost" onClick={() => deleteTask(task.id)} aria-label="Delete">
                        <Trash2 className="size-4" aria-hidden />
                      </Button>
                    </div>
                  </motion.article>
                );
              })
            ) : (
              <div className="paper-texture min-h-[520px] rounded-[1.8rem] border p-8 shadow-paper">
                <div className="max-w-lg">
                  <div className="mb-5 grid size-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-glow">
                    <Zap className="size-8" aria-hidden />
                  </div>
                  <h2 className="font-display text-5xl">Make the day visible</h2>
                  <p className="mt-3 text-muted-foreground">
                    Add your first task. Keep it concrete enough that your future self can finish it without negotiation.
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
