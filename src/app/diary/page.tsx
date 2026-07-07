import type { Metadata } from "next";
import { DiaryNotebook } from "@/components/modules/diary-notebook";

export const metadata: Metadata = {
  title: "Diary"
};

export default function DiaryPage() {
  return <DiaryNotebook />;
}
