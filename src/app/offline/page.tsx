import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="paper-texture max-w-xl rounded-book border p-8 shadow-paper">
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <BookOpen className="size-7" aria-hidden />
        </div>
        <h1 className="font-display text-5xl leading-none">You are offline</h1>
        <p className="mt-4 text-muted-foreground">
          Life Changer Book keeps your entries, habits, points, motivation, and tasks locally on this device.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-medium text-primary-foreground shadow-glow focus-ring"
        >
          Open book
        </Link>
      </section>
    </main>
  );
}
