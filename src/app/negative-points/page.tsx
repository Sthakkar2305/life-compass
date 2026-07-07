import type { Metadata } from "next";
import { NegativePointsStudio } from "@/components/modules/negative-points-studio";

export const metadata: Metadata = {
  title: "Negative Points"
};

export default function NegativePointsPage() {
  return <NegativePointsStudio />;
}
