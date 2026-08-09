const SWATCHES = [
  { name: "paper", className: "bg-paper" },
  { name: "paper-sunk", className: "bg-paper-sunk" },
  { name: "surface", className: "bg-surface" },
  { name: "line", className: "bg-line" },
  { name: "line-strong", className: "bg-line-strong" },
  { name: "clay", className: "bg-clay" },
  { name: "ink-2", className: "bg-ink-2" },
  { name: "ink", className: "bg-ink" },
  { name: "matcha-soft", className: "bg-matcha-soft" },
  { name: "matcha-line", className: "bg-matcha-line" },
  { name: "matcha", className: "bg-matcha" },
  { name: "matcha-deep", className: "bg-matcha-deep" },
];

const TYPE_SCALE = [
  { name: "display", className: "text-display" },
  { name: "headline-lg", className: "text-headline-lg" },
  { name: "headline-md", className: "text-headline-md" },
  { name: "body-prose", className: "text-body-prose" },
  { name: "body-md", className: "text-body-md" },
  { name: "label-lg", className: "text-label-lg" },
  { name: "data-md", className: "font-mono text-data-md" },
  { name: "data-sm", className: "font-mono text-data-sm" },
];

const RADII = [
  { name: "none", className: "rounded-none" },
  { name: "xs", className: "rounded-xs" },
  { name: "sm", className: "rounded-sm" },
  { name: "md", className: "rounded-md" },
  { name: "lg", className: "rounded-lg" },
];

// Half steps out of 10, the way the API stores a rating. Divide by two at the edge.
const RATING = [
  { axis: "umami", halfSteps: 8 },
  { axis: "sweetness", halfSteps: 5 },
  { axis: "astringency", halfSteps: 3 },
];

function RatingBar({ axis, halfSteps }: { axis: string; halfSteps: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="label-axis w-21 shrink-0 text-ink-2">{axis}</span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: 5 }, (_, cell) => {
          const filled = Math.min(Math.max(halfSteps - cell * 2, 0), 2);
          return (
            <div key={cell} className="h-2.5 flex-1 rounded-none bg-paper-sunk">
              <div
                className="h-full bg-matcha"
                style={{ width: `${(filled / 2) * 100}%` }}
              />
            </div>
          );
        })}
      </div>
      <span className="w-8.5 shrink-0 text-right font-mono text-data-md tabular-nums text-ink">
        {(halfSteps / 2).toFixed(1)}
      </span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="label-caps text-clay">{title}</h2>
      {children}
    </section>
  );
}

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-paper-translucent backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-content items-center gap-2 px-6">
          <span className="size-6.5 rounded-full bg-matcha" />
          <span className="font-semibold -tracking-[0.01em]">Matcha Diary</span>
          <span className="ml-auto font-mono text-data-sm text-clay">theme: washi</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-reading space-y-12 px-6 py-12">
        <div className="space-y-4">
          <h1 className="text-display">Design tokens</h1>
          <p className="text-body-lg text-ink-2">
            Every value below is read from <code className="font-mono text-data-md">washi.css</code>{" "}
            through the single <code className="font-mono text-data-md">@theme inline</code> block in{" "}
            <code className="font-mono text-data-md">globals.css</code>. Swap the preset import and
            this page re-themes without a class changing.
          </p>
        </div>

        <Section title="Colour">
          <div className="grid grid-cols-4 gap-3">
            {SWATCHES.map(({ name, className }) => (
              <div key={name} className="space-y-1.5">
                <div
                  className={`h-14 rounded-md border border-line shadow-raised ${className}`}
                />
                <span className="block font-mono text-data-sm text-clay">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type">
          <div className="space-y-4">
            {TYPE_SCALE.map(({ name, className }) => (
              <div key={name} className="flex items-baseline gap-4">
                <span className="w-30 shrink-0 font-mono text-data-sm text-clay">{name}</span>
                <span className={className}>Marukyu Koyamaen, Wako</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Shape">
          <div className="flex flex-wrap gap-4">
            {RADII.map(({ name, className }) => (
              <div key={name} className="space-y-1.5">
                <div
                  className={`size-14 border border-line-strong bg-surface ${className}`}
                />
                <span className="block font-mono text-data-sm text-clay">{name}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Rating">
          <div className="space-y-3 rounded-md border border-line bg-surface p-6 shadow-raised">
            {RATING.map((rating) => (
              <RatingBar key={rating.axis} {...rating} />
            ))}
          </div>
        </Section>

        <Section title="Action">
          <div className="flex flex-wrap gap-3">
            <button className="rounded-sm bg-matcha px-4 py-2.25 text-label-lg text-surface">
              Log a bowl
            </button>
            <button className="rounded-sm border border-line-strong bg-surface px-4 py-2.25 text-label-lg text-ink-2">
              Save
            </button>
            <button className="rounded-sm px-4 py-2.25 text-label-lg text-clay">Edit</button>
          </div>
        </Section>
      </main>
    </>
  );
}
