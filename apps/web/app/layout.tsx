import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
