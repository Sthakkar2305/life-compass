import type { Metadata } from "next";
import { HabitDashboard } from "@/components/modules/habit-dashboard";

export const metadata: Metadata = {
  title: "Habit Tracker"
};

export default function HabitsPage() {
  return <HabitDashboard />;
}
