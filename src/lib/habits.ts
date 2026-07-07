import type { Habit, HabitCategory } from "@/types/life";
import { daysBetween, lastNDays, shiftDateKey, todayKey } from "@/lib/date";

export const habitCategories: HabitCategory[] = [
  "Health",
  "Mind",
  "Career",
  "Money",
  "Spiritual",
  "Fitness",
  "Relationship",
  "Learning",
  "Productivity",
  "Morning Routine",
  "Night Routine"
];

export const habitSuggestions: Record<HabitCategory, string[]> = {
  Health: ["Drink Water", "Sleep Early", "Walk", "No Phone"],
  Mind: ["Meditation", "Journal", "Read Book", "Positive Affirmation"],
  Career: ["Deep Work", "Coding", "Study", "Portfolio Practice"],
  Money: ["Track Expense", "Save Money", "Read Finance", "No Impulse Buy"],
  Spiritual: ["Prayer", "Gratitude", "Temple Visit", "Bhagavad Gita"],
  Fitness: ["Exercise", "Yoga", "Stretch", "Steps"],
  Relationship: ["Call Family", "Listen Fully", "Kind Message", "Quality Time"],
  Learning: ["Read Book", "Course Lesson", "Practice Skill", "Revise Notes"],
  Productivity: ["Plan Day", "Top 3 Tasks", "Inbox Zero", "Focus Sprint"],
  "Morning Routine": ["Wake Early", "Sunlight", "Hydrate", "Make Bed"],
  "Night Routine": ["Sleep Early", "Reflect", "No Phone", "Prepare Tomorrow"]
};

export function completionPercent(habit: Habit, days = 30, endKey = todayKey()) {
  const keys = lastNDays(days, endKey);
  const done = keys.filter((key) => habit.completions[key]).length;
  return days === 0 ? 0 : (done / days) * 100;
}

export function currentDailyStreak(habit: Habit, endKey = todayKey()) {
  let streak = 0;
  let cursor = endKey;
  while (habit.completions[cursor]) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }
  return streak;
}

export function weeklyStreak(habit: Habit, endKey = todayKey()) {
  let streak = 0;
  let cursor = endKey;
  for (let week = 0; week < 12; week += 1) {
    const weekKeys = lastNDays(7, cursor);
    const done = weekKeys.filter((key) => habit.completions[key]).length;
    if (done >= Math.min(habit.targetPerWeek, 7)) {
      streak += 1;
      cursor = shiftDateKey(cursor, -7);
    } else {
      break;
    }
  }
  return streak;
}

export function monthlyCompletion(habit: Habit, endKey = todayKey()) {
  const createdAge = Math.max(1, daysBetween(habit.createdAt.slice(0, 10), endKey) + 1);
  return completionPercent(habit, Math.min(30, createdAge), endKey);
}

export function achievementBadges(habit: Habit) {
  const daily = currentDailyStreak(habit);
  const total = Object.values(habit.completions).filter(Boolean).length;
  return [
    daily >= 3 ? "3-day spark" : null,
    daily >= 7 ? "7-day flame" : null,
    daily >= 21 ? "Identity shift" : null,
    total >= 50 ? "50 wins" : null,
    monthlyCompletion(habit) >= 80 ? "Month master" : null
  ].filter(Boolean) as string[];
}
