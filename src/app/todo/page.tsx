import type { Metadata } from "next";
import { TodoTimeline } from "@/components/modules/todo-timeline";

export const metadata: Metadata = {
  title: "Todo List"
};

export default function TodoPage() {
  return <TodoTimeline />;
}
