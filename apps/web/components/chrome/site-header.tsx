import Link from "next/link";

import { SiteNav } from "@/components/chrome/site-nav";

/**
 * Sticky chrome. Depth here is translucency plus blur rather than a shadow, so
 * that content visibly passes underneath — DESIGN.md reserves shadows for
 * photography and genuine overlays.
 *
 * A server component: only the nav's active state needs the client.
 *
 * Carries no compose action. The feed's own ComposePrompt is the entry point to
 * writing, which keeps the screen to at most one primary action and leaves the
 * bar as brand and navigation only. Below 640px SiteNav hides and BottomNav
 * takes over, so the bar is brand-only on mobile.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper-translucent backdrop-blur-md">
      {/* The sticky header is itself a positioned ancestor, which is what the
          mobile nav panel anchors its `top-full` to. */}
      <div className="mx-auto flex h-15 max-w-content items-center gap-2 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold -tracking-[0.01em]"
        >
          {/* Brand mark. Built only from palette greens — the prototype's
              lighter highlight stop is not a token in DESIGN.md. */}
          <span
            aria-hidden="true"
            className="size-6.5 rounded-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 32% 28%, var(--matcha-line), var(--matcha) 55%, var(--matcha-deep))",
              boxShadow: "inset 0 0 0 3px oklch(1 0 0 / 0.5)",
            }}
          />
          matcha diary
        </Link>

        <SiteNav />
      </div>
    </header>
  );
}
