import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";
import "@/styles/globals.css";

// Inter carries anything a person wrote; JetBrains Mono carries anything that
// is a fact about the cup. These two variables are what the active preset's
// --family-sans / --family-mono resolve to.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
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
