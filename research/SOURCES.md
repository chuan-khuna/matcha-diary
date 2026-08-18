# Sources

Starting points for the cultivar research in `research/cultivars/`. Per-cultivar sources live in
each record's `sources:` frontmatter; this file lists the hubs — pages covering many cultivars
that are worth returning to.

## Seed sources

- https://myjapanesegreentea.com/sugiyama-hikosaburo-the-discoverer-of-yabukita
- https://japaneseteasommelier.wordpress.com/2022/08/22/the-japanese-tea-cultivars/
- https://fareastteacompany.com/blogs/fareastteaclub/tagged/types-cultivar
- https://www.teanursery.com/tag/cultivar/
- https://japanesetea.sg/japanese-tea-pedia/cultivars/
- https://japanesetea.sg/japanese-tea-pedia/cultivars/how-the-cutting-changed-everything-the-birth-of-japanese-tea-cultivars/
- https://unearthed-gallery.com/blogs/founders-blog/matcha-cultivars
- https://ujicha.or.jp/en/knowledge/flow/hinshu/
- https://przyprawyimatcha.pl/en-world/blogs/news/roznice-miedzy-odmianami-matchy
- https://www.ocha.tv/how_tea_is_made/plants_and_breeds/plants_and_breeds_japanesetea/
- https://www.teanursery.com/japanese-tea-cultivars/

## Trade-body and institutional sources

Closest thing to a primary source available in English, and they outrank the vendor blogs on
anything factual.

- **宇治茶の品種 / Uji tea cultivars** — 京都府茶業会議所 (Kyoto Prefectural Tea Chamber of
  Commerce and Industry), the official Uji tea trade body.
  https://ujicha.or.jp/knowledge/flow/hinshu/ (Japanese)
  https://ujicha.or.jp/en/knowledge/flow/hinshu/ (English)
  Authoritative on the Uji tencha and gyokuro cultivars, and the only source found so far that
  gives their **strain names and named individual breeders**: Asahi = 平野11号, selected by
  平野甚之丞 Hirano Jinnojo; Samidori = 小山69号, selected by 小山政次郎 Koyama Masajiro;
  Ujihikari = 京研170号; Gokou = 京研166号; Ujimidori = 京研307号; Houshun = 53-7 and Tenmyo =
  53-38, both Samidori natural-hybrid seedlings registered 2006.

  **Read the Japanese page, not the English one.** The English translation runs the cultivar
  names through a translator, so they come out as English words. Verified against the raw HTML
  of the English page, the headings are:

  | English page | Actual cultivar |
  |---|---|
  | Asahi | あさひ Asahi |
  | Samidori | さみどり Samidori |
  | Ujihikari | うじひかり Ujihikari |
  | **Exhibition** | 展茗 Tenmyo (展 = exhibit, 茗 = tea) |
  | **Let's go** | ごこう Gokou (ご = go, こう → "kou") |
  | **Magnolia** | うじみどり Ujimidori |
  | Hoshun | 鳳春 Houshun |

  Note also that the English page's era conversions cannot be trusted: it renders 昭和52年
  (1977) as "1952". Take dates from the Japanese page.

  It also dates Ujimidori to 1983 (昭和58年) against the Japanese Tea Sommelier list's 1985.
  The trade body is the better source here.

- **About / 堀井七茗園** — Horii Shichimeien, Uji producer.
  https://horiishichimeien.com/en-sb/blogs/topics/about
  A grower rather than a reference site, but a primary source for cultivars it selected itself,
  and the only place several of these facts appear:

  - **Narino** (成里乃) — selected over **20 years from 600-year-old native plants in the
    Okunoyama tea garden**, and claimed to carry nearly **twice the theanine** of conventional
    cultivars.
  - **Okunoyama** (奥ノ山) — propagated from a **400-year-old mother tree**; very deep green,
    described as resembling "natural gyokuro".
  - **Mumon** (無門) — a matcha made from Asahi, first planted Reiwa 1 (2019). A product name
    rather than a cultivar; do not file it as one.

  Also useful on Uji practice: the house invented **Japan's first tencha drying machine in 1924**,
  has held the Okunoyama garden for 600+ years, and stone-mills all its matcha.

  **The `/about` page is not the whole site.** There is a seven-part house history at
  `https://horiishichimeien.com/en-sb/pages/story<N>`, `N` = 1–7, and **chapter 4, "Tea plants
  with a history of 600 years"** (https://horiishichimeien.com/en-sb/pages/story4) is the
  cultivar one. It is far more detailed than `/about` and is the primary source for the Narino
  and Okunoyama selection programme:

  - Selection began **1981**, run by **Nobuo Horii** (fifth generation) observing every plant in
    the garden annually, from handwritten notes recording taste, aroma, shoot count, weight and
    yield.
  - The funnel, in the house's own words: **~2,000 native plants → 58 → 24 → 8 → 2 final
    candidates in 1994**, trialled, then registered **2002**.
  - Until the **1970s** the Okunoyama garden was entirely native plants — about 2,000, planted
    island-fashion. Nobuo replanted rather than clear it, selecting out of the existing stock
    precisely so the zairai line would survive.
  - **Narino is for tencha, Okunoyama for gyokuro** — a split neither is always given elsewhere.
  - **Narino took the Minister of Agriculture, Forestry and Fisheries Award at the 64th National
    Tea Competition, Nara, 2010.**
  - The **400-year-old mother tree is Okunoyama's own** original plant and still stands in the
    garden.

  This page overturned a fabrication warning that stood in this file — see *The draft records in
  `example/` are not authoritative* below.

  Caveat: theanine and tree-age claims are the producer's own and are not independently verified
  here. Attribute them rather than stating them flatly. That applies to the funnel figures too —
  they are now sourced, but the source is the house itself.

- **品種特性表 (cultivar characteristics table)** — 京都府茶業会議所, PDF.
  https://ujicha.or.jp/wp-content/themes/kyotocha/assets/files/hinsyutokusei.pdf
  The trade body's tabulated characteristics for the Uji cultivars — the data behind the prose
  on its cultivar page. Not linked from the English site.

- **宇治品種について** — 京都府茶業研究所 (Kyoto Prefectural Tea Research Institute), via Kyoto
  Prefecture's official site.
  https://www.pref.kyoto.jp/chaken/mame_ujihinnshu.html
  The breeding institute's own account of the Uji cultivars, and the counterpart to the trade
  body's page above. Names the selecting growers — Hirano Jin'nojō for Asahi *and* Komakage,
  Koyama Masajirō for Samidori. Found independently by two agents researching different
  cultivars, which is usually a sign a source is load-bearing.

- **茶の品種** — O-CHA NET, World Green Tea Association.
  https://www.o-cha.net/teacha/hinshu/
  A different site from ocha.tv below, despite the similar name — this one is the industry
  association's.

  **Per-cultivar pages follow `https://www.o-cha.net/teacha/hinshu/<romaji>.html`** — e.g.
  `…/hinshu/yamanoibuki.html`. These reprint the Shizuoka Prefectural Tea Industry Council's
  trade journal 『茶』, and carry budding time, tree and leaf morphology, disease resistance, cup
  quality and even steaming-time guidance. One of the richest characteristics sources available,
  and directly addressable without search.

- **Japanese Green Tea Cultivars** — O-CHA NET, published by Ito En (伊藤園).
  https://www.ocha.tv/how_tea_is_made/plants_and_breeds/plants_and_breeds_japanesetea/
  Quotes every cultivar's maturation **in days relative to Yabukita**, which is the convention
  these records use, so it is the cleanest source for `buddingTime`. Yutakamidori −5, Saemidori
  −4, Sakimidori −1, Kanayamidori +4, Okumidori +8. Also the only source found so far that
  separates Yabukita's **prefectural** registration (1945) from its **national** one (1953).

  Two conflicts it introduces. It dates **Seimei** to 2017 where the Sommelier list says 2020 —
  plausibly registration application versus publication, still to be resolved.

  The Seimei conflict is now settled, and it resolves into **three** dates rather than two:
  application filed 2016-06-30, application publicly announced **2017**-01-30 (Ito En's date),
  registration granted **2020**-03-30 (the Sommelier list's). Neither source was wrong; each
  quoted a different milestone. Records carry all three in separate fields.

  The second is now settled: ocha.tv's **はるのなごり Haru-no-nagori** and the Sommelier list's
  "Haru-no-nagomi" are the same cultivar, and **なごり is the correct reading** — Shinkoju also
  gives はるのなごり, with the same Saitama 1 × Miyazaki 8 parentage. The Sommelier list's
  "nagomi" is a misreading. Record it as Haru-no-nagori. (The two sources still differ on year:
  2008 vs 2012.)

- **Japanese Tea Cultivars** — Tea Nursery.
  https://www.teanursery.com/japanese-tea-cultivars/
  Not a cultivar reference in itself — it is an in-progress aggregated dataset (self-described
  as ~70% complete, spreadsheet behind a sign-up). Its real value is that it **documents its own
  sources**, which is how the primary-source list below was assembled. Worth revisiting as it
  fills out.

## Registry and reference hubs

- **The Japanese tea cultivars** — Japanese Tea Sommelier.
  https://japaneseteasommelier.wordpress.com/2022/08/22/the-japanese-tea-cultivars/
  The master list: ~110 cultivars split by tea type (sencha, kamairicha, gyokuro/tencha, black
  tea, non-registered), each with parentage and registration year. The spine of this research —
  nothing else has comparable coverage.

  **But it carries errors of parentage, not only of date**, and because it is the spine those
  errors propagate. Confirmed against release papers:

  - **Nagomiyutaka is not a Kyoken 283 descendant.** The list gives Saitama No. 1 × Kyoken 283;
    its own 2014 release paper (Yoshidome et al.) gives **Saitama No. 16 × Fuku 8**, crossed
    1988, and never mentions either claimed parent.
  - **Miyamakaori's registration is 2003**, not 2006 as listed.
  - **Meiryoku** is listed as Yabukita × Z1; its 1987 release paper gives Yabukita × Yamatomidori.
  - **Benikaori** is dated 1960 alongside Benifuji; MAFF's own list gives Benikaori as 昭和29
    (1954).
  - Registration years are frequently the wrong milestone — see the two-registry and 育成/登録
    notes below.

  Use it to *enumerate* cultivars, which is what it is uniquely good for. Do not take a parent or
  a year from it without corroboration.

- **Shizu-Inzatsu 131, an historical cultivar** — Japanese Tea Sommelier, 24 January 2017.
  https://japaneseteasommelier.wordpress.com/2017/01/24/shizu-inzatsu-131-an-historical-cultivar/
  Same author as the master list above, but a different kind of document — a narrative history
  rather than a table, and the master list's weakness (dates and parentage) is not what this is
  for. It is the fullest account found in English of **how the 印雑 lines came about and who made
  them**, and it carries several facts that connect entries elsewhere in this file:

  - **Two independent 印雑 lineages, not one.** The *Tada* hybrids — Tada Motokichi 多田元吉, sent
    to China and India, crossing for **black** tea, of which Benihomare is the famous one and
    later Benifuki's parent — are a separate programme from Inzatsu 131, which descends from
    **Maruo Fumio 丸尾文雄's** 1922 expedition to India, Sri Lanka and Java. Sources that treat
    "inzatsu" as one thing are collapsing two.
  - **Maruo died of a tropical disease in Taiwan on the return journey.** The Manipuli seeds
    reached Shizuoka; he did not. They were planted at the prefectural research centre and
    numbered 1–90.
  - **Arima Toshiharu 有馬利治 (1912–1999)** is the through-line. Black-tea cultivar work at the
    Miyazaki centre from 1938, transferred to Shizuoka in 1942, selected Inzatsu 131 from a
    Manipuli No. 15 seedling in 1944, and **also originated the 静7000 series** — so the
    `静7000` entry under *Decoding breeding-line designations* below and Inzatsu 131 are the same
    man's work, which no other source consulted joins up. He left the centre in 1960.
    **Morizono Ichiji**, co-developer of Fuji-kaori, was one of his followers.
  - **It was bred as a green-tea cultivar, not a black one**, despite the Assam parentage. The
    post quotes period documents describing it as very early budding, weak to cold and disease,
    with a very particular perfume, suited to sencha and tamaryokucha.
  - **Benihomare is Cha Norin No. 1** — the first entry in the 1953 registry.
  - Names the two houses still making single-cultivar Inzatsu 131: **Koyanagi Tsutomu** in
    Fujieda (kamairicha, and Fuji-kaori kamairicha too) and **Tarui of Nearaimatsu-Meichaen** in
    Nearai, Hamamatsu (fukamushi sencha, on an Akitsu line built to Arima's hot-air method).

  Caveats. The author sells the teas he is writing about — the post links his own shop — so treat
  the tasting and the house history as a merchant's account. The biography is unsourced on the
  page and is not independently verified here; attribute it rather than stating it flat. One
  sentence is ambiguous in translation from the French: it has Arima both directing the centre
  and being pushed out of it, and the post does not say which came first. And it writes
  **Manipuli** where this corpus writes Manipuri — the same Assam line, not two.

- **Japanese Tea Cultivar List** — My Japanese Green Tea.
  https://www.myjapanesegreentea.com/japanese-tea-cultivar-list
- **Japanese Tea Pedia — Cultivars** — Japanese Tea Singapore.
  https://japanesetea.sg/japanese-tea-pedia/cultivars/
  Individual pages for Yabukita, Saemidori, Asatsuyu, Tsuyuhikari, Gokou, Okuyutaka, Okumidori
  and Asahi, plus a good piece on why cutting propagation created the cultivar system at all.
- **Cultivated Varieties of Japanese Tea** — d:matcha Kyoto.
  https://dmatcha.com/blogs/tea-cultivar-dictionary/cultivated-varieties-of-japanese-tea
  A cultivar dictionary written from inside Wazuka, Kyoto — strong on the Uji tencha cultivars.
- **d:matcha Cultivar Guide** — d:matcha Kyoto.
  https://dmatcha.com/pages/d-matcha-cultivar-guide
  A grower-side companion to the dictionary above, rating cultivars on umami / bitterness /
  colour / aroma — a tasting-oriented framing that suits a diary better than a registry does.
  As fetched, only the **Gokou** entry is populated (umami ★★★★☆, bitterness ★☆☆☆☆, colour
  ★★★★☆, aroma ★★★★★, for tencha and sencha); Samidori and Ujihikari are named without detail,
  so the sections are likely lazy-loaded. Worth re-checking. Its general point is useful context
  for the Kyoto cultivars: Wazuka and Uji growers select for taste over yield — deep umami, soft
  sweetness, low bitterness — which is why so many Kyoto cultivars are low-yielding and
  hand-picked.
- **Cultivars of Tea for Tencha (Matcha) Production in the Uji Area** — Matcha Direct, Kyoto.
  https://matchadirect.kyoto/blogs/matcha-101/cultivars-of-tea-for-tencha-matcha-production-in-the-uji-area
  Specifically the tencha side: Asahi, Gokou, Ujihikari, Samidori, Ujimidori.
- **Befriending Japanese Tea Cultivars** — Yunomi.
  https://yunomi.life/blogs/japanese-tea-guide/befriending-japanese-tea-cultivars
- **Discovering the Diversity of Japanese Green Tea Cultivars** — Senbird Tea.
  https://senbirdtea.com/blogs/green-tea/japanese-green-tea-cultivars-and-characteristics
- **Understanding Matcha Tea Cultivars** — Kyo Hayashiya.
  https://kyohayashiyamatcha.com/blogs/journal/understanding-matcha-tea-cultivars-a-guide-for-tea-enthusiasts
- **Matcha Cultivars — Japanese Tea Varieties Explained** — Unearthed Gallery.
  https://unearthed-gallery.com/blogs/founders-blog/matcha-cultivars
- **Understanding Tea Cultivars** — Japanese Green Tea Co.
  https://www.japanesegreenteain.com/blogs/green-tea-and-health/what-is-tea-cultivar
- **Różnice między odmianami matchy** — Royal Brand (Poland).
  https://przyprawyimatcha.pl/en-world/blogs/news/roznice-miedzy-odmianami-matchy
  Matcha-facing cultivar comparison: Samidori, Okumidori, Saemidori, Kurasawa, Asahi, Gokou,
  Yabukita. Useful for flavour description and for the rarely-documented Kurasawa. A retailer,
  so weak on facts — it puts Yabukita at 85% of production and gives Saemidori's registration as
  1990 #40, both of which conflict with better sources.

## Primary sources

Registration numbers, breeding chronologies and trial data are far better documented in Japanese
than in English — most of it exists in no English source at all.

### Search keywords (Japanese)

**`茶の品種`** is the primary search term — the standard Japanese phrase for "tea cultivar", and
the one that surfaces the reference pages, prefectural bulletins and shop directories that carry
real data. Start every cultivar search with it.

Then narrow:

| Keyword | Finds |
|---|---|
| `茶の品種` | the general entry point — use this first |
| `茶農林<N>号` | the MAFF national registration for a specific cultivar |
| `<かな name> 茶 品種 特性` | that cultivar's characteristics |
| `<かな name> 育成` | its breeding history and release paper |
| `品種茶` | single-cultivar teas as sold — good for flavour and availability |
| `系統名` | the pre-naming breeding-line designation (S6, Z1, 京研170号) |
| `自然交雑実生` | open-pollinated seedling — distinguishes these from controlled crosses |
| `在来` (zairai) | landrace/native seed-grown tea |
| `育成者` | the breeder, named individual or station |
| `萌芽期` | budding time |
| `農林水産省 品種登録` | Plant Variety Protection registrations |

Write the name in **kana** rather than romaji — search engines match it far better, and many
cultivars have no settled kanji form at all.

### Registries

- **茶品種ハンドブック / Tea Cultivar Handbook** — 農研機構 NARO.
  https://www.naro.go.jp/publicity_report/publication/files/cha_hinshu_handbook06.pdf
  **The authority on lineage.** Contains detailed pedigree charts for the registered cultivars,
  which is exactly what this project needs and what the vendor blogs get wrong. It already
  overturned one claim: flattened registry tables credit Sayamakaori as an ancestor of
  Musashikaori and Miyamakaori, but NARO's charts trace both through the similarly-named and
  unrelated **Sayamamidori** (茶農林5号). When a lineage claim is contested, this settles it.
- **茶農林登録品種一覧** — MAFF's national tea cultivar registry table.
  The direct confirmation route for a Cha Norin number, registration year, prefecture and the
  cultivar's former breeding-line designation (Sayamakaori was line G15613 before naming).
- **品種登録データベース** — MAFF variety registration database.
  https://www.hinshu2.maff.go.jp/vips/cmm/apCMM110.aspx
  (portal: https://www.maff.go.jp/j/shokusan/hinshu/)

  **Direct lookup by registration number**, which avoids the search form entirely:
  `https://www.hinshu2.maff.go.jp/vips/cmm/apCMM112.aspx?TOUROKU_NO=<N>&LANGUAGE=Japanese`
  Fetch the **raw HTML**; the rendered summary has fabricated a field value here at least once.

  **Searching by name requires a POST.** The search page is ASP.NET WebForms, not a plain GET —
  a normal fetch of the URL returns only the empty form. Drive it with `curl`: request the page,
  scrape the `__VIEWSTATE` and `__EVENTVALIDATION` hidden fields, then POST them back with the
  cultivar name. This is how Okunoyama's and Narino's records were recovered.

  **The Japanese variety-name field is unreliable.** One agent got it working by writing the term
  to a UTF-8 file and passing `--data-urlencode <field>@<file>` (which is how Kiyoka's record, No.
  28148, surfaced). Another found the field corrupted Japanese input *server-side* — reflected
  back as `???` — under UTF-8, Shift-JIS, EUC-JP and ISO-2022-JP alike.

  **The reliable route avoids the name field entirely:** query the **species** field, which
  accepts only the exact scientific name `Camellia sinensis (L.) Kuntze` (obtainable from the
  picker popup at `apCMM110_1.aspx`), combined with an **application-date range**, then read the
  result table. No Japanese text input required. That is how Seimei's record was found.

  What it yields is the best registration evidence available anywhere: registered-variety number,
  application number, **filing and registration dates separately**, the named applicant (often an
  individual grower rather than a station), the statutory term, whether the breeder's right has
  **lapsed early**, and a full DUS trait description including budding time. Consecutive
  registration numbers also evidence sibling filings — Narino is No. 10751 and Okunoyama No.
  10752, filed and granted the same days.
  The authority for anything registered under the Plant Variety Protection Act rather than the
  older 茶農林 system — Kirari 31, Haruto 34, Kiyoka, Seimei, Danshin 37 and the other post-2000
  cultivars. Gives applicant, application date, registration date and the official trait
  description.
- **AgriKnowledge** — integrated search across MAFF's research databases.
  https://agriknowledge.affrc.go.jp/
  The way into agricultural research reports that are not otherwise indexed.
- **農研機構 / NARO** — https://www.naro.go.jp/
  Successor to the vegetable and tea research institute that bred most 茶農林 cultivars.
- **国立国会図書館サーチ / NDL Search** — https://ndlsearch.ndl.go.jp/

### Journals

- **茶業研究報告 / Tea Research Journal** — Japanese Society of Tea Science and Technology,
  running since 1953, open access on J-STAGE.
  https://www.jstage.jst.go.jp/browse/cha/list/-char/en
  **The pre-1990s archive is a separate collection** and is where the early 茶農林 registration
  bulletins live: https://www.jstage.jst.go.jp/browse/cha1953/-char/ja
  Search both. Asagiri's 1954 registration bulletin (茶業研究報告 No. 4) and Himemidori's 1961
  one (No. 17) were both recovered this way, each giving detail that exists in no English source.

- **茶の品種登録と命名** (Tea cultivar registration and naming), 茶業研究報告 No. 2, 1953.
  https://www.jstage.jst.go.jp/article/cha1953/1953/2/1953_2_95/_article/-char/en
  **The founding document of the whole 茶農林 system**, and the single highest-value source
  found for this project. It covers all fifteen cultivars of the inaugural 1953 registration
  round in one paper — origin, characteristics *and the rationale for each name* — which means
  it is the primary source for Yabukita (No. 6), Miyoshi (No. 3), Sayamamidori, Makinohara-wase,
  Koyanishi, Rokuro, Yamatomidori, Asatsuyu, Tamamidori, Takachiho, Benihomare, Indo,
  Hatsumomiji, Benitachiwase and Akane simultaneously.

  **Reading it:** it is a scan, and WebFetch cannot OCR it. Download the PDF and open it with the
  Read tool, which extracts the page images directly.

- **茶業研究報告 No. 4** (1954) — the second registration round.
  DOI 10.5979/cha.1954.4_76
  The sequel to the above, covering the 1954 cultivars: Natsumidori (茶農林16号), Asagiri
  (茶農林18号), Kyomidori (茶農林19号), Yaeho, Hatsumidori and their cohort. Same scan caveat.

  Between them, these two papers are the primary source for essentially every cultivar registered
  in the system's first two years, and they carry the 命名の由来 (naming rationale) field that no
  secondary source reproduces. That field has already settled two questions this project could
  not answer any other way: that Koyanishi means "west of the hut" (Sugiyama's landmark-naming
  habit, the same as Yabukita's "north of the bamboo grove"), and that Natsumidori is named for
  holding quality through the **summer flush**, not for budding late.
  **The single best primary source for this project.** Cultivar release papers are published
  here: crossing dates, strain designations, regional adaptation trial tables, yield figures in
  kg/10a, disease incidence rates. The kind of detail in the Kirari 31 record comes from papers
  like these.
- **J-STAGE** — https://www.jstage.jst.go.jp/browse/-char/en

  **Full-text search endpoint**, fetchable directly and independent of any web-search quota:
  `https://www.jstage.jst.go.jp/result/global/-char/en?globalSearchKey=<term>`
  Put the cultivar's **kana** name or its breeding-line designation in `<term>`. This is the
  practical way to find a release paper when general web search is unavailable, and it reaches
  material no English source indexes at all.

### University and station publications

- **University of Shizuoka, Tea Science Centre** — https://dfns.u-shizuoka-ken.ac.jp/labs/tsc/
  Publishes per-cultivar PDF sheets, e.g. `…/pdf/03/0308_kosyun.pdf` for Koshun. These carry
  crossing years, strain designations and trial data. Read the PDF pages directly; the Koshun
  fabrication above came from trusting a summary of exactly this file.
- **furusato-tanegashima.net** — https://www.furusato-tanegashima.net/nougyou/n-otya.html
  Local Tanegashima agricultural pages, the only source found for the island's tea history and
  the origin of Kuritawase.

### Books

Not online; noted for anyone able to reach a copy.

- **茶の品種** (Tea Cultivars), Shizuoka Prefectural Tea Industry Association, 2019.
- **茶の事典** (Encyclopedia of Tea), ed. Ōmori Masashi, Asakura Shoten, 2017.
- **Japanese Tea Cultivars: A Comprehensive Guide** (9th update), Japanese Tea Sommelier —
  the book behind the blog's master list.

### Japanese trade and retailer references

- **茶の品種** — 市川園 茶の博物館 (Ichikawaen tea museum).
  https://museum.ichikawaen.co.jp/knowledge/variety.php
- **静岡茶 — 品種** — https://shizuoka-cha.com/index.php/ocha/shinshu
  Shizuoka's own cultivar pages. Shizuoka bred a large share of the registry (Yabukita,
  Okuhikari, Sofu, Tsukasamidori, Yaeho, Makinohara-wase), so this is the regional counterpart
  to Kyoto's 茶業研究所 page.
- **品種茶一覧** — 心向樹 (Shinkoju), Saitama.
  https://www.shinkoju.com/知る-見る-学ぶ/品種茶の話/品種茶一覧/
  Individual pages at `/品種茶/<かな name>/` — e.g. `/品種茶/あさつゆ/`, `/品種茶/そうふう/`.

  **The broadest cultivar-by-cultivar reference found so far**, from a shop that describes itself
  as Japan's first specialising in single-cultivar teas (品種のお茶). Around 80 entries with
  registration year, parentage, characteristics and region; a number are still marked 編集中
  (under edit), so re-check it over time.

  Its particular value is that it **covers cultivars missing from every other list**, including
  the Japanese Tea Sommelier registry this project is built on:

  - さやまあかり **Sayama Akari** (2018, 60F1-148 × Sayamakaori) — a modern Saitama cultivar
  - 英之介 **Hidenosuke**, しまみどり **Shimamidori**, 茂2号 **Shige No. 2**
  - 青心烏龍 **Qingxin Oolong** and 青心大パン **Qingxin Dapan** — Taiwanese cultivars grown in
    Japan, a category nothing else here covers
  - 印雑131 **Inzatsu 131** and **Z1** get their own pages, which is useful because they appear
    only as parent designations elsewhere

  It also supplies facts nothing else did: Inaguchi was privately bred by **Inaguchi Katsutoshi**
  in Shizuoka; 静7132 Shizu-7132 is known locally as "Machiko" in Shimizu; Koju has a
  muscat-like aroma.

  **Get URLs from `https://www.shinkoju.com/sitemap.xml`, do not construct them.** The sitemap
  lists 97 cultivar pages, and the slugs are irregular in three ways that make guessing fail:
  full-width digits (`きらり３１`, `静７１３２`, `印雑１３１`), a `-1` suffix on some
  (`べにほまれ-1`, `宇治ひかり-1`, `さやまかおり-1`), and kanji rather than kana on others
  (`摩利支`, `山の息吹`, `松寿`, `香駿`, `英之介-ひでのすけ`).

  The site is also JS-rendered and hostile to direct crawling: **every page returns the same
  `<title>` (普通煎茶)** regardless of URL, and agents have had it serve the generic homepage to
  both `curl` and WebFetch. When that happens the content is usually recoverable from a **Wayback
  Machine snapshot** (`http://archive.org/wayback/available?url=…`), which is how one agent got
  the Harumidori entry. Some pages are also product listings or 編集中 stubs with empty
  品種/来歴/主産地 fields — genuinely empty, not a fetch failure.

  It also has **wrong links**: the index entry for きよか (Kiyoka) points at きょうみどり
  (Kyomidori)'s page, and the kanji slug 雲海 silently redirects to a news article instead of
  404ing. So a Shinkoju page can be the wrong cultivar's while looking perfectly valid — check
  that the content names the cultivar you asked for.

  The sitemap also reveals cultivars and lines not in any list used here: **はるな Haruna**,
  **ゆめすみか Yumesumika**, **森1号 Mori No. 1**, and the bare breeding-line pages `z-1`,
  `ca278` and `n-35-1`.

  Treat its dates with care — it disagrees with the Sommelier list on Fukumidori (2003 vs 1988),
  Shunmei (1988 vs 1990) and Ryofu (1997 vs 2001), and gives Hokumei's second parent as Saitama
  13 rather than 5507.

- **日本茶の品種について** — 茶の庭 (Cha no Niwa), 2025.
  https://www.chanoniwa-online.com/blog/column/tea-varieties/
  A single shop column, not an index — Yabukita, Saemidori, Yutakamidori, Okumidori,
  Kanayamidori, Asatsuyu, Koshun, Benifuki, Sayamakaori. Useful for how these teas are described
  to Japanese consumers: Asatsuyu as 天然玉露 "natural gyokuro", Kanayamidori's 乳香 milk-aroma,
  Sayamakaori's fit with 狭山火入れ Sayama-style roasting.

- **Tezumi — matcha collection** — https://www.tezumi.com/collections/matcha
  Example product page: https://www.tezumi.com/products/uji-hikari-matcha
  A specialist English-language retailer, and the best source found for **which cultivars are
  actually sold as single-cultivar matcha, and by whom**. Every product names its producer, so it
  connects cultivars to houses: Yoshida Meichaen, Rishouen, Seicha Tsujiki, Osada Seicha, Kogacha,
  Azuma Chaen, Arita Sansuien, Yamecha Kumaen, Maruyasu Chagyo, Minoruen, Ozawa Seifuen,
  Miyazakien, Shōkakuen.

  Cultivars it sells as single-cultivar matcha: Asahi, Asanoka, Gokou, Kirari 31, Kyōken-283,
  Meiryoku, Okumidori, Saeakari, Saemidori, Samidori, Sayamakaori, Tsuyuhikari, Uji-Hikari,
  Uji-Midori, Yabukita. Notable that **Kyōken-283, Meiryoku, Asanoka, Sayamakaori and Tsuyuhikari
  reach market as matcha at all** — the registry treats several of those as sencha cultivars.
  Product pages carry region, elevation, harvest month, picking method and tasting notes.

  It also documents the **regional pairings** that matter for a diary: Shirakawa Asahi, Shirakawa
  Gokou, Shirakawa Samidori and Shirakawa Uji-Hikari alongside the Uji versions, Yame Okumidori,
  Yame Kirari 31, Wazuka Saemidori, Kyōtanabe Gokou, Isagawa Gokou. Same cultivar, different
  district.

  **On spelling** — this page is also the clearest evidence of how unstable English cultivar
  romanisation is. Tezumi writes the same cultivar three ways: `Uji Hikari` (product title),
  `Uji-hikari` (body text) and `Uji-Hikari` (spec table). See the naming note below.

- **日本茶備忘録 / Japanese Tea Memorandum** — https://japantea-chachacha.com/hinshu/
  An individually-run Japanese reference indexing 50+ cultivars alphabetically by kana, each with
  its own page. Thin on registration numbers and parentage, but it covers obscure cultivars the
  English sources omit entirely — Asahikari, Okunosanma, Ooiwase, Surugawase, Tadanishiki.
- **Wachaclub** — https://www.wachaclub.com/ — has a cultivar section.
- **Minorien 茶の品種表** — https://minorien.jp/university/hinshu.pdf
  A rendering of MAFF's official registered-cultivar table, and the fastest way to confirm a Cha
  Norin number, a parent, or a registration year.

  **Text extraction is unreliable on it — results differ by toolchain.** Some agents got clean
  text; others got nothing usable and reported CID-encoded glyphs. Try `pdftotext` first, and if
  the Japanese comes out empty or garbled, rasterise and read as an image:
  `pdftoppm -png -r 150 hinshu.pdf out` (200 dpi if the table is dense). The Kanayamidori
  parentage conflict was settled the rasterising way.

  **The numbering jumps straight from 茶農林44号 (Benifuki, bred 1993) to 茶農林45号 (Ryofu, bred
  1997), with no entries for 1994–1996.** Two agents rasterised the table independently and read
  the same gap, so it is the registry's, not an artefact. A cultivar's absence from the table is
  therefore not proof it lacks a Cha Norin number if it dates from that window — corroborate
  against NARO's handbook or a prefectural leaflet. Asanoka, Sawamizuka, Mineyutaka, Shoju and
  Marishi all fall in the gap and all turned out to be PVP registrations, but each was
  established from other evidence rather than inferred from the absence.

- **Shizuoka Tea Industry Council cultivar leaflets** — per-cultivar sheets that state explicitly
  whether a **種苗法 (Seed and Seedling Law) registration exists**, marked 有 / 無. That single
  field distinguishes a PVP-registered cultivar from a Cha Norin one faster than anything else
  found, and settled Sawamizuka.
- **京都府茶業研究所 — 鳳春・展茗の育成** — https://www.pref.kyoto.jp/chaken/seika_hou-ten.html
  The institute's own release page for Houshun and Tenmyo. Gives the 53-7 / 53-38 strain
  designations and dates selection from 1977 (昭和52年), correcting the English Uji page's "1952".
- Prefectural 茶業研究所 pages — Kyoto (Uji cultivars), Shizuoka, Kagoshima (Makurazaki),
  Saitama (Sayama), Miyazaki, Mie. These carry the release papers that give crossing dates,
  strain names and yield tables.

## Notes on the sources

The English-language vendor blogs agree on flavour and disagree on facts. Registration years and
parentage in particular vary between them — Okumidori is given as both 1974 and 1990, and its
pollen parent as both `Shizu-zai 16` and `Asatsuyu`, depending on the page. Records here take the
best-sourced value and carry a `conflicts:` note where the disagreement is real rather than a
typo. Treat a vendor page as good evidence for how a tea tastes and weak evidence for when it was
registered.

The parentage errors are not random — they are **cross-contamination between similarly-named
things**, which means they are predictable and worth checking for deliberately:

- **S6 vs Zairai No. 16.** Kanayamidori's non-Yabukita parent is `S6`; several English sources
  call it "Zairai No. 16", which is actually *Okumidori's* parent. Settled against the MAFF
  table.
- **Sayamakaori vs Sayamamidori.** Two different cultivars, 茶農林31号 and 茶農林5号. Registry
  tables that flatten the pedigree misattribute Musashikaori and Miyamakaori to the wrong one.
  Settled against NARO's pedigree charts.
- **Minamikaori vs Minekaori vs Minamisayaka**; **Hatsumidori vs Hatsumomiji**; **Kanaya Ibuki
  vs Kanaya Homare** (a database lookup showed PVP No. 17960 belongs to Ibuki, not Homare as one
  summary claimed).

When two sources disagree on a parent, check whether the disagreement is really about a
near-homonym before assuming one of them is simply wrong.

### Read the page, not a summary of it

**This is the single biggest accuracy risk in this research.** Automated page summaries have
fabricated specific, plausible-looking facts four times — always exactly the kind of detail
nobody would think to question:

- a cultivar name absent from the page source entirely (展茗 Tenmyo returned as "Hakuei"; the
  actual English heading is "Exhibition")
- a PVP expiry date of 2009 for Mie Ryokuho No. 1, where the raw HTML shows that field **blank**
- a conflation of Shunmei with the unrelated cultivar Seimei
- **worst case — Koshun:** summarising a genuine primary PDF from the University of Shizuoka,
  the fetch returned a fabricated parentage (Yabukita × "Zairai Assamica"), a fabricated crossing
  year (1972), and **a Cha Norin number that does not exist** (茶農林45号). The actual document
  says Kurasawa × Kanayamidori, crossed 1970, strain 70-11-6, and gives no Cha Norin number at
  all. The agent caught it only by opening the PDF pages directly.

Note what the Koshun case means: **a fabrication can carry a primary source's citation**. The
error is invisible downstream, because the footnote is real.

So, for anything going into frontmatter — a registration number, a date, a parent, a breeder's
name — **read the source, not a summary of it**:

- HTML: fetch the raw page with `curl` and read it. Not quota-limited, so it is free.
- PDF: download it and open with the Read tool, which extracts page images. Summarisers cannot
  OCR scans at all and will report the document as empty or unreadable when it is neither. Nearly
  every primary-source win in this project came from doing this.
- CID-encoded PDFs (the MAFF table): rasterise first — `pdftoppm -png -r 150`.

Two access notes that recovered otherwise-unreadable pages: some Japanese sites are **Shift_JIS**
and need converting before the text is legible, and some sit behind **ModSecurity**, which
returns a block page to a bare `curl` but serves normally when ordinary browser headers are sent.
A blocked or mojibake page is not an absent one.

### Decoding breeding-line designations

Cultivar parentage is usually given as an unnamed breeding line rather than a named cultivar —
`F1NN8`, `Miya-A11`, `Shizu-Cy225`, `京研170号`. These are working designations from the station
that made the cross, and they are why parentage looks opaque in every secondary source. The
prefix tells you the station:

| Prefix | Station |
|---|---|
| `F1NN…`, `金谷N号` (Kanaya N) | Kanaya, Shizuoka — the national tea research station |
| `京研N号` (Kyoken N) | 京都府茶業研究所, Kyoto |
| `Miya-…`, `宮崎N号` | Miyazaki |
| `Sai-…`, `埼玉N号` | Saitama |
| `Makura-…`, `枕崎N号` | Makurazaki, Kagoshima |
| `静…` / `Shizu-…` | Shizuoka prefectural |
| `Mie-…` | Mie |
| `国茶…` | the national tea programme's own pre-naming designations (Asatsuyu was 国茶U14号) |

Line identities confirmed from primary sources during this research:

- **F1NN8** = Tamamidori × S6, a Kanaya F1 line. Parent of both Okuyutaka (茶農林34号, 1983) and
  Shunmei (茶農林37号, 1988) — which are **full siblings from the same 1958 cross batch**, not
  merely same-parentage cultivars.
- **F1NN27** = Yabukita × Shizuoka Zairai No. 16, the same Kanaya series. Parent of Sakimidori
  and Harumoegi, and note that **Shizuoka Zairai No. 16 is also Okumidori's parent** — so that
  landrace selection sits behind a large part of the modern pedigree. `F1NN29` is Okumidori's
  seed parent, from the same series.
- **ME52** = a Miyazaki landrace line; the pollen parent of both Sakimidori and Harumoegi.
- **静7000 series** — a Shizuoka run of open-pollinated **Yabukita seedling** selections, and the
  reason so many unregistered Shizuoka cultivars share an origin. Confirmed members:
  **Kurasawa = 静7111**, **Yamakai = 静7166**, and **静7132** (the line behind Tsuyuhikari), with
  **Surugawase** and **Fujimidori** named as siblings in the same series.

  Run by **Arima Toshiharu**, who also selected 印雑131 — so this series and the Inzatsu line
  are one breeder's work rather than two unrelated Shizuoka programmes. Source is the
  Shizu-Inzatsu 131 post listed above, which independently gives 静7166 = Yamakai.

  Members are **siblings by origin only** — each is a separate seedling with an unrecorded pollen
  parent, so the relationship cannot be drawn as a cross. For a lineage graph this is the same
  case as the Uji zairai cluster: a shared source population, not a shared parent.
- **23F1-107** = Sayamamidori × Yabukita, crossed 1948 at Saitama. Never released — its shoots
  grew too large to process — but it is Fukumidori's pollen parent, making Fukumidori a
  backcross of Yabukita onto its own hybrid offspring.
- **Z1** = an unregistered national-programme line from open-pollinated Tamamidori seed. Parent
  of Fushun and Saeakari, and **not** of Meiryoku despite the tables.
- **印雑131 / Shizu-Inzatsu 131** (印雑 = 印度雑種, "Indian hybrid") = an unregistered 1944
  Shizuoka line, selected by Arima Toshiharu from a seedling of "Manipuri No. 15" — one of ~90
  numbered Assam trees grown from seed collected on Maruo Fumio's 1922 expedition to India, Sri
  Lanka and Java. Never named because the registration system did not exist until 1953. NARO maps
  its methyl anthranilate to the **Mat locus** (Yabukita `mat/mat`; Inzatsu 131 `Mat/mat`), which
  is the documented source of the jasmine aroma in its reciprocal-cross descendants **Sofu** and
  **Fujikaori**. Two further unreleased lines carry the trait: Kanaya No. 22, Miyazaki No. 24.
- **FYZ-41** = Yabukita × Shizu-Inzatsu 131, per NARO's pedigree chart — making it a sibling
  breeding line to Sofu and Fujikaori, and its offspring **Kiyoka** (2020) a **third** cultivar
  carrying the Inzatsu 131 aroma inheritance. Worth checking whether Kiyoka's "sweet floral"
  description is the same methyl anthranilate trait under another name.
- **Miya-F1 9-4-48** = a 1934 Miyazaki cross of **MA23** (宮崎アッサム種, *C. sinensis* var.
  *assamica*) × **MC3** (宮崎コーカサス種, Caucasus type). Pollen parent of Unkai (茶農林29号),
  hence the Assam-and-Caucasus ancestry that shows up in Minamisayaka too.
- **Cn1** = "the China variety", glossed in the English abstract of Benihikari's own 1970
  registration paper. Pollen parent of Benihikari (茶農林28号).

  Taken together these settle the **`C` prefix — and the answer is that it is ambiguous**. `Cn1`
  is confirmed Chinese; `MC3` is confirmed Caucasus. Both readings are attested from primary
  sources, so `Cp1`, `C19` and similar cannot be assumed either way without their own evidence.
  The Asanoka record hedges on `Cp1` for exactly this reason, and that hedge was correct.
- **京研166号** = Gokou · **京研170号** = Ujihikari · **京研307号** = Ujimidori.
- **53-7** = Houshun, **53-38** = Tenmyo — both open-pollinated Samidori seedlings, Kyoto, 1977.
- **平野11号** = Asahi (grower Hirano Jin'nojō) · **小山69号** = Samidori (grower Koyama
  Masajirō). Grower selections carry the grower's surname, not a station code — which is itself
  the tell that a cultivar came from a farmer's field rather than an institute. The 京研 series
  is the Kyoto institute's own in-house numbering by contrast.

**Many cultivars have no kanji form at all.** Benihomare, Samidori, Ujihikari, Seimei, Sawamizuka
and Takane-wase are all registered or recorded in kana only, and plausible-looking kanji
(紅誉 for Benihomare, 宇治光 for Ujihikari, 五月みどり for Samidori) appear in no primary source.
Set `kanji: null` rather than supplying one that reads correctly — a kanji spelling is a claim
about the official name, not a transliteration.
- **G15613** = Sayamakaori before naming · **金谷4号** = Shunmei · **Mi99-23 / 宮崎31号** =
  Kirari 31.

A named cultivar and its pre-naming line designation are the same plant. Sources that use
different ones for the same cultivar are not in conflict.

### Even the registry tables carry parentage errors

The MAFF-derived tables are the best secondary sources here, but they are not infallible on
parentage, and the release papers outrank them.

**Meiryoku** is the demonstrated case. Both the Minorien Cha Norin table and the Japanese Tea
Sommelier list give its parentage as Yabukita × **Z1**. The 1987 peer-reviewed release paper
(Kozaki, *Japanese Journal of Breeding* 37(1):103–108, reproducing MAFF's own 1986 registration
dossier) states in both Japanese and English that it is Yabukita × **Yamatomidori** — crossed
1959, selected 1965, line 茶交F1NN52, retested as Kanaya 6, registered as 茶農林35号 on 6 June
1986.

Z1 is real — an unregistered national-programme line from open-pollinated Tamamidori seed — and
it *is* the seed parent of Fushun (茶農林41号) and Saeakari. It simply is not Meiryoku's parent.
The error looks like a line-designation mix-up propagating between tables.

Practical rule: for any cultivar with a J-STAGE release paper, take parentage from the paper, not
from a table. Where they disagree, record both in `conflicts:`.

### The draft records in `example/` are not authoritative

`research/example/cultivars/*.mdx` are style templates, and several of their facts have since
been contradicted by primary sources:

- NARO's handbook gives **Kirari 31's registration as 25 March 2016**, against the December 2013
  / May 2014 dates in the example record.
- ~~The **Okunoyama** draft carried a "1981–1994" selection window and a precise screening funnel
  (2,000 → 58 → 24 → 8 → 2 plants) that appear in no source found anywhere.~~ **Retracted — the
  draft was right and this note was wrong.** Horii Shichimeien's *7 Stories* chapter 4
  (https://horiishichimeien.com/en-sb/pages/story4) states all of it in the house's own words:
  selection began in **1981**, about **2,000** plants were narrowed to **58**, then **24**, then
  **8**, and in **1994** two final candidates were chosen, registered **2002** — "a good 20 years
  after we started". The earlier check had only reached `/blogs/topics/about`, which compresses
  the same story into one span, and read the difference as invention.

  Worth keeping as the counter-example to the entries around it. The reasoning that condemned it
  — *this is too specific to be sourced, therefore it is fabricated* — is the same reasoning that
  correctly caught Koshun and Yutakamidori, and here it produced a false positive on real primary
  data. Unusual specificity means **find the source or mark it unverified**; it is not by itself
  evidence of invention. Absence of evidence was doing the work of evidence of absence.
- The **Asahi** draft lists **gyokuro** among its tea types. Kyoto Prefecture's own
  characteristics table marks Asahi ◎ for てん茶 (tencha) only, and Matcha Direct states its
  thin, large leaf is unsuitable for a rolled tea like gyokuro. Independently disconfirmed.
- The **Yutakamidori** draft claims a 1934 **self-pollination** cross and the strain name
  "U14-1". No source corroborates it; tea is self-incompatible, so a self-pollination claim needs
  strong sourcing; and **`U14` is Asatsuyu's own designation** — the 1953 registration bulletin
  gives Asatsuyu as 国茶U14号. The fabrication was assembled out of a real fact belonging to the
  *parent* cultivar. That is the pattern to watch for: invented detail built from adjacent true
  detail, which is why it survives a plausibility check.

Treat those files as a guide to voice and structure, not as evidence. Verify independently and
log the disagreement.

They are not uniformly wrong, and the `kirari31.mdx` audit is the fairest test so far. It is the
most granular draft in the directory — 1,290 seeds sown November 1995, 28 individuals selected,
strain Mi99-23, survival rates of 86/88/73%, yields of 511 and 520 kg/10a, a 21–27 day
leaf-colour window, six researchers — and checked against the actual release paper
(茶業研究報告 No. 120, 2015) **almost all of it held up**. Only two claims failed: a specific
seed-collection day of "19 October 1995" where the paper says only "October 1995", and a garbled
disease list (below).

`minekaori.mdx`'s account of Miya-F1 9-4-48 was likewise confirmed correct by Unkai's 1971 paper.

So the drafts are a mix of sound research and invention, with no way to tell which from the text.
That is worse than uniform unreliability, because the accurate detail lends credibility to the
fabricated detail sitting beside it. Every claim needs its own check.

### Agronomic figures are trial-specific, not cultivar constants

Yield, survival and resistance numbers come from particular trials at particular sites in
particular years, and two sources can both be right while disagreeing.

Seedling survival for Saemidori is the worked example: Kirari 31's 2015 release paper gives
Kirari 31 86%, Yabukita 88%, Saemidori 73%; the 2018 Haruto 34 release paper, a 13–15-site
national trial, gives Saemidori and Yabukita an equal 75% national average. Neither is wrong —
they are different trials with different scopes, and the widely-repeated "Saemidori 73% vs
Yabukita 88%" quotes one trial's numbers as though they were properties of the cultivars.

Attribute a figure to its trial rather than stating it flat. The same caution applies to budding
time, which varies by region: Ujihikari reads medium in Kyoto and early in a Kagoshima frost
trial.

### 赤枯れ / 青枯れ are not diseases

A translation trap that will recur across the records. English sources list "red blight" and
"blue blight" as diseases a cultivar resists. In the Japanese trial tables, **赤枯れ and 青枯れ
are winter cold-scorch symptoms**, not pathogens — a cultivar "strong" against them is
cold-hardy, not disease-resistant.

The actual bacterial disease is **赤焼病** (bacterial shoot blight), which is a separate row in
the same tables and often carries a *different* rating. Kirari 31 is strong against the cold
symptoms and only "somewhat weak" against the bacterial disease; a flattened English list
reports both as "strong". Check which term the source table uses before recording a resistance.

### Two registries, not one wrong year

Most "registration year" disagreements are not errors. Japan has run **two separate systems**,
and a cultivar can hold a date in each:

1. **茶農林 (Cha Norin)** — the MAFF national tea cultivar designation, numbered sequentially.
   Began in **1953**; that first round registered fifteen cultivars at once.
2. **種苗法 / Seed and Seedling Act** (Plant Variety Protection) — a legal plant-breeder's-right
   registration, separately numbered, and generally the only route for post-2000 cultivars.
   **It did not exist until 1978.**

That 1978 date explains a whole class of "unregistered" cultivars. Anything already distributed
before then — Kuritawase (1966), Yamakai (1967), Kurasawa (1967), Horyoku (1956), Shizu-7132 —
was disqualified on novelty grounds regardless of merit, and could only ever hold **prefectural
recommended cultivar** status. "Unregistered" in these cases means *ineligible*, not *rejected*,
and the distinction is worth preserving in the records.

Fukumidori is the clean example: its release paper shows the Cha Norin No. 36 designation
announced May 1986, with a Seed and Seedling Act registration still pending at publication in
June 1987 — which is why the secondary sources say 1988. Both dates are real; they describe
different events. Records here state **which registry** a date belongs to rather than picking one.

Some cultivars are in only one system. Okuhikari and Inaguchi have PVP registrations and **no
Cha Norin number at all**, despite sources implying otherwise — verified against the full
52-entry Cha Norin table. Terakawa-wase is PVP No. 2092.

### Writing cultivar names in English

English sources are wildly inconsistent — Tezumi alone writes `Uji Hikari`, `Uji-hikari` and
`Uji-Hikari` on one product page, and the Japanese Tea Sommelier list hyphenates almost
everything (`Sae-midori`, `Oku-midori`, `Kanaya-midori`) while vendors write those solid.

**House convention follows Tezumi**, the specialist retailer at
https://www.tezumi.com/collections/matcha — chosen because it is how these cultivars actually
reach English-speaking drinkers.

The rule is **not** "hyphenate compounds". Tezumi writes `Yabukita`, `Saemidori`, `Okumidori`,
`Samidori`, `Sayamakaori`, `Tsuyuhikari`, `Asanoka`, `Saeakari`, `Meiryoku`, `Asahi` and `Gokou`
**solid**, and hyphenates only `Uji-Hikari`, `Uji-Midori` and `Kyōken-283`.

So: **a place-name or line-code prefix takes a hyphen; every other compound stays solid.**
`Uji-` qualifies the name that follows it; `Sayama` in Sayamakaori does not — it is one lexical
unit. This also avoids a real ambiguity, since `Uji Samidori Matcha` and `Uji Asahi Matcha` in
the same catalogue use *Uji* as the region.

Three registers, all from the same product page:

| Context | Form |
|---|---|
| Title / heading | `Uji Hikari Matcha` (spaced) |
| Body prose | `Uji-hikari` (hyphen, lower-case second element) |
| Field label / value | `Cultivar: Uji-Hikari` (hyphen, both capitalised) |

In these records that means `name: Uji-Hikari`, `romaji: Uji-hikari`, prose `Uji-hikari`, and the
slug stays `ujihikari` — slugs are unaffected throughout.

Numbers keep their separator: `Kirari 31`, `Inzatsu 131`. Note Tezumi writes `Kyōken-283` with a
hyphen and a macron, while this corpus is otherwise macron-free (`Gokou`, not `Gokō` — as Tezumi
also writes it). The macron question is unresolved; see STATUS.md.

Because readers meet these names on tins rather than in registries, an `aka:` field listing the
variants each source uses is worth more than any single choice.

### 育成 is not 登録

The Kyoto institute's own pages distinguish **育成年 (development year)** from **登録年 /
品種登録 (formal registration)**, and use them deliberately: Ujihikari carries 育成 1954, while
the institute's later Tenmyo and Houshun carry 品種登録 2006. Secondary sources flatten both into
"registered", which is how a cultivar that was never registered anywhere acquires a registration
year.

A third term: **命名登録 (name registration)**. Yutakamidori was name-registered by Kagoshima
Prefecture in 1966 and holds no Cha Norin number — so `registry: prefectural recommended
cultivar` is accurate where a flat "unregistered" would not be.

So a Japanese page giving a year is not necessarily giving a registration date. Check which word
it uses. For the Uji cultivars especially — Asahi, Samidori, Ujihikari, Gokou, Komakage are
**prefectural recommended cultivars with no national registration at all**, and their "1954" is a
development or adoption year, not a registration.

### Dates worth separating generally

`crossedYear`, `selectedYear` and `registered` are routinely collapsed into one number by
secondary sources, and the gaps are large: Kanayamidori was crossed in 1949 and registered in
1970; Kirari 31 took 19 years; Fukumidori's 23F1-107 parent line was crossed in 1948 for a
cultivar registered in 1986. When a source gives a single year, work out which event it means.
