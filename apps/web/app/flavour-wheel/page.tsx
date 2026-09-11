import type { Metadata } from "next";

import { FlavourWheel } from "@/components/flavour-wheel/flavour-wheel";
import { WHEEL_COUNTS } from "@/lib/flavour-wheel";

export const metadata: Metadata = {
  title: "Flavour wheel — Matcha Diary",
  description:
    "The matcha taster's flavour wheel: families, groups and notes, read from the centre out.",
};

/**
 * The flavour wheel — a vocabulary for what is in the bowl.
 *
 * A reference in the way the pedigree is, rather than a record: nothing here
 * belongs to a powder or a review. What it gives the rest of the app is words.
 * A taste note is easier to find when you can narrow toward it, and the wheel
 * is that narrowing drawn out — family, then group, then note.
 *
 * Statically rendered. The wheel is a client component for its hover and hold,
 * but its bands are constants, so the server paints the finished drawing and
 * the browser only takes over the pointer.
 */
export default function FlavourWheelPage() {
  return (
    <main className="mx-auto w-full max-w-content px-4 pb-16 sm:px-6">
      <header className="flex flex-col gap-2 py-6">
        <p className="label-caps text-clay">Reference</p>
        <h1 className="text-headline-lg">Flavour wheel</h1>
        <p className="max-w-reading text-body-lg text-ink-2">
          {WHEEL_COUNTS.notes} notes in {WHEEL_COUNTS.groups} groups and{" "}
          {WHEEL_COUNTS.families} families, after the taster’s wheel MTCH prints
          for matcha. Read it from the centre out: the family, the group within
          it, then the note itself. Pick any band to follow it — every note is
          listed again below the wheel.
        </p>
      </header>

      <FlavourWheel />
    </main>
  );
}
