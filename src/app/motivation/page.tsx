import type { Metadata } from "next";
import { MotivationCenter } from "@/components/modules/motivation-center";

export const metadata: Metadata = {
  title: "Motivation Center"
};

export default function MotivationPage() {
  return <MotivationCenter />;
}
