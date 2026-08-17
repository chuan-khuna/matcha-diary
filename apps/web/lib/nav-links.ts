import type { IconType } from "react-icons";
import {
  PiHouseLight,
  PiLeafLight,
  PiNotebookLight,
  PiTreeLight,
} from "react-icons/pi";

/**
 * The primary destinations, in one place because two components render them:
 * SiteNav inline in the top bar above 640px, BottomNav as a fixed bar below it.
 * Adding a destination should never mean remembering the second list.
 *
 * `#` marks a route that does not exist yet. Each becomes a real path as it is
 * built; nothing else about either component changes.
 *
 * Icons are Phosphor at the **Light** weight (`react-icons/pi`). That is the
 * deliberate part: the system is built out of 1px hairlines and near-flat
 * corners, and a 2px round-capped set — Feather, Lucide, and most defaults —
 * reads heavier than every other line on the page. Light sits at roughly the
 * weight of the borders it lives beside.
 *
 * Keep the silhouettes distinct. A leaf and a notebook are hard to confuse at
 * 20px; two book-like glyphs would not be. Cultivars take a whole tree against
 * the database's single leaf — a plant versus a picked leaf, which is roughly
 * the actual distinction between the two references.
 */
export type NavLink = {
  label: string;
  href: string;
  Icon: IconType;
};

export const NAV_LINKS: NavLink[] = [
  { label: "feed", href: "/", Icon: PiHouseLight },
  { label: "database", href: "/database", Icon: PiLeafLight },
  { label: "cultivars", href: "/cultivars", Icon: PiTreeLight },
  { label: "my diary", href: "#", Icon: PiNotebookLight },
];

/**
 * Whether a destination should read as the current one.
 *
 * Exact match is wrong for any section with pages beneath it: standing on
 * `/cultivars/asahi` is still standing in cultivars, and a nav that goes blank
 * the moment you open a record is a nav that stops telling you where you are.
 * `/` is the exception and has to be — every path starts with it.
 */
export function isNavLinkCurrent(pathname: string, href: string): boolean {
  if (href === "#") return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Shared active-state styling. Matcha here is state, not decoration — it marks
 * where you are, which is one of the sanctioned uses of green.
 */
export function navLinkClasses(isCurrent: boolean) {
  return isCurrent
    ? "bg-matcha-soft text-matcha-deep"
    : "text-clay hover:bg-paper-sunk hover:text-ink";
}
