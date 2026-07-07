"use client";

import { create } from "zustand";
import type {
  AppSettings,
  DiaryPage,
  Habit,
  LifeData,
  MotivationFavorite,
  NegativePoint,
  TodoTask
} from "@/types/life";
import { defaultLifeData, loadLifeData, saveLifeData } from "@/lib/storage";
import { createId } from "@/lib/utils";
import { todayKey } from "@/lib/date";

type DiaryInput = Partial<Omit<DiaryPage, "id" | "createdAt" | "updatedAt">>;
type HabitInput = Omit<Habit, "id" | "createdAt" | "completions" | "archived">;
type NegativeInput = Omit<NegativePoint, "id" | "createdAt" | "updatedAt">;
type TaskInput = Omit<TodoTask, "id" | "createdAt" | "completed" | "completedAt">;

type LifeState = LifeData & {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  persist: () => Promise<void>;
  replaceData: (data: LifeData) => Promise<void>;
  addDiaryPage: (input?: DiaryInput) => string;
  updateDiaryPage: (id: string, patch: Partial<DiaryPage>) => void;
  deleteDiaryPage: (id: string) => void;
  addHabit: (input: HabitInput) => string;
  updateHabit: (id: string, patch: Partial<Habit>) => void;
  toggleHabitCompletion: (id: string, dateKeyValue?: string) => void;
  addNegativePoint: (input: NegativeInput) => string;
  updateNegativePoint: (id: string, patch: Partial<NegativePoint>) => void;
  deleteNegativePoint: (id: string) => void;
  addMotivationFavorite: (input: Omit<MotivationFavorite, "id" | "createdAt">) => void;
  removeMotivationFavorite: (id: string) => void;
  addTask: (input: TaskInput) => string;
  updateTask: (id: string, patch: Partial<TodoTask>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  carryForwardTasks: () => void;
  clearCompletedTasks: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  incrementNaamJap: (deity: string) => void;
  incrementNameWrite: (name: string) => void;
};

function snapshot(state: LifeState): LifeData {
  return {
    version: 1,
    diaryPages: state.diaryPages,
    habits: state.habits,
    negativePoints: state.negativePoints,
    motivationFavorites: state.motivationFavorites,
    tasks: state.tasks,
    naamJapCounts: state.naamJapCounts,
    nameWriteCounts: state.nameWriteCounts,
    settings: state.settings
  };
}

function persistSoon(get: () => LifeState) {
  void get().persist();
}

export const useLifeStore = create<LifeState>((set, get) => ({
  ...defaultLifeData,
  hydrated: false,
  hydrate: async () => {
    const data = await loadLifeData();
    set({ ...data, hydrated: true });
  },
  persist: async () => {
    await saveLifeData(snapshot(get()));
  },
  replaceData: async (data) => {
    set({ ...data, hydrated: true });
    await saveLifeData(data);
  },
  addDiaryPage: (input = {}) => {
    const now = new Date().toISOString();
    const id = createId("diary");
    const page: DiaryPage = {
      id,
      title: input.title ?? "Untitled page",
      dateKey: input.dateKey ?? todayKey(),
      createdAt: now,
      updatedAt: now,
      content: input.content ?? "",
      mood: input.mood ?? "calm",
      favorite: input.favorite ?? false,
      canvasDataUrl: input.canvasDataUrl,
      tags: input.tags ?? []
    };
    set((state) => ({ diaryPages: [page, ...state.diaryPages] }));
    persistSoon(get);
    return id;
  },
  updateDiaryPage: (id, patch) => {
    set((state) => ({
      diaryPages: state.diaryPages.map((page) =>
        page.id === id ? { ...page, ...patch, updatedAt: new Date().toISOString() } : page
      )
    }));
    persistSoon(get);
  },
  deleteDiaryPage: (id) => {
    set((state) => ({ diaryPages: state.diaryPages.filter((page) => page.id !== id) }));
    persistSoon(get);
  },
  addHabit: (input) => {
    const id = createId("habit");
    const habit: Habit = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      completions: {},
      archived: false
    };
    set((state) => ({ habits: [habit, ...state.habits] }));
    persistSoon(get);
    return id;
  },
  updateHabit: (id, patch) => {
    set((state) => ({ habits: state.habits.map((habit) => (habit.id === id ? { ...habit, ...patch } : habit)) }));
    persistSoon(get);
  },
  toggleHabitCompletion: (id, dateKeyValue = todayKey()) => {
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              completions: {
                ...habit.completions,
                [dateKeyValue]: !habit.completions[dateKeyValue]
              }
            }
          : habit
      )
    }));
    persistSoon(get);
  },
  addNegativePoint: (input) => {
    const now = new Date().toISOString();
    const id = createId("negative");
    const point: NegativePoint = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now
    };
    set((state) => ({ negativePoints: [point, ...state.negativePoints] }));
    persistSoon(get);
    return id;
  },
  updateNegativePoint: (id, patch) => {
    set((state) => ({
      negativePoints: state.negativePoints.map((point) =>
        point.id === id ? { ...point, ...patch, updatedAt: new Date().toISOString() } : point
      )
    }));
    persistSoon(get);
  },
  deleteNegativePoint: (id) => {
    set((state) => ({ negativePoints: state.negativePoints.filter((point) => point.id !== id) }));
    persistSoon(get);
  },
  addMotivationFavorite: (input) => {
    const exists = get().motivationFavorites.some(
      (favorite) =>
        favorite.dateKey === input.dateKey &&
        favorite.tab === input.tab &&
        favorite.language === input.language &&
        favorite.title === input.title
    );
    if (exists) return;
    set((state) => ({
      motivationFavorites: [
        {
          ...input,
          id: createId("motivation"),
          createdAt: new Date().toISOString()
        },
        ...state.motivationFavorites
      ]
    }));
    persistSoon(get);
  },
  removeMotivationFavorite: (id) => {
    set((state) => ({ motivationFavorites: state.motivationFavorites.filter((favorite) => favorite.id !== id) }));
    persistSoon(get);
  },
  addTask: (input) => {
    const id = createId("task");
    const task: TodoTask = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      completed: false
    };
    set((state) => ({ tasks: [task, ...state.tasks] }));
    persistSoon(get);
    return id;
  },
  updateTask: (id, patch) => {
    set((state) => ({ tasks: state.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)) }));
    persistSoon(get);
  },
  toggleTask: (id) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : undefined
            }
          : task
      )
    }));
    persistSoon(get);
  },
  deleteTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
    persistSoon(get);
  },
  carryForwardTasks: () => {
    const today = todayKey();
    set((state) => ({
      tasks: state.tasks.map((task) =>
        !task.completed && task.carryForward && task.dueDate < today ? { ...task, dueDate: today } : task
      )
    }));
    persistSoon(get);
  },
  clearCompletedTasks: () => {
    set((state) => ({ tasks: state.tasks.filter((task) => !task.completed) }));
    persistSoon(get);
  },
  updateSettings: (patch) => {
    set((state) => ({ settings: { ...state.settings, ...patch } }));
    persistSoon(get);
  },
  incrementNaamJap: (deity) => {
    set((state) => {
      const exists = state.naamJapCounts.find((n) => n.deity === deity);
      if (exists) {
        return {
          naamJapCounts: state.naamJapCounts.map((n) =>
            n.deity === deity ? { ...n, count: n.count + 1, lastUpdated: new Date().toISOString() } : n
          )
        };
      }
      return {
        naamJapCounts: [
          ...state.naamJapCounts,
          { deity, count: 1, lastUpdated: new Date().toISOString() }
        ]
      };
    });
    persistSoon(get);
  },
  incrementNameWrite: (name) => {
    set((state) => {
      const exists = state.nameWriteCounts.find((n) => n.name === name);
      if (exists) {
        return {
          nameWriteCounts: state.nameWriteCounts.map((n) =>
            n.name === name ? { ...n, count: n.count + 1, lastUpdated: new Date().toISOString() } : n
          )
        };
      }
      return {
        nameWriteCounts: [
          ...state.nameWriteCounts,
          { name, count: 1, lastUpdated: new Date().toISOString() }
        ]
      };
    });
    persistSoon(get);
  }
}));
