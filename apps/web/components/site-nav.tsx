"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * The only reason this is a client component is `usePathname` — active state has
 * to know where you are. Keep it that way: the header shell around it stays a
 * server component, so the brand and the primary action ship no JavaScript.
 *
 * `#` marks a destination that does not exist yet. Each becomes a real route as
 * it is built; nothing else about this file changes.
 */
const LINKS = [
  { label: "feed", href: "/" },
  { label: "database", href: "#" },
  { label: "my diary", href: "#" },
] as const;

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1" aria-label="Primary">
      {LINKS.map(({ label, href }) => {
        const isCurrent = href !== "#" && pathname === href;

        return (
          <Link
            key={label}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            // Matcha here is state, not decoration — it marks where you are.
            className={`rounded-xs px-2.5 py-1.5 font-mono text-data-md transition-colors ${
              isCurrent
                ? "bg-matcha-soft text-matcha-deep"
                : "text-clay hover:bg-paper-sunk hover:text-ink"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
