import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai_Looped, Inter, JetBrains_Mono } from "next/font/google";

import { BottomNav } from "@/components/chrome/bottom-nav";
import { SiteHeader } from "@/components/chrome/site-header";
import "@/styles/globals.css";

// Inter carries anything a person wrote; JetBrains Mono carries anything that
// is a fact about the cup. These variables are what the active preset's
// --family-sans / --family-mono resolve to.
// Italic is loaded, and it is loaded for one reason: a cultivar record sets
// botanical binomials, gene symbols and journal titles in `em`, and a browser
// with no italic face to reach for synthesizes one by shearing the upright —
// no true italic a, f or g, and skewed stem weights, on the one surface whose
// job is comfortable reading. `next/font` defaults to `style: ["normal"]`, so
// this is opt-in rather than something the face brings along. See DESIGN.md
// for where italic is allowed, which is only there.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

/**
 * Thai, for both stacks — see DESIGN.md's typography section.
 *
 * One face rather than two. Neither Latin face covers Thai and no monospace on
 * Google Fonts covers it at all, so the Latin authored/recorded split has no
 * typographic equivalent here; Thai is set looped (มีหัว) throughout, which is
 * the more readable setting at the paragraph lengths this app asks for.
 *
 * `subsets` is a preload list rather than a filter, which is worth knowing
 * before reading the build output: next/font still emits @font-face rules for
 * this face's Latin and Cyrillic ranges, and only the three Thai files get a
 * <link rel="preload">. Nothing fetches the others — `unicode-range` makes a
 * download lazy per range, and this face sits *behind* Inter and JetBrains
 * Mono in both stacks, so no Latin glyph ever resolves to it.
 *
 * Weights are pinned to the three DESIGN.md uses. This is a static face, not
 * a variable one, so an unpinned weight is another file on the wire.
 */
const plexThaiLooped = IBM_Plex_Sans_Thai_Looped({
  variable: "--font-ibm-plex-thai-looped",
  subsets: ["thai"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Matcha Diary",
  description: "A diary for the bowls you drank, not a scoreboard.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // data-theme selects the preset. Every token is authored under both
      // `:root` and `[data-theme="washi"]`, so this is redundant today and
      // is the switch a second preset will need.
      data-theme="washi"
      className={`${inter.variable} ${jetbrainsMono.variable} ${plexThaiLooped.variable} h-full`}
    >
      {/* The bottom bar is fixed, so the page reserves its height plus the home
          indicator's safe area. Above 640px the bar is gone and so is the gap. */}
      <body className="flex min-h-full flex-col pb-[calc(60px+env(safe-area-inset-bottom))] sm:pb-0">
        <SiteHeader />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
