"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavLinkCurrent, NAV_LINKS, navLinkClasses } from "@/lib/nav-links";

/**
 * Primary navigation for wide viewports, inline in the top bar.
 *
 * Below 640px this hides entirely and BottomNav takes over — the same
 * destinations, moved within reach of a thumb. The breakpoint is content-driven
 * rather than device-driven: three labels plus the brand stop fitting on one
 * 60px line, which is the actual reason and not a device class.
 *
 * Keeps its labels beside the icons. The bottom bar drops them because it is
 * three wide targets where position alone is a strong cue; up here the items sit
 * in a row of arbitrary length beside a wordmark, where a bare glyph is a
 * guess. Space is not the constraint at this width, so nothing is bought by
 * hiding the word.
 *
 * Client-only because `usePathname` drives active state. The header shell around
 * it stays a server component.
 */
export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden gap-1 sm:flex">
      {NAV_LINKS.map(({ label, href, Icon }) => {
        const isCurrent = isNavLinkCurrent(pathname, href);

        return (
          <Link
            key={label}
            href={href}
            aria-current={isCurrent ? "page" : undefined}
            className={`data-md flex items-center gap-1.5 rounded-xs px-2.5 py-1.5 transition-colors ${navLinkClasses(isCurrent)}`}
          >
            <Icon aria-hidden="true" size={16} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
