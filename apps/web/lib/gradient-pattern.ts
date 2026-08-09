/**
 * Seeded gradient patterns — the picture a photograph is drawn as until real
 * uploads land.
 *
 * "Random" here means *varied*, never *nondeterministic*: one seed always
 * yields one pattern. It has to, twice over. The value is computed while the
 * page renders on the server and again when React hydrates it, so a
 * `Math.random()` in this file would hydrate to a different picture than it
 * painted; and one photo appears in both the timeline and the open review,
 * where two pictures for one seed would read as two different photographs.
 *
 * Everything here stays inside the green-to-beige band DESIGN.md reserves for
 * upload stand-ins. These are stand-ins for `<img>`, not palette members: do
 * not derive a token from a value in this file, and do not reach for one as a
 * decorative fill.
 */

/** The band, beige through matcha green. No stop leaves it. */
const HUE_BEIGE = 83;
const HUE_MATCHA = 152;

/**
 * The four shapes a stand-in can take. Kind is drawn from the seed too, so two
 * placeholders differ in structure and not only in colour.
 *
 * Listed with repeats rather than picked uniformly: a wash and a bloom read as
 * a photograph out of focus, while a sweep and a set of bands read as drawn
 * artwork. Weighting keeps the loud two occasional — a wall of them would make
 * the timeline look decorated, which is the one thing DESIGN.md never wants.
 */
const PATTERNS = [
  "wash",
  "wash",
  "bloom",
  "bloom",
  "bloom",
  "sweep",
  "strata",
] as const;

/**
 * The soft top-left sheen every prototype photo carried, kept verbatim as the
 * topmost layer. It is the one thing every stand-in shares — the light is
 * always coming from the same window.
 */
const SHEEN =
  "radial-gradient(120% 90% at 30% 15%, oklch(1 0 0 / 0.30), transparent 60%)";

/**
 * A stop, held as numbers rather than as a string so a layer can re-emit the
 * same colour at alpha 0. Fading to `transparent` instead would interpolate
 * through transparent *black* and leave a grey bruise around every blob.
 */
type Tone = readonly [lightness: number, chroma: number, hue: number];

type Random = () => number;

/** `oklch(L C H)` at the precision CLAUDE.md fixes: L and C to 4, H to 2. */
function css([lightness, chroma, hue]: Tone, alpha?: number): string {
  const value = `${lightness.toFixed(4)} ${chroma.toFixed(4)} ${hue.toFixed(2)}`;
  return alpha === undefined
    ? `oklch(${value})`
    : `oklch(${value} / ${alpha.toFixed(2)})`;
}

/**
 * mulberry32. Hand-rolled rather than pulled in, because the requirement is
 * not statistical quality but that server and browser agree on every bit —
 * and because sequential seeds have to diverge immediately. The feed hands out
 * 0, 1, 2, …, which a plain LCG would turn into eight near-identical pictures.
 */
function seededRandom(seed: number): Random {
  let state = seed | 0;

  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const between = (random: Random, min: number, max: number) =>
  min + random() * (max - min);

/** `between`, rounded — for the degrees and percentages CSS reads. */
const step = (random: Random, min: number, max: number) =>
  Math.round(between(random, min, max));

const pick = <T,>(random: Random, options: readonly T[]): T =>
  options[Math.floor(random() * options.length)];

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Chroma is derived, not drawn: the beige end of the band is nearly neutral
 * and the green end is not, so one fixed C makes pale greens look acid and
 * beiges look tinted. It also falls off as L rises, which is how a real
 * highlight behaves.
 */
function tone(random: Random, lightness: number, hue: number): Tone {
  const green = (hue - HUE_BEIGE) / (HUE_MATCHA - HUE_BEIGE);
  const chroma =
    (0.022 + 0.09 * green) * (1.15 - 0.55 * lightness) * between(random, 0.9, 1.1);

  return [lightness, clamp(chroma, 0.01, 0.1), hue];
}

/**
 * Three stops, and they deliberately do NOT hold one hue. CLAUDE.md's rule —
 * two shades of one colour disagreeing on H is a bug — is about ramps built
 * from a token. This is a photograph: light falling across a bowl of tea
 * shifts hue as it darkens, and a stand-in that held H flat would read as a
 * swatch. Nothing downstream may treat these as shades of one colour.
 */
function ramp(random: Random) {
  const near = between(random, HUE_BEIGE, HUE_MATCHA);
  const drift = between(random, 6, 26) * (random() < 0.5 ? -1 : 1);
  const far = clamp(near + drift, HUE_BEIGE, HUE_MATCHA);

  return {
    light: tone(random, between(random, 0.86, 0.95), near),
    mid: tone(random, between(random, 0.66, 0.79), (near + far) / 2),
    dark: tone(random, between(random, 0.4, 0.58), far),
  };
}

/** The layers of one pattern, topmost first — the order `background-image` wants. */
function layers(random: Random): string[] {
  const { light, mid, dark } = ramp(random);
  const kind = pick(random, PATTERNS);

  switch (kind) {
    // A single fall of light across the frame. The calmest of the four, and
    // the closest to the eight gradients the prototype shipped with.
    case "wash":
      return [
        `linear-gradient(${step(random, 110, 250)}deg, ${css(light)} 0%, ${css(mid)} ${step(random, 40, 60)}%, ${css(dark)} 100%)`,
      ];

    // Two off-centre blooms over a base — the mesh look. Reads as a lit
    // subject sitting somewhere other than dead centre.
    case "bloom":
      return [
        `radial-gradient(${step(random, 70, 120)}% ${step(random, 60, 110)}% at ${step(random, 10, 45)}% ${step(random, 8, 40)}%, ${css(light)}, ${css(light, 0)} 62%)`,
        `radial-gradient(${step(random, 80, 130)}% ${step(random, 70, 120)}% at ${step(random, 55, 95)}% ${step(random, 60, 95)}%, ${css(mid)}, ${css(mid, 0)} 66%)`,
        `linear-gradient(${step(random, 120, 240)}deg, ${css(mid)} 0%, ${css(dark)} 100%)`,
      ];

    // A turn of light around a point. First and last stop are the same tone
    // so the 0°/360° seam is continuous rather than a visible edge.
    case "sweep":
      return [
        `conic-gradient(from ${step(random, 0, 359)}deg at ${step(random, 25, 75)}% ${step(random, 20, 70)}%, ${css(dark)}, ${css(mid)}, ${css(light)}, ${css(mid)}, ${css(dark)})`,
      ];

    // Soft bands, sized in percentages rather than pixels so a 64px thumbnail
    // and a 600px cover show the same number of them.
    case "strata": {
      const band = step(random, 6, 13);
      return [
        `repeating-linear-gradient(${step(random, 150, 210)}deg, ${css(light, 0.34)} 0%, ${css(dark, 0.2)} ${band}%, ${css(light, 0.34)} ${band * 2}%)`,
        `linear-gradient(${step(random, 120, 240)}deg, ${css(mid)} 0%, ${css(dark)} 100%)`,
      ];
    }
  }
}

/**
 * The `background-image` for one seed. Any integer is a valid seed; the feed's
 * photo indices are just the ones in use today.
 */
export function gradientPattern(seed: number): string {
  const random = seededRandom(seed);
  return [SHEEN, ...layers(random)].join(", ");
}
