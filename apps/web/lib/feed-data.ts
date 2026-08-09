/**
 * Placeholder feed content, carried over from the UI prototype at
 * docs/artifacts/ui-prototype/.
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

export type Rating = {
  /** Axis name. Not a fixed vocabulary — an author may name their own. */
  axis: string;
  /**
   * 0–10. Half steps stored as a small integer rather than a float, so storage
   * is exact and comparisons are trivial; divide by two at the edge.
   */
  halfSteps: number;
};

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
  /**
   * The diary body, one string per paragraph. The feed clamps the first
   * paragraph to four lines rather than storing a separate excerpt — two fields
   * would be two things to keep in agreement.
   */
  body: string[];
  /** Taste notes. The feed cuts overflow at four; the detail view shows all. */
  notes: string[];
  /**
   * Sparse, and deliberately so: a review rates whichever axes its author
   * chose, so two reviews of the same cup can rate different things and an
   * empty list is a legitimate review. Nothing is averaged across them.
   */
  ratings: Rating[];
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
    body: [
      "Ordered it thin on purpose — the shop grinds a first-harvest Uji that gets bullied by milk, so I wanted it bare. The front is all cut grass and something like snap peas, then it turns into a long savory tail that coats the roof of the mouth and refuses to leave. Foam held for a full three minutes before it broke.",
      "The water was cooler than I would have gone myself, maybe 70°, and I think that is why the bitterness never arrived. What did arrive was a kind of sweetness that sits underneath the savory rather than next to it, which is the thing I keep chasing and almost never get outside of Kyoto.",
      "Asked what the cultivar was and got a shrug and a smile, which is fair enough for a walk-in on a Tuesday.",
    ],
    notes: ["umami", "cut grass", "nutty", "creamy foam"],
    ratings: [
      { axis: "umami", halfSteps: 9 },
      { axis: "sweetness", halfSteps: 5 },
      { axis: "bitterness", halfSteps: 4 },
      { axis: "astringency", halfSteps: 3 },
      { axis: "aroma", halfSteps: 8 },
      { axis: "aftertaste", halfSteps: 9 },
    ],
    place: "Kettl Tea · Brooklyn",
    photos: [0, 2, 5],
  },
  {
    id: "01924f8a-0002-7000-8000-000000000002",
    author: { name: "Mei", handle: "mei", avatar: 2 },
    postedAt: "5h",
    title: "Koicha tasting flight",
    body: [
      "Three bowls, each thicker than the last. The middle one was the revelation — paint-like body, bitter cocoa up front, and a sweetness that only shows up after you swallow. The third crossed into something I'd call a texture experiment rather than a drink.",
      "Koicha is the only preparation where I understand why people talk about matcha the way they talk about wine. There is nowhere for a bad powder to hide. The first bowl was pleasant and forgettable; the second was the reason I sat down.",
    ],
    notes: ["thick", "cocoa", "slow finish"],
    ratings: [
      { axis: "umami", halfSteps: 10 },
      { axis: "bitterness", halfSteps: 8 },
      { axis: "thickness", halfSteps: 10 },
      { axis: "aftertaste", halfSteps: 9 },
    ],
    place: "Ippodo · Kyoto",
    photos: [4, 6, 1, 3],
  },
  {
    id: "01924f8a-0003-7000-8000-000000000003",
    author: { name: "Arisa", handle: "arisa", avatar: 0 },
    postedAt: "yesterday",
    title: "Home bowl, Marukyu Kohoen",
    body: [
      "Sifted the powder for once and it made an absurd difference — not one lump, not one gritty sip. Deep spinach sweetness, zero scratch on the finish. Water at 72°, whisked flat for twenty seconds then lifted. This is the bar now.",
      "Annoying, because sifting is the step everyone tells you to do and the step everyone skips. I have been skipping it for a year.",
    ],
    notes: ["vegetal", "silky", "no grit"],
    ratings: [
      { axis: "umami", halfSteps: 7 },
      { axis: "sweetness", halfSteps: 7 },
      { axis: "astringency", halfSteps: 1 },
      { axis: "smoothness", halfSteps: 9 },
    ],
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
    body: [
      "Someone handed me a bowl at a friend's place and I had finished it before it occurred to me that this was the kind of thing I write down. Late-harvest, almost certainly cheap, and better than it had any right to be — properly bitter in a way that made the sweetness at the end feel earned rather than added.",
      "No idea what it was and nobody could tell me. Writing it down anyway, because the point of this is the noticing and not the record.",
    ],
    notes: ["bitter", "sweet finish"],
    ratings: [
      { axis: "bitterness", halfSteps: 7 },
      { axis: "sweetness", halfSteps: 6 },
      { axis: "aftertaste", halfSteps: 7 },
    ],
    place: "Home",
    photos: [],
  },
  {
    id: "01924f8a-0005-7000-8000-000000000005",
    author: { name: "Dan", handle: "dan", avatar: 1 },
    postedAt: "2d",
    title: "Oat latte, too much syrup",
    body: [
      "Asked for half sweet and got something closer to dessert. Underneath the syrup there's a chalky, dusty powder that never dissolved and settled into a sludge at the bottom. Drinkable if you stir hard and lower your expectations.",
      "I want to be fair to the place — the room is lovely and the pastry was genuinely good. But if the powder is this dusty, no amount of oat milk is going to rescue it, and the syrup is there to cover exactly that.",
    ],
    notes: ["sugary", "chalky"],
    ratings: [
      { axis: "sweetness", halfSteps: 9 },
      { axis: "bitterness", halfSteps: 1 },
      { axis: "astringency", halfSteps: 2 },
      { axis: "umami", halfSteps: 1 },
    ],
    place: "Café Nordic · Oslo",
    photos: [3, 7],
  },
  {
    id: "01924f8a-0006-7000-8000-000000000006",
    author: { name: "Mei", handle: "mei", avatar: 2 },
    postedAt: "3d",
    title: "Shincha-season usucha",
    body: [
      "First harvest, whisked in front of you at the counter. Aggressively green in a way that tastes like the smell of a cut lawn, then it lands soft and sweet. Queue was forty minutes and I would do it again next week.",
      "There is a specific thing new-season tea does where the aroma arrives before the liquid does. You get it lifting the bowl. Nothing else in the year tastes like this and in six weeks it will be gone.",
    ],
    notes: ["grassy", "sweet finish", "bright", "vegetal", "aroma"],
    ratings: [
      { axis: "aroma", halfSteps: 10 },
      { axis: "sweetness", halfSteps: 7 },
      { axis: "umami", halfSteps: 6 },
      { axis: "astringency", halfSteps: 2 },
    ],
    place: "Sorate · Tokyo",
    photos: [6],
  },
  {
    id: "01924f8a-0007-7000-8000-000000000007",
    author: { name: "Arisa", handle: "arisa", avatar: 0 },
    postedAt: "4d",
    title: "Iced hojicha-matcha split",
    body: [
      "Two layers that never quite met. The hojicha half is toasty and comforting; the matcha sits on top of it looking pretty and tasting like nothing much. Fun photograph, forgettable drink.",
    ],
    notes: ["roasty", "thin"],
    ratings: [
      { axis: "aroma", halfSteps: 5 },
      { axis: "umami", halfSteps: 2 },
      { axis: "aftertaste", halfSteps: 3 },
    ],
    place: "Blue Bottle · Brooklyn",
    photos: [1],
  },
  {
    id: "01924f8a-0008-7000-8000-000000000008",
    author: { name: "Dan", handle: "dan", avatar: 1 },
    postedAt: "6d",
    title: "Sunday morning, borrowed chasen",
    body: [
      "Borrowed a friend's older whisk with half the tines snapped off and somehow got the best foam of the month. Bright, almost lemony, and gone in four sips. Now wondering whether I've been buying the wrong chasen for two years.",
      "Theory: the broken tines are stiffer, so they move more water. I have no evidence for this and I am going to keep believing it.",
    ],
    notes: ["citrus", "light body"],
    ratings: [
      { axis: "aroma", halfSteps: 7 },
      { axis: "sweetness", halfSteps: 6 },
      { axis: "body", halfSteps: 4 },
    ],
    place: "Home",
    photos: [5],
  },
];
