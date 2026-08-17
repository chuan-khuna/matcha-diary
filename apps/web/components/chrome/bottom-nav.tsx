"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NAV_LINKS, navLinkClasses } from "@/lib/nav-links";

/**
 * Primary navigation for narrow viewports, fixed to the bottom of the viewport.
 *
 * Every destination stays visible and thumb-reachable, which is the trade being
 * made: it costs a permanent 60px of chrome, and buys back a nav that is never
 * hidden behind a disclosure. Above 640px it disappears and SiteNav takes over.
 *
 * MUST be a sibling of the header rather than a child of it. `backdrop-filter`
 * creates a containing block for `position: fixed` descendants, so a fixed bar
 * nested inside the blurred header would anchor to the header instead of the
 * viewport and sit at the top of the page.
 *
 * Icon-only, so each link carries an `aria-label` and a `title` — the glyph is
 * the whole visible name, and three bare icons are only unambiguous to someone
 * who can see them. Height matches the top bar's 60px so the two pieces of
 * chrome agree, and the safe area is padded below that rather than eaten out of
 * it, so the row does not shrink on a device with a home indicator.
 */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper-translucent pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
    >
      <div className="flex h-15">
        {NAV_LINKS.map(({ label, href, Icon }) => {
          const isCurrent = href !== "#" && pathname === href;

          return (
            <Link
              key={label}
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              aria-label={label}
              title={label}
              // The tap target is the full third; the pill inside it is only
              // the indicator, so the reachable area is not the size of a glyph.
              className="flex flex-1 items-center justify-center"
            >
              <span
                className={`rounded-xs px-4 py-2 transition-colors ${navLinkClasses(isCurrent)}`}
              >
                <Icon aria-hidden="true" size={20} />
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
