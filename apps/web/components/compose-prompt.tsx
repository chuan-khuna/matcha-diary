import Link from "next/link";

import { AvatarStandIn } from "@/components/placeholders";

/**
 * The one entry point to writing, sitting where the reader's eye already is.
 * The button is ghost rather than primary: the top bar already holds this
 * screen's single primary action, and DESIGN.md allows at most one per screen.
 */
export function ComposePrompt() {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 border-b border-line py-4"
    >
      <AvatarStandIn seed={0} />
      <span className="text-clay">What are you drinking today?</span>
      <span className="ml-auto rounded-sm border border-line-strong bg-surface px-2.75 py-1.25 font-mono text-data-sm text-ink-2">
        Log a cup
      </span>
    </Link>
  );
}
