import type { Metadata } from "next";
import { NaamJapModule } from "@/components/modules/naam-jap-module";

export const metadata: Metadata = {
  title: "Naam Jap"
};

export default function NaamJapPage() {
  return <NaamJapModule />;
}
