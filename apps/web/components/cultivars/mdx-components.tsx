import type { MDXComponents } from "mdx/types";

/**
 * The design system, applied to the HTML that markdown compiles down to.
 *
 * Required at the app root by `@next/mdx` — App Router will not compile MDX
 * without this file. It is also the only styling layer the cultivar prose gets:
 * rather than a `.prose` stylesheet and a typography plugin, each element that
 * markdown can actually produce is mapped to the token it should have been
 * written with. The upside is that there is no second vocabulary — a heading
 * here is `text-headline-lg`, the same name a heading anywhere else in the app
 * carries, and a colour that is not in DESIGN.md cannot be reached from here.
 *
 * Cultivar records are the only MDX in the app, so a global map is the right
 * scope. The one thing left local is `h1`: every record opens with its own name
 * as a heading, and the detail page has already set that as the page title, so
 * the page passes `h1: () => null` rather than this file deciding for everyone.
 *
 * The element set is deliberately the set the records use — headings,
 * paragraphs, lists, emphasis, inline code — plus links and rules, which cost
 * nothing to cover and would otherwise render unstyled the first time someone
 * writes one.
 */
const components: MDXComponents = {
  h1: ({ children }) => <h1 className="text-display">{children}</h1>,

  // A section break in a long record. The hairline is doing the separating —
  // DESIGN.md leans on rules and tone for hierarchy before it reaches for size.
  h2: ({ children }) => (
    <h2 className="mt-12 border-b border-line pb-2 text-headline-lg first:mt-0">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="mt-8 text-headline-md">{children}</h3>
  ),

  // 18/1.75, the loosest leading in the system, because a cultivar history is
  // the one place in this app where someone reads several paragraphs in a row.
  p: ({ children }) => (
    <p className="mt-4 text-body-prose text-ink-2">{children}</p>
  ),

  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-body-prose text-ink-2 marker:text-matcha-line">
      {children}
    </ul>
  ),

  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-body-prose text-ink-2 marker:text-clay">
      {children}
    </ol>
  ),

  li: ({ children }) => <li className="pl-1">{children}</li>,

  // Lineage lists lead with a bolded parent name. That name is the subject of
  // the line, so it takes the darker ink rather than a heavier weight on top of
  // it — the system has no bold body face.
  strong: ({ children }) => (
    <strong className="font-normal text-ink">{children}</strong>
  ),

  em: ({ children }) => <em className="italic">{children}</em>,

  // Inline code carries recorded facts — strain numbers, field names — so it
  // takes the mono face and the stamped, zero-radius treatment rather than a
  // pill, matching taste-note chips elsewhere in the app.
  code: ({ children }) => (
    <code className="rounded-none border border-line bg-paper-sunk px-[5px] py-px font-mono text-data-md text-ink">
      {children}
    </code>
  ),

  a: ({ children, href }) => (
    <a
      href={href}
      className="text-ink underline decoration-matcha-line decoration-1 underline-offset-4 transition-colors hover:decoration-matcha"
    >
      {children}
    </a>
  ),

  blockquote: ({ children }) => (
    <blockquote className="mt-4 border-l-2 border-matcha-line pl-4 text-body-prose text-ink-2">
      {children}
    </blockquote>
  ),

  hr: () => <hr className="my-10 border-line" />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
