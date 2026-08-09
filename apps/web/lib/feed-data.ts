/**
 * Placeholder feed content, carried over from the UI prototype at
 * docs/artifacts/ui-prototype/index.html.
 *
 * Shapes follow the data model sketched in the stack ADR: an entry is a Review,
 * `notes` are rows in a shared taste-note vocabulary rather than strings on the
 * record, and there is no score field — nothing here averages to a number,
 * because the system has no single number by design.
 *
 * `postedAt` is a display string rather than a timestamp on purpose. The real
 * API sends an ISO date and the relative label gets computed at the edge; baking
 * a fake `Date` into a statically prerendered page would freeze "2h" at build
 * time and read as a bug the first time someone looked twice.
 */

export type FeedEntry = {
  /** UUIDv7 once the API is real. */
  id: string;
  author: {
    name: string;
    handle: string;
    /** Index into the avatar stand-ins. Becomes a storage key. */
    avatar: number;
  };
  postedAt: string;
  title: string;
  excerpt: string;
  /** Taste notes. The feed cuts overflow — see FeedEntry's MAX_NOTES. */
  notes: string[];
  /** Café, or where it was drunk. Uppercased in CSS, not here. */
  place: string;
  /**
   * Indices into the photo stand-ins, cover first. Becomes an ordered list of
   * storage keys.
   *
   * One field rather than a cover plus a count, because two fields can
   * disagree and this one cannot: empty is an entry with no photograph, length
   * 1 is a bare cover, and anything past index 0 is what the overlay counter
   * reports. The ADR's data model hangs Photo rows off a Review with `position`
   * and `is_cover` rather than putting a column on it, so nothing in the schema
   * requires a cover and the feed has to handle its absence.
   */
  photos: number[];
};

export const PLACEHOLDER_FEED: FeedEntry[] = [
  {
    id: "01924f8a-0001-7000-8000-000000000001",
    author: { name: "Arisa", handle: "arisa", avatar: 0 },
    postedAt: "2h",
    title: "Uji Ceremonial, whisked thin",
    excerpt:
      "Ordered it thin on purpose — the shop grinds a first-harvest Uji that gets bullied by milk, so I wanted it bare. The front is all cut grass and something like snap peas, then it turns into a long savory tail that coats the roof of the mouth and refuses to leave. Foam held for a full three minutes before it broke.",
    notes: ["umami", "cut grass", "nutty", "creamy foam"],
    place: "Kettl Tea · Brooklyn",
    photos: [0, 2, 5],
  },
  {
    id: "01924f8a-0002-7000-8000-000000000002",
    author: { name: "Mei", handle: "mei", avatar: 2 },
    postedAt: "5h",
    title: "Koicha tasting flight",
    excerpt:
      "Three bowls, each thicker than the last. The middle one was the revelation — paint-like body, bitter cocoa up front, and a sweetness that only shows up after you swallow. The third crossed into something I'd call a texture experiment rather than a drink.",
    notes: ["thick", "cocoa", "slow finish"],
    place: "Ippodo · Kyoto",
    photos: [4, 6, 1, 3],
  },
  {
    id: "01924f8a-0003-7000-8000-000000000003",
    author: { name: "Arisa", handle: "arisa", avatar: 0 },
    postedAt: "yesterday",
    title: "Home bowl, Marukyu Kohoen",
    excerpt:
      "Sifted the powder for once and it made an absurd difference — not one lump, not one gritty sip. Deep spinach sweetness, zero scratch on the finish. Water at 72°, whisked flat for twenty seconds then lifted. This is the bar now.",
    notes: ["vegetal", "silky", "no grit"],
    place: "Home",
    photos: [2],
  },
  {
    // No photograph. The interface says nothing about the absence — no empty
    // well, no icon, no "no image" label. A written entry is just shorter.
    id: "01924f8a-0004-7000-8000-000000000004",
    author: { name: "Mei", handle: "mei", avatar: 2 },
    postedAt: "yesterday",
    title: "Drank it before I thought to photograph it",
    excerpt:
      "Someone handed me a bowl at a friend's place and I had finished it before it occurred to me that this was the kind of thing I write down. Late-harvest, almost certainly cheap, and better than it had any right to be — properly bitter in a way that made the sweetness at the end feel earned rather than added. No idea what it was and nobody could tell me.",
    notes: ["bitter", "sweet finish"],
    place: "Home",
    photos: [],
  },
  {
    id: "01924f8a-0005-7000-8000-000000000005",
    author: { name: "Dan", handle: "dan", avatar: 1 },
    postedAt: "2d",
    title: "Oat latte, too much syrup",
    excerpt:
      "Asked for half sweet and got something closer to dessert. Underneath the syrup there's a chalky, dusty powder that never dissolved and settled into a sludge at the bottom. Drinkable if you stir hard and lower your expectations.",
    notes: ["sugary", "chalky"],
    place: "Café Nordic · Oslo",
    photos: [3, 7],
  },
  {
    id: "01924f8a-0006-7000-8000-000000000006",
    author: { name: "Mei", handle: "mei", avatar: 2 },
    postedAt: "3d",
    title: "Shincha-season usucha",
    excerpt:
      "First harvest, whisked in front of you at the counter. Aggressively green in a way that tastes like the smell of a cut lawn, then it lands soft and sweet. Queue was forty minutes and I would do it again next week.",
    notes: ["grassy", "sweet finish", "bright", "vegetal", "aroma"],
    place: "Sorate · Tokyo",
    photos: [6],
  },
  {
    id: "01924f8a-0007-7000-8000-000000000007",
    author: { name: "Arisa", handle: "arisa", avatar: 0 },
    postedAt: "4d",
    title: "Iced hojicha-matcha split",
    excerpt:
      "Two layers that never quite met. The hojicha half is toasty and comforting; the matcha sits on top of it looking pretty and tasting like nothing much. Fun photograph, forgettable drink.",
    notes: ["roasty", "thin"],
    place: "Blue Bottle · Brooklyn",
    photos: [1],
  },
  {
    id: "01924f8a-0008-7000-8000-000000000008",
    author: { name: "Dan", handle: "dan", avatar: 1 },
    postedAt: "6d",
    title: "Sunday morning, borrowed chasen",
    excerpt:
      "Borrowed a friend's older whisk with half the tines snapped off and somehow got the best foam of the month. Bright, almost lemony, and gone in four sips. Now wondering whether I've been buying the wrong chasen for two years.",
    notes: ["citrus", "light body"],
    place: "Home",
    photos: [5],
  },
];
