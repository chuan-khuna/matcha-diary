import type { ReactNode } from "react";

/**
 * A label that sits on top of a photograph — the "2 more images" counter in the
 * feed, the `1 / 6` gallery counter and the COVER marker on a review.
 *
 * DESIGN.md specifies the whole treatment: scrim fill, 6px backdrop blur, white
 * mono text at `data-sm`, `xs` radius. This is the only context in the system
 * where white text appears outside a primary button, which is the reason it is
 * a component rather than a handful of classes — the exception should exist in
 * exactly one place.
 */
export function OverlayLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.25 rounded-xs bg-scrim px-2.25 py-1 font-mono text-data-sm text-on-scrim backdrop-blur-[6px] ${className}`}
    >
      {children}
    </span>
  );
}
