import type { Metadata } from "next";
import { NameWriteModule } from "@/components/modules/name-write-module";

export const metadata: Metadata = {
  title: "Name Write"
};

export default function NameWritePage() {
  return <NameWriteModule />;
}
