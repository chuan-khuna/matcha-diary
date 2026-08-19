# Fact-check of every cultivar record against primary sources

All 82 records in `research/cultivars/` were re-verified against primary sources — MAFF's
登録品種データベース, the 茶農林登録品種一覧, NARO's 茶品種ハンドブック第6版, and the original
release papers on J-Stage. One agent per cultivar. Outright errors contradicted by a primary source
were corrected in place; anything contested or resting only on secondary sources was flagged rather
than guessed.

## Outcome

| | |
|---|---|
| Records checked | 82 |
| Records corrected in place | 76 |
| Records needing no edit | 6 |
| Lines changed | +1,167 / −816 |
| Frontmatter blocks parsing as valid YAML | 82 / 82 |

Only one record — `shoju.md` — came back fully clean, matching MAFF's registry row for row. Every
other record needed at least a flag.

## What kept going wrong

Six failure modes recurred across unrelated records. They are worth knowing because they are
properties of how the records were written, not of any one cultivar.

**Unfounded negative claims.** The single most common error was a record asserting that no source
exists for something, when one does. `horyoku.md` carried five such claims (yield, disease ratings,
descendants, growth habit, tasting notes) and all five were false. `asanoka.md` said the breeding
line Cp1 was undocumented; MAFF names the cross outright. `kurasawa.md` said the cultivar never
entered the trial pipeline; it was a Shizuoka recommended cultivar for 34 years. `oguramidori.md`
was written as a forgotten name; it is a current Kyoto 奨励品種 with a published characteristics row.
These claims are the ones a reader is least likely to check and most likely to repeat.

**The two-registry trap.** The MAFF 茶農林 naming registration and the 種苗法 Plant Variety
Protection registration have different years and different numbers, and records mixed them freely.
`benifuki.md` contradicted its own History section. `harumidori.md`, `sayamakaori.md`,
`houshun.md`, `shunmei.md` and `kyoken283.md` all quoted one registry's year against the other's
number — and in three cases a real disagreement had been written up as an unresolved conflict when
it was simply two correct facts about two different filings.

**Misread tables.** `takachiho.md` was the worst: the comparison partner in its budding figures was
Unkai, not Yabukita; its yield ratios had the direction inverted, so a cultivar that was out-yielded
by 19–30% was described as out-yielding; and Yabukita's cold rating was given as one grade above
what the table says. `kirari31.md` attributed Saemidori's yield indices to Kirari 31.
`asatsuyu.md` quoted an arcsin-transformed survival figure as a raw percentage.

**Folk kanji presented as registered.** At least fourteen records carry a kanji form that no primary
source uses — the registered name is hiragana. `meiryoku.md` was worse than folk: the release paper
states MAFF designates 茗緑, and the record had 明緑.

**Secondary sources doing primary work.** `myjapanesegreentea.com` and `teanursery.com` supply
values in many records where a MAFF filing says something different or says nothing at all.
`sawamizuka.md`'s "gray blight (medium)" appears to be a mistranslation of もち病抵抗性 中.

**`buddingTime` conflates two things.** Several records put 摘採期 (plucking) data in a field named
for 萌芽期 (budding). Where both figures exist they differ substantially — `kiyoka.md` buds 13 days
before Yabukita but is picked 8 days before.

## Decisions you need to make

**1. Meiryoku's parentage — affects two records.** Three primary sources, two answers:

| Source | Parentage |
|---|---|
| MAFF 1986 registration dossier (via Kozaki 1987) | やぶきた × やまとみどり |
| NARO 登録品種一覧表 (archived) | やぶきた × やまとみどり |
| 茶農林登録品種一覧 (minorien) | やぶきた × Ｚ１ |

Two to one for Yamatomidori. If that is right, `tamamidori.md` loses its claim to Meiryoku as a
descendant via Z1, and its "Z1 was used as a parent three times" becomes twice. Left unedited
because it ripples through four fields in a record no agent was told to rewrite.

**2. What `registrationNumber` means.** The field holds 茶農林 numbers in most records and is `null`
where a cultivar has only a PVP number — but the PVP number then lives in prose, in `registry`, or
in a `plantVarietyRegistration` field, inconsistently. Raised independently by the checkers for
`narino`, `okunoyama`, `koshun` and `mineyutaka`. Worth settling once.

**3. The stray web-copy edit.** At `HEAD`, all 82 files in `apps/web/content/cultivars/` were
byte-identical to their `research/` counterparts. One agent also updated
`apps/web/content/cultivars/ujihikari.md`, so the web tree is now synced for that one cultivar and
stale for the other 75 changed ones. Either revert it or sync all 82 — the half-state is the worst
option.

**4. Two off-schema keys.** `kiyoka.md` carries `pvpRegistrationNumber` and `pvpApplicationNumber`,
which are not in the `Cultivar` type in `apps/web/lib/cultivars.ts`. They are pre-existing, not from
this pass, and the reader drops them silently.

## Repository-wide items

- **Stale institute name.** "NARO's Institute of Vegetable and Tea Science" appears in
  `okumidori.md`, `okuyutaka.md`, `kiyoka.md`, `seimei.md`, `sunrouge.md` and `horyoku.md`. That
  body was dissolved in the April 2016 reorganisation; tea moved to 果樹茶業研究部門, the Institute of
  Fruit Tree and Tea Science. Fixed where an agent's own record touched it (`fushun`, `ryofu`,
  `miyoshi`, `tamamidori`); the six above were left because they were outside those agents' scope.
- **YAML break, fixed.** One agent's edit to `yamatomidori.md` left an unquoted `lineageNote`
  containing a colon, which broke frontmatter parsing. Quoted; all 82 now parse.
- **`japaneseteasommelier.wordpress.com`** returns HTTP 403 to automated fetches throughout. It is
  cited in many records and is probably bot-blocking rather than gone, but claims resting solely on
  it could not be re-verified this pass.
- **Dead or non-supporting sources** were reported in 13 records — including
  `ja.wikipedia.org/wiki/宇治茶` in `samidori.md`, which contains no mention of the cultivar, and a
  Weblio mirror in `tsukasamidori.md` whose characteristic sections are empty.

## Cross-file inconsistencies found

- `komakage.md` and `asahi.md` name different trios as the "three Uji selections".
- `miyoshi.md` and `tamamidori.md` both said "three Uji-strain selections"; the registry records
  five. Both qualified.
- `shunmei.md` described F1NN13 and F1NN29 as lines never released as cultivars; they are the former
  strain names of Kanayamidori and Okumidori. Flagged from `okumidori.md` and `sakimidori.md`, fixed
  at source.
- "Manipuri No. 15" for Shizu-Inzatsu 131's ancestor is "Manipur No. 5" per the peer-reviewed JARQ
  paper. Corrected in `inzatsu131.md` and `sofu.md`; `kiyoka.md` still carries the old reading.
- `okuyutaka.md` called Shunmei a half-sibling; they come from the same cross in the same
  orientation, as `shunmei.md` already said.
- `yabukita.md` contradicted itself on the collection's size, claiming 69 records in one place and
  71 in another. There are 82; 24 name Yabukita as a parent.

## Appendix — per-record findings

Every record's fixes and flags, as reported by its checker.

### akane — both
FIXED: parents.female Ai2 → Ai21 (アッサム21号) per the 1953 naming paper, also in parentNotes/conflicts/Lineage; parentNotes.male gained full strain name 鹿緑原3号 (and ＮｋａＯ3 carries letter O, not zero); conflicts rewritten — resolved, not open: the 茶農林 summary table collapses three Assam accessions into one Ａｉ2 code; diseaseResistance gained 耐病性が大 (previously held only a cold rating); recommendedRegions gained warm Kyushu/Shikoku; documentation no longer claims no release paper exists.
FLAGGED: selectedYear 1939 and "trialled 1942–1952" contradict the paper's 育成 昭和15〜17年 (1940–42), Tea Nursery only; NkaO3 called "Kagoshima zairai" unverified — sister line 鹿緑原5号 is recorded as a Mie introduction; yield "267/194" has no unit, basis, or year; "cold resistance high" — paper rates 耐病性 and is silent on cold; prose "same recipe as Benifuki" wrong (benifuki = べにほまれ×枕Cd86); 樹姿中間 is habit not size.
DEAD_SOURCES: none

### asagiri — both
FIXED: recommendedRegions — removed "Uji, Kyoto" (1954 report gives 適地は近畿一円の平坦部 only; frontmatter contradicted its own prose); yield "tana-shita 棚下" → 覆下園; prose 棚架 → 覆架; tasting edge "concentrated in aroma and taste" → "in shape and leaf colour" (Table 6: +3 shape, +2 colour, only +1 each aroma/taste); prose crediting the Institute with breeding Asahi/Samidori corrected — Kyoto's own page names growers 平野甚之丞 and 小山政次郎; 1 source added.
FLAGGED: kanji 朝霧 derived from the naming rationale, not the registered (kana) form; "250-point scale" is inference, report prints no maximum; "propagated by cuttings" not stated in the report; "京都府奨励品種" not corroborated; Kyoto page self-contradicts on さみどり provenance; retail Asagiri product claims unverifiable (403 / JS-only).
DEAD_SOURCES: none

### asahi — both
FIXED: cutting propagation "rated below Yabukita, Samidori, Ujihikari and Tenmyo" → Samidori is level (both やや不良), per the cited Kyoto table; prose matched; "six years later, in Reiwa 6 (2024)" → five years later.
FLAGGED: yield "somewhat low" — both institutional sources say 収量：中, only the PDF table says やや少 (officially contested); "trialled from 1953" traces only to myjapanesegreentea.com, Japanese sources give 育成年 1954 only, and prose reads out of order; conflicts field misattributes the 早生 claim to an AI artifact — 古勝製茶場 states it in Japanese; kanji 朝日 and "morning sun" are retailer renderings, no registered form exists; selectedFrom "Uji City" — Japanese sources localise inconsistently (五ヶ庄 / 宇治郡宇治村 / 東宇治町); no-descendants claim confirmed but 展茗/鳳春 are open-pollinated 
so Asahi pollen not excluded.
DEAD_SOURCES: none

### asanoka — both
FIXED: registrationNumber null → PVP No.5013 (reg. 1996-03-19, appl. 1994-01-31, registrant 鹿児島県); buddingTime "medium 中生" → "slightly early やや早生"; Cp1 identity — record's central claim that Cp1 is undocumented was WRONG, MAFF names the cross as やぶきた × 中国種 平水1号 (fixed in lineageNote, summary, intro, Lineage bullet, and the "identity of Cp1" section); diseaseResistance — file said no formal ratings exist, MAFF gives 炭そ病やや弱/輪斑病やや強/赤枯強/青枯強/裂傷型凍害極強; yield "high" → 幼木多/成木やや多.
FLAGGED: teaTypes kamairicha + black tea rest on one retailer (MAFF 用途 is 煎茶 only); kana/kanji/nameMeaning null unverified; crossedYear/selectedYear/strainNames still null; source credits 2005 paper to "Sanami et al." vs J-Stage "Saba".
DEAD_SOURCES: none

### asatsuyu — both
FIXED: prefecture Kyoto → Shizuoka (茶農林2号 育成場所 金谷; siblings miyoshi/tamamidori already say Shizuoka); yield — 67.50 survival is an ARCSIN-TRANSFORMED value (~85% untransformed), and the group is five cultivars not four (Yutakamidori omitted); cold/frost "second only to Yutakamidori" → identical top damage grade; trial attribution "NARO field trial" → field trial at Mizobe, Kagoshima; prose "Harunagori" → "Haruto 34" (no such cultivar as Harunagori); source author 渕上康元 → 渕之上康元.
FLAGGED: kanji 朝露 is a conventional rendering, not registered (nameMeaning already says so — field mismatches its own note); prose calls Kanaemaru a Yutakamidori child, it is a grandchild via 金F183 — actual direct offspring are おくゆたか and しゅんめい; selectedYear null though the bulletin gives 昭和19年 (1944).
NOTE FOR CROSS-CHECK: prefecture now Shizuoka (breeding site) while saemidori.md describes Asatsuyu as an Uji-type zairai selection — origin vs breeding-site semantics of the `prefecture` field.
DEAD_SOURCES: none

### benifuki — both
FIXED: lineageNote + prose claimed Kubo et al. 2021 verified the parentage by SSR — it does not (Table 1's ☆ marks confirmed parentage; Benifuki carries none, and 枕Cd86 was not genotyped); 3 sources added.
FLAGGED: teaTypes omits semi-fermented tea, which is half the registered use (茶農林44号 紅茶・半発酵茶); buddingTime "late" conflates 摘採期 with 萌芽期 — NARO says 萌芽期は中生, same as Yabukita; summary/intro say "registered 1995 as Cha Norin No.44" but 茶農林44号 is 1993 and 1995 is the PVP — record contradicts its own History section; kanji 紅富貴 "registered form" overstated; selectedYear null (NARO gives 枕崎3号 selection 1966–1992); "cold hardiness confined it to Kyushu" contradicted by NARO 静岡県以西で栽培可能; 国産紅茶グランプリ awards are the producer's, not the cultivar's.
DEAD_SOURCES: none

### benihikari — both
FIXED: "By the early 1950s Japan had eight registered black tea cultivars" → the paper counts eight as of writing (1969/70); the first was 1953 and the eighth 1960; "liquor colour ran a shade more reddish" → reviewer flagged 色沢 (dry-leaf colour/lustre) as a concern, not 水色.
FLAGGED: conflicts field is wrong on its key point — 茶農林 list shows べにかおり (21号) AND べにふじ (22号) both 1960, so 1960 does not "belong instead to Benifuji"; left unedited since the year is genuinely contested (Wikipedia/和茶倶楽部 say 1954); prose "one reviewer rated taste ahead of Benihomare" — no such comparison in 表10, that verdict comes from the separate 依頼審査; cutting-rooting "88–90%" conflates 活着率 88% with the summary's round 90% (成苗率 is 72%); strain name 1144 (paper) vs 1141 (茶農林 list).
DEAD_SOURCES: none

### benihomare — both
FIXED: "1,500 t/yr through the mid-1950s" → "until ~1960" (昭. 30s mid); black-tea quality "as good" → "superior (品質優良)" per 1953 paper's grading tiers.
FLAGGED: notableDescendants omits べにふじ (茶農林22号, 1960, べにほまれ×C19); Izumi hedge too strong — 茶農林24号 いずみ is in the official registry as べにほまれの実生, use is 釜炒り製玉緑茶; Benifuki "1995" is PVP #4591, 茶農林44号 is 1993 — inconsistent registry tier vs file convention; 枕Cd86 "bred at Makurazaki" → NARO says ダージリンからの導入種; Tada Assam/Darjeeling-first claim + 1905–07 dates rest on customtea.jp only.
DEAD_SOURCES: none

### fujikaori — both
FIXED: prose attributed a "Kondowase" third-cultivar claim to the 2004 NARO report — that report names breeding lines 金谷22号/宮崎24号, not Kondowase; claim reattributed to the secondary Sommelier survey; researcher names corrected — 2002 report is 澤井祐典/山口優一/吉冨均 (not "Tanaka"), 2004 is 田中淳一/澤井祐典.
FLAGGED: crossedYear 1980 rests solely on myjapanesegreentea.com; registrationNumber null but 藤かおり does hold a 種苗法 number (MAFF search form errored — gap if the field is not 茶農林-only); romanisation of 小柳三義 inconsistent across the same author's posts; nameMeaning 藤 = Fujieda is unattested inference.
DEAD_SOURCES: none

### fukumidori — both
FIXED: bredAt + prose "institute established 1951" → founded April 1928 (1951 is when the MAFF-designated breeding trial site was set up there); "registered in June 1986" → published in the 官報 of 6 June 1986 after 13 May MAFF deliberation; conflicts falsely claimed two sources "give 1988 as the registration year" — both list the 1986/1988 pair, and Saitama's own page confirms 昭和63年品種登録; 赤枯れ strong → やや強 and 青枯れ medium-to-fairly-strong → やや強; 4 sources added.
FLAGGED: kanji 福みどり unattested for this cultivar (it is a brassica cultivar name) — suggest null; the release paper's 図1 labels 23F1-107's pollen parent やまぶき, contradicting its own English summary and the MAFF list (likely figure typo); breeder "Jiro Hanawa" — 表1 reads 塘 二郎 (Tsutsumi) not 塙; "ring-spot-type leaf blight" — paper says 胴枯性症状 and never names 輪斑病; yield units likely fresh leaf, not 荒茶.
DEAD_SOURCES: none

### fushun — both
FIXED: conflicts field was wrong on all three of its points — the release paper (Yamaguchi et al. 1992) DOES rate anthracnose 中庸, DOES give +6 days at the breeding site vs +1.5 averaged over regional trials (which is what the handbook's 1–3 reflects), and DOES state 1965年に交配 (span is 26 years, not 27); rewritten as a split between two NARO publications; prose Characteristics carried the same two errors, corrected; bredAt out of date — 野菜茶業研究所 dissolved 2016, tea now under 果樹茶業研究部門; release paper added to sources.
FLAGGED: nameMeaning incomplete — release paper also alludes to 富春江, the Fuchun River near Hangzhou; record has no cold-hardiness field although 耐寒性は'やぶきた'より強い is the cultivar's headline trait in Japanese sources; yield "30–50% above Yabukita" matches the handbook but not the paper (+23%/+8% breeding site, +86%/+167% regional) — basis question; bush habit 直立型 (handbook) vs 樹姿 中間 (PVP filing in 表-10).
DEAD_SOURCES: none

### harumidori — both
FIXED: crossedYear 1979 → 1972 (release paper); "evaluation ran 24 years" → 28; conflicts falsely claimed no primary source dates the Norin registration to 2000 — the paper states 2000-08-24 茶農林48号; anthracnose "weak, per NARO only" → やや強 per both the release paper and NARO's cultivar DB (handbook's "weak" now noted as the dissenting reading), fixed in prose too; release paper added to sources.
FLAGGED: registered:2003 sits above 茶農林48号 which was registered 2000 — 2003 is the PVP date only; buddingTime "6 days after Yabukita" is the release paper's figure, the handbook's 3–5 is the outlier; bredAt understates Takeda (he is a listed breeder and first author, not just a later writer-up); kanji 春みどり not registered; tannin 10–11% (O-Cha Net) vs 11–12% (paper); yield handbook 同等か1～2割多い vs paper index 140 and higher at only 8 of 13 sites; prose dates Fushun 茶農林41号 to 1993 — that is its PVP, Norin 41 was 1991; NARO DB limits adaptation to 関東以西.
DEAD_SOURCES: none

### harumoegi — flagged (no edits)
FLAGGED: vigour "level with or slightly below Yabukita" (NARO handbook) contradicted by release paper 茶業研究報告96 (2003) 樹勢やや強 — conflicts:null is wrong; buddingTime "slightly late" vs paper's explicit 中生 (2 days late); recommendedRegions omits Kagoshima (page 404, unverified); release paper missing from sources.
VERIFIED: parents F1NN27×ME52, 1981 cross, 宮崎18号, 茶農林51号 Sep 2003, PVP 13755, bredAt, disease, yield, siblings.
DEAD_SOURCES: none

### hatsumidori — both
FIXED: Lineage — 埼玉1号 wrongly placed in the 1954 batch (it is 茶農林5号, 1953) → 京研113号/京研172号; "six other early cultivars" → five (trial used six total incl. Hatsumidori); buddingTime "at one site" → "in farmer gardens around Makurazaki" (trial spanned several 農家茶園 with differing management).
FLAGGED: kanji 初みどり unattested — registration paper and 茶農林 list write hiragana only, probably should be null; nameMeaning gloss beyond the verbatim 命名の理由 is inference; "starting in Showa 8 (1933)" — paper gives a single 育成 year not a start date; "roughly in the middle of the field" — actually 3rd of 7; yield figure is Hatsumidori-as-check in Benikaori's trial, its own table exists (136.0 kan/10a, 1953); minorien 茶農林 list dates べにかおり 1960 vs 1954 paper.
DEAD_SOURCES: japaneseteasommelier.wordpress.com returns 403 (possibly bot-block)

### himemidori — both
FIXED: "nearly double the leaf yield ... by the third year after planting" → "by the third year of plucking" (Table 4 measures from start of plucking); "scoring consistently ahead of Yabukita across three years" → ahead in two of three, level in the third (1958 tied 91.0/91.0).
FLAGGED: kanji 姫みどり is a folk/retail rendering — registry and the 1961 paper use hiragana only, and nameMeaning's 姫 gloss inherits it; teaTypes tencha unsupported (registry 用途 is 玉露 only, paper is gyokuro-only); Hoshino-village association unsourced and origin villages were 大淵/笠原; "slightly thicker with a denser palisade" — paper says 葉厚もやぶきたと同じ程度 and the palisade is thicker not denser; "had no purpose-bred cultivar" — paper says no *suitable* one; buddingTime field holds 摘採期 not 萌芽期.
DEAD_SOURCES: japaneseteasommelier.wordpress.com resolves but has no Himemidori entry — supports nothing here.

### hokumei — both
FIXED: nameMeaning — full etymology found on Saitama pref page (北 + 茗, archaic word for tea); removed the "no kanji form asserted" claim; buddingTime late → slightly late (やや晩生) per both Saitama page and PVP 4775; 2 sources added.
FLAGGED: seed parent contested — PVP 4775 text says さやまかおり while 茶農林43号 list, NARO handbook, and the same filing's own comparison paragraph say さやまみどり (likely MAFF error, belongs in conflicts); anthracnose weak (NARO) vs やや強 (PVP); PVP also rates 裂傷型凍害 やや強, absent from record; "since the 1940s" Saitama programme unsourced; crossedYear missing (secondary says 1965); bredAt modern successor 埼玉県茶業研究所 unstated.
DEAD_SOURCES: none

### horyoku — both
FIXED: five separate "no source found" negative claims were false — yield now 864 kg/10a first flush (2009 NARO Makurazaki); diseaseResistance gained gray blight (one of only 2 of 55 entries with zero zonate-spot lesions vs Yabukita/Sayamamidori >45%); notableDescendants gained 金系213 (1976 やぶきた×ほうりょく, Horyoku on the pollen side); Characteristics prose gained leaf-blade angle 22.3° (smallest of 49) and 葉が巻く; tasting notes added from 茶研報 22 (1964); selectedFrom quote corrected to 多田系印度雑種実生; 5 sources added.
FLAGGED: conflicts wrongly says no source gives a selection year or station — two specialist secondaries give 静岡県茶業試験場が1956年に育成, and Horyoku was already a named entry in Kanaya's 1960 地方適否試験園 (which also undercuts "never went through adaptability trials"); 静岡県茶業試験場 attribution remains secondary-only.
DEAD_SOURCES: none

### hoshinomidori — flagged (no edits)
FLAGGED: parents.female "Fukuoka zairai" / selectedFrom has NO primary support — PVP record carries no 育成の経過 or parentage field; registrationNumber "工芸作物第2号" uncorroborated (registry gives only 作物区分, no ordinal); buddingTime field holds 摘採期 not 萌芽期; teaTypes sencha is inference (PVP carries no use class); prose "0.6–8.1" is the range across all four white-leaf teas, not this cultivar's, and Yabukita was the reference; rarity 77/4/4/3/2 are Fukuoka prefectural shares not Yame; 種苗法 in force 1978 not "a few years earlier"; きら香 not a Yabukita sport.
VERIFIED: PVP No.71 (appl. No.35 1979-07-23, reg. 1981-02-04), breeder 井上十二生 of 星野村, full 特性の概要 matches prose, absence from 茶農林 confirmed.
DEAD_SOURCES: none

### houshun — both
FIXED: registry → PVP No.14534 granted 14 Dec 2006 (not "February 2006"), no Cha Norin number; prose + siblingCultivars corrected to same-day registration as Tenmyo (No.14535); seed collection 1977→1975 (selection 1977 kept, events now distinguished); removed tencha from teaTypes (gazette says 玉露向き; Kyoto table marks gyokuro only); added diseaseResistance (ring spot strong, anthracnose medium) where record claimed none existed; 2 sources added.
FLAGGED: buddingTime 極早生 vs PVP 早 vs Kyoto table 早生 (official sources conflict); yield "high, equal to Samidori" vs Kyoto table やや少; vigour 樹勢強 is relative-to-Samidori wording, PVP says 中; nameMeaning Byōdō-in Phoenix Hall link is folk etymology; bredAt modern name + breeder names + 育成完了 2003 unrecorded.
DEAD_SOURCES: none

### inaguchi — both
FIXED: registrationNumber null→PVP No.1676 (18 Aug 1988, appl. 2120); ring spot "fairly strong"→"medium"; added 赤枯れ cold tolerance (strong) and corrected prose claiming no cold data; named breeder 稲口勝利 of Shizuoka city (prose previously said no registration/breeder findable — false); bredAt expanded; rarity claims qualified; MAFF source added.
FLAGGED: 1986 Shizuoka prefectural station evaluation uncorroborated (MAFF names individual only); bacterial shoot blight "very weak" secondary-only, possible copy artifact from okuhikari page; yield "similar to Yabukita" vs MAFF 成木中/幼木やや多; kanji 稲口 is breeder surname not registered form; "found by chance" overstates — MAFF says raised from Yabukita open-pollinated seed garden.
DEAD_SOURCES: none

### inzatsu131 — both
FIXED: parents.female / parentNotes / selectedFrom / Lineage / History — "Manipuri No. 15 (マニプリ15号)" → "Manipur No. 5", per the peer-reviewed JARQ 38(4) paper already in its own sources (the old value traced only to a blog summarising a 2014 book); prose "(1957, 1966)" → "(both 1966)" — 1957 was a journal-ID slug, not a year.
FLAGGED: the Manipur No.5 / Manipuri No.15 conflict is genuine — worth confirming against Iida's book; "Koyanagi Mitsuyoshi co-bred Fujikaori" unverified — the blog names 森園市二 as co-developer, another source gives 小柳津 (Oyaizu); nameMeaning calls Shizu-7166 an "unnamed breeding line" while the file's own prose says it was named Yamakai in 1967 — internal contradiction; bredAt lacks the modern successor and prose/frontmatter disagree on the 1922 employer; "the same research-station tradition" overstates the link to two national-station papers; notableDescendants omits きよか (grandchild).
CROSS-FILE: kiyoka.md carries the same "Manipuri No. 15 / 1944 / 1920s" detail and flagged it as blog-sourced — needs the same correction.
DEAD_SOURCES: none

### kanayamidori — both
FIXED: buddingTime "about 4 days after Yabukita" → budding ~8 days after, plucking ~4 (release paper); cultivationShare "roughly 3%, concentrated in Shizuoka and Kagoshima" → 477 ha / 1% in 2023, and it is absent from Kagoshima's list entirely (MAFF 品種別栽培面積); recommendedRegions Kagoshima → Kyoto, Miyazaki (paper §5); cold-resistance rationale about carrying it into Kagoshima removed as unsupported; Okuyutaka lineage "F1NN8, itself S6 × Tamamidori" → Tamamidori × S6; Koshun "registered 1996" → registered 2000, applied 1996; conflicts claim that 1949 and the S6 = 静岡在来6号 reading lacked Japanese primary support is false — the release paper states both; 5 sources added.
FLAGGED: kanji 金谷みどり folk rendering (registered form is kana); teaTypes gyokuro/black tea rest on retail (MAFF 用途 煎茶 only); selectedYear null though the paper gives 1955; notableDescendants misses せいめい (ふうしゅん × かなやみどり); MAFF classes it 中生 vs the paper's 中晩生; "Kagoshima producers" uncorroborated.
DEAD_SOURCES: none

### kirari31 — both
FIXED: yield — the indices 127/150 were misread as Kirari 31's against Saemidori; they are SAEMIDORI's against Yabukita (Kirari 31 vs Saemidori is ~145/~108); corrected in frontmatter and prose; second-flush bush age 5–8 → 5–7 years; "slightly glossier and softer with more trichome" — Table 3 gives Kirari 31, Yabukita and Saemidori identical absolute grades, not a comparison; reworded.
FLAGGED: "winter-bud frost damage lower than both Yabukita and Saemidori" — the release paper contradicts itself (§3.5 says 「やぶきた」並; its own 摘要 and the NARO handbook say lower than both) — worth a conflicts line; strainNames 宮崎31号 date range 2004–2012 (摘要) vs 2004–2010 (§2) in the same paper; "Shinkoju sells it deep-steamed and roasted" — page lists 釜炒り茶 (pan-fired), not hōjicha; Haruto 34 "crossed 1997" unverified.
DEAD_SOURCES: none

### kiyoka — both
FIXED: registry listed Haruto 34 and Danshin 37 as NARO releases — handbook gives both as 育成地 宮崎県; recommendedRegions + prose attached the frost caution to the warm districts it IS recommended for, when the handbook aims it at the cooler 温暖地 outside that area; summary "buds about eight days before Yabukita" → "is picked" (budding is 13 days early); NARO 研究成果情報 added to sources.
FLAGGED: buddingTime holds the picking figure only (budding is 13 days); yield:null and "no yield figure in NARO's profile" — true of the handbook but the NARO research page gives one; diseaseResistance omits 凍害(裂傷型) 弱 and 赤枯 やや弱, which are NARO's actual stated reason for the siting caution; クワシロカイガラムシ 弱 (handbook) vs 「やぶきた」並 (NARO page); "NARO does not recommend shading" unsupported; FYZ-41 credited to NARO, chart says 国立茶業試験場; Fujikaori sharing the Yabukita × Shizu-Inzatsu 131 pairing uncorroborated; Shizu-Inzatsu 131 "1944 / Manipuri No.15 / 1920s" rest on one English blog; 樹姿 やや開張 (handbook) vs 半直立～開張 (PVP); Kirari 31 called NARO — it is Miyazaki.
DEAD_SOURCES: none

### komakage — both
FIXED: gray blight written as 輪紋病 → 輪斑病 (the file's own cited source reads 輪斑病, as do all 23 other cultivar files); cold resistance "strong — resists both red-wither and blue-wither" → 赤枯れ and 裂傷型凍害 やや強, 青枯れ 強 (record overstated red-wither and omitted laceration-type freeze injury).
FLAGGED: prose dismisses the こま=細/かげ=陰 gloss as "a garbled secondary gloss" — it appears in the same authoritative Japanese description the agronomy comes from; monument kanji missing 址 (駒蹄影園址碑) and romanisation inconsistent with frontmatter; "one of three Uji selections (with Asahi and Samidori)" comes from a retailer and CONTRADICTS asahi.md, which names the trio Asahi/Samidori/Ujihikari — cross-record inconsistency; rarity omits Yubune, Wazuka; "Sayama, Saitama recommended" rests on one product page; registered:null while asahi.md/samidori.md use 1954 for the same 育成登録 — schema inconsistency.
DEAD_SOURCES: none

### koshun — both
FIXED: registry gained PVP No.8131 (granted 2000-06-27, applied 1996-10-21) plus a new `plantVarietyRegistration` field copying tsuyuhikari.md's convention [SCHEMA ADDITION — verify against the web app's reader]; buddingTime "budding at the same time as Yabukita" was wrong — MAFF says ほう芽期はやや早生、摘採期は中生; anthracnose "not corroborated elsewhere" false — the prefectural sheet rates 炭疽病 中; lineageNote "two Shizuoka-bred aroma cultivars from the same station" wrong — Kanayamidori was bred at the NATIONAL station at Kanaya; History bullets gained exact dates; bredAt gained the modern successor name.
FLAGGED: "the tree is vigorous" — MAFF rates 樹勢は中; cold "strong" (o-cha.net) vs 耐寒性赤枯れ やや強 (prefectural sheet); 赤焼病 "weak" still only myjapanesegreentea.com and is a different trait from 赤枯れ; Kurasawa "Shizu-7111" and the 7000-series grouping unverified and inconsistent with kurasawa.md/yamakai.md; two vendor pages state the cross orientation reversed (record is right).
DEAD_SOURCES: none

### koyanishi — both
FIXED: parents.female Shizuoka zairai → Uji zairai (only primary statement of 来歴 is MAFF's 宇治在来種実生); parentNotes/selectedFrom/lineageNote/summary/Lineage prose all updated; the entire conflicts argument rested on a misreading — the 1953 journal names NO seed origin for こやにし so it never contradicted MAFF; the claim that the registry lumps it into a 宇治在来種実生 block is false (茶農林6号/7号 read 静岡在来種実生, 9号 reads 在来種 — the registry states each origin deliberately); the "same primary source" phrase conflated journal and registry, corrected; nameMeaning prose embellishments removed (record says only 選拔材料が小屋の西側にあつたからである).
FLAGGED: 1937 designation / 1955 delisting rest solely on ja.wikipedia; kanji 小屋西 is the registered 旧系統名 not the cultivar name (prose says so, frontmatter does not).
DEAD_SOURCES: japaneseteasommelier.wordpress.com 403 to fetch — row not re-verified

### kurasawa — both
FIXED: the record's core claim — repeated in buddingTime, yield, rarity, intro, History and Characteristics — that Kurasawa "never entered the prefectural or national comparison-trial pipeline" is FALSE; it was a Shizuoka 奨励品種 from 1967 to 2001, peaking at 154 ha in 1976 (Nakamura 2013, 静岡県茶業研究センター). All six passages rewritten; rarity "at least one Shizuoka specialist retailer" → Saitama (Shinkoju is 所沢市 — the file contradicted its own prose); 2 sources added.
FLAGGED: nameMeaning "city of Kurasawa" rests solely on przyprawyimatcha.pl and no such municipality exists (field's hedging is sound); documentation:sparse now understated; a sourced cultivationShare figure now exists but the key was not added to avoid schema drift; the 1996 date some pages give for Koshun is the application, not registration.
DEAD_SOURCES: japaneseteasommelier.wordpress.com 403 this session — classification not re-verified

### kuritawase — both
FIXED: prose called the 1972–75 Makurazaki trial a verdict lining up with the prefecture's decision "the following year" — chronologically impossible, the Kagoshima designation was 1966, six years before; corrected.
FLAGGED: Lineage lumps Koyanishi and Rokuro into "Shizuoka native-seed stock" — the 茶農林 list gives Koyanishi as 宇治在来種実生 and Rokuro as plain 在来種 (independently corroborates the koyanishi.md fix); "registered decades after his death in 1941" — actually 12–13 years; "the one occasion Sugiyama travelled outside Shizuoka" contradicted by ja.wikipedia (東は埼玉県、西は九州・沖縄・朝鮮半島); Shizukaori "selected in 1997" not in the release paper; kanji 栗田早生 attested only in retail listings.
DEAD_SOURCES: none

### kyoken283 — both
FIXED: conflicts dismissed Miyamakaori's "2006" as a secondary-source error — it is the separate 種苗法 registration (No.13754), distinct from 茶農林52号 (2003); conflicts called "Sai 53G17" unsupported — NARO's chart gives 埼53G1-7, the fuller name for the paper's "Yabukita G1", not a rival account; "tested across nine prefectures" → five (the nine is the later 県単 expansion); "None are published, no recorded budding date" contradicted by the same paper's 晩生で良質; "All three are recorded as Uji zairai selections" → only Gokou and Ujimidori are, the Ujihikari entry gives no origin; 2 sources added.
FLAGGED: cross year 1983 (release paper, and its own timeline fits) vs 1981 (NARO handbook chart) — contested, left; parentNotes calls the Miyamakaori paper "the only primary source describing this line" though the NARO handbook is a second; the 京研 series is larger than the record implies (113号→あさぎり, 172号→きょうみどり); conflicts (2) overstates — the secondary registry's Nagomiyutaka 2012 is also correct as its PVP.
DEAD_SOURCES: none

### kyomidori — both
FIXED: "the margin coming mostly from flavour and aroma rather than looks" — the 1954 table gives 196 vs 190, +2 each on appearance, aroma and flavour, evenly split; rewritten with the figures; "the most upright of any cultivar in that table (極直)" → shared with Samidori.
FLAGGED: tree form conflict unrecorded — 1954 bulletin says 樹姿中間形, current table says 極直, and conflicts lists only budding/yield; "only medium vigour" misreads the table's 初期生育 中 as vigour (1954 gives 樹勢甚強); Samidori listed among "cultivars registered since" though it is an older selection; intro implies a year's gap from Asagiri (茶農林18号) — same year, one number apart; teaTypes sencha rests on one retailer (official use 玉露・てん茶) and summary omits tencha; rarity conflates Kyotanabe with Uji; "alongside its gyokuro" unsupported by 心向樹's listing; "propagated by cuttings" — bulletin says 栽植 only; kanji 京みどり conventional, registered form is kana; 京研172号 in prose but no strainNames field.
DEAD_SOURCES: none

### makinoharawase — flagged (no edits)
FLAGGED: summary "judged a mediocre sencha" — the 1953 registration paper says 普通煎茶として品質良好である; the file presents only the dissenting 1979 verdict and never mentions the primary one; prose twice claims Haibara District gave the Makinohara plateau its name — false (the 2005 city took its name from the plateau); nameMeaning states 牧 = pasture more firmly than the cited source, which says the origin is 定かではない; rarity "absent from every general cultivar hub surveyed" contradicted by two of its own listed sources; missing strainNames (paper gives 牧之原早生); rarity says "dropped from a 1979 trial" — fieldwork was 1972, 1979 is publication; teaTypes kamairicha/black tea on one retailer (MAFF 用途 煎茶).
DEAD_SOURCES: none

### marishi — both
FIXED: prose named one registrant — MAFF lists both 山森美好 and 山森理佐雄 (the retailer excerpt the record followed drops the second); MAFF registry entry added to sources (primary claims were previously sourced only through a retailer's transcription).
FLAGGED: MAFF records 育成者権の消滅日 2005/03/19, nine years into an 18-year term — absent from the record; conflicts attributes the Sugiyama-Yaeho reading to Nishikien alone, Shinkoju says it too; MAFF's distinctness section also compares Marishi to おおいわせ, record cites only the Yaeho half.
DEAD_SOURCES: none (nishikien.com links work over http only — self-signed cert)

### meiryoku — both
FIXED: kanji 明緑 → 茗緑 — the release paper states MAFF designates 茗緑 outright (茶のことを漢語で茗ともいい…漢字又はローマ字で表示する必要がある場合には「茗緑」); nameMeaning rewritten to 茗 (tea plant) + 緑, with "bright green" carried by the rationale rather than a 明 character; source title typo 茶の質評価 → 茶の品質評価.
FLAGGED: the parentage conflict is real and unresolved — the 茶農林 registry table reads やぶきた×Ｚ１ while the release paper differs, and both trace to MAFF (conflicts note already states this fairly); o-cha.net gives 摘採期 1–2 days early and 耐寒性が強い against the paper's ほぼ同時期 and weak-to-frost-crack — disagreement not noted in the file; a NARO page titles it 高標高地向き品種, which may have widened the "warm regions" adaptation (page would not load); 1996 source author romanisation ambiguous; "Saeakari (Cultivar No. 55)" uncorroborated; no 種苗法 registration found, and the 1987 date is My Japanese Green Tea's own claim.
DEAD_SOURCES: none

### mieryokuho1 — both
FIXED: nameMeaning claimed 三重緑萌1号 appears in Shinkoju's cultivar index — it has no such entry, and the claim contradicted the file's own rarity field; removed the claim that MAFF lists a sibling release みえ緑水2号 "from the same programme" — that cultivar is NABANA (rapeseed), not tea, from a different station and team; "By the mid-1990s the Cha Norin system had effectively lapsed" contradicted by the very table cited beside it (Saitama took 46号 in 1997 and 50号 in 2003; Miyazaki 47/51/52号).
FLAGGED: kanji 緑萌 is a fragment — registered name is the mixed みえ緑萌1号; yield "high" vs MAFF's やや多; strain number G1N206, the 2005 伊勢茶戦略品種 adoption and the ~300 a FY2013 peak are documented but missing; 表4 quality scores are 一番茶 only but prose reads as all flushes.
DEAD_SOURCES: none

### minamikaori — both
FIXED: prose twice claimed Minamisayaka crosses Yabukita — it does not (宮A6 × 茶本F1NN27); both passages rewritten; "its Miyazaki contemporaries Saemidori and Minamisayaka" — Saemidori was bred at Makurazaki, not Miyazaki; "No source consulted gives a disease or cold resistance rating" contradicted by MAFF PVP 2158 (赤枯抵抗性及び炭そ病抵抗性の強い); added diseaseResistance and `plantVarietyRegistration` fields [SCHEMA ADDITION] and re-cited conflicts to MAFF instead of myjapanesegreentea.com.
FLAGGED: nameMeaning "the south's fragrance" plausible by analogy but no release literature found, and the 南かおり folk spelling is unverified; bredAt credits Ueno alone where the PVP lists eight breeders, and the affiliation differs from sibling files; crossedYear null (a 1989 release note implies 1966 but its abstract contradicts the registry on parents); yield null.
DEAD_SOURCES: japaneseteasommelier.wordpress.com 403

### minamisayaka — both
FIXED: bredAt "no source gives its exact contemporary Japanese name" false — NARO handbook p.52 names 宮崎県総合農業試験場茶業支場 at Kawaminami; strainNames field was absent, added 宮崎9号 [SCHEMA]; added `plantVarietyRegistration` [SCHEMA] with the omitted MAFF facts (applied 1991-06-01, right lapsed 2012-03-15); conflicts claimed 茶農林42号 could not be verified against a primary MAFF list — it is on the 茶農林登録品種一覧; Lineage said Miya A-6 was "also used independently to breed Unkai" — wrong and self-contradictory, Unkai is from the same cross; 3 sources added.
FLAGGED: teaTypes lists four, official 用途 is 煎茶 only; buddingTime labelled budding but quotes 摘採期; cold hardiness hedged where several Japanese summaries state 耐寒性が強い flatly; the station's 1970s-contemporary name still unverified and unkai.md calls it the "Kawaminami Branch" of the pre-reorganisation station — cross-file inconsistency.
DEAD_SOURCES: none

### minekaori — flagged (no edits)
FLAGGED: kanji 嶺香 unattested — MAFF registers only みねかおり (茶農林38号, PVP 2157); nameMeaning rests entirely on that unattested kanji and traces to no release literature; diseaseResistance omits the PVP filing's HEADLINE trait 炭疽病抵抗性が強い, which makes the prose claim that cold tolerance "is where it improves on Yabukita" read against the primary source; strainNames "Mi74-41" supported only by Tea Nursery (MAFF gives 宮崎3号); crossedYear/selectedYear/yield/buddingTime/regions all single-sourced to Tea Nursery; bredAt drops "General" from 総合農業試験場 where unkai.md keeps it; no MAFF URL in sources despite every registry fact coming from there.
DEAD_SOURCES: none

### mineyutaka — both
FIXED: registry gained PVP No.4835 (granted 1996-01-19, applied 1993-08-09, right lapsed 1998-01-20); bredAt/prefecture "associated with Tanegashima" → MAFF's 育成地 is Nishinoomote City with the registrant's address; yield null → やや多収; History prose claimed no source names the town and that filing vs grant was unclear — MAFF gives both; Characteristics prose claimed nothing citable was found on habit/yield/resistance — MAFF gives 樹姿やや直/樹勢強/株張り大/発根性良/収量性やや多; conflicts re-grounded on MAFF rather than ja.wikipedia; MAFF source added.
FLAGGED: teaTypes lists four types where MAFF classifies it 煎茶用品種 only — the rest are one retailer's processing styles; summary "A 1996 bud sport" conflates registration with selection (filing was 1993); Kiraka's registered name is きら香 not きらか.
CROSS-FILE ERROR: shoju.md records PVP No.4954 / application 6649 filed 1994-03-08, but MAFF shows 松寿 as No.4952 / application 6225 filed 1993-08-09. No.4954/6649 is MIERYOKUHO1's record — shoju.md appears to carry another cultivar's registration numbers.

### miyoshi — both
FIXED: yield null → 収量多く (the 1953 paper's own rating); prose "the leaves are elliptical and large" → 葉形長楕円形で緑色 — the paper never calls Miyoshi's leaves large, that trait belongs to Yabukita's and Tamamidori's entries; "No figures for yield, disease resistance, or cold hardiness are given" rewritten; strainNames added (国茶U15号 — the record quoted its siblings' strain names but omitted its own); "one of three Uji-origin selections" qualified to three Nishigahara selections, since the MAFF list gives 宇治在来種実生 for Nos. 2, 3, 4, 5 and 8; "Institute of Vegetable and Tea Science" → Institute of Fruit Tree and Tea Science; rarity's absence claims corrected — Miyoshi is measured in a 2011 NARO germplasm study and appears on one of the file's own listed sources.
FLAGGED: intro dates the registration to October 1953 — that is the journal issue date, the paper says only 昭和28年度; parentNotes.female has a duplication artefact ("(宇治種) — (宇治種) zairai seedling") also present in tamamidori.md; tamamidori.md carries the same "three Uji-strain selections" error; MAFF vs release paper disagree on Koyanishi's origin (unresolved, unmentioned in the file).
DEAD_SOURCES: japaneseteasommelier.wordpress.com 403
NOTE: WebSearch quota exhausted this session — verification ran on direct fetches only.

### narino — both
FIXED: added `applicationFiled: 2000` [SCHEMA]; conflicts claimed both the "November 2002" month and the 2000 filing were unconfirmed and rested registration on two secondary English registries — MAFF primary confirms all of it (登録番号10751, filed 2000-03-13, registered 2002-11-14), rewritten, and now records that the registrant is the individual 堀井信夫 (not the company) with the right lapsed 2011-11-15; bredAt appended; buddingTime upgraded from 日本茶備忘録 to MAFF's 特性の概要; History prose given exact dates; MAFF source added.
FLAGGED: registrationNumber null though PVP 10751 exists — repo convention reserves the field for 茶農林 numbers (same question raised in okunoyama.md and koshun.md) — worth deciding once repo-wide; "no institutional trial record behind it" loose — MAFF publishes a full morphological filing; garden age 600 vs 650 years across the company's own pages; nameMeaning null; selectedYear and the 1994 candidate-funnel narrative uncorroborated.
DEAD_SOURCES: none

### natsumidori — both
FIXED: rarity + History claimed Natsumidori is "absent from" Takeda 2007 — it appears TWICE in that paper (named in the text and listed in 表3); the same false "absent from a comprehensive 2007 survey" claim in Characteristics rewritten; nameMeaning misquoted the bulletin (品質良い → 品質がよい); "the trade bulletin that would become 茶業研究報告" → it already was 茶業研究報告.
FLAGGED: yield is 収葉量 — harvested FRESH LEAF, not made tea; numbers and units right but the basis is unlabelled; "In a follow-up study of axillary versus terminal budding" — that table is inside the same 1955 paper, not a later study; rarity's "not found in any current vendor or enthusiast guide checked" contradicts the record's own cited myjapanesegreentea.com row; bredAt historical name (農商務省 vs 農林省 in 1920); the bulletin's own 摘採期 5月3日 and 発芽期 4月1日 go unmentioned.
DEAD_SOURCES: none

### oguramidori — both (LARGEST REWRITE SO FAR)
FIXED: the record's central thesis was wrong — Ogura-midori is a CURRENT Kyoto 茶奨励品種 with a full published characteristics row, not a forgotten name, and is one of ten 宇治種 Kyoto has subsidised for replanting since 2021; rarity rewritten; bredAt/selectedFrom/lineageNote corrected from an institute selection to 民間選抜 (a private breeder's selection the institute trialled and named); registered null → 1954 and registry → prefectural 茶奨励品種; teaTypes lost gyokuro (official table marks てん茶 ◎ only); buddingTime null → 中生, yield null → 中, added diseaseResistance and cultivationShare; documentation sparse → normal; kanji 小倉みどり → null (no Japanese source writes it in kanji); prose listed Uji-midori in the 1954 batch (it is 昭和58年 — Uji-hikari was meant); prose claimed Ogura-midori and Komakage "were not developed further" and appear nowhere in prefectural literature — both are on the 奨励品種 table and both sell as single-cultivar matcha.
FLAGGED: naming year 1953 (institute chronology) vs 1954 奨励品種 — kept 1954 and recorded in conflicts; chakatsu.com's 玉露・碾茶用 contradicted by the official table; strain number, selecting grower and site still unrecorded anywhere.
DEAD_SOURCES: none

### okuharuka — both
FIXED: registrationNumber null → PVP No.23946 (granted 2015-03-11, applied 2013-03-05, registrant 埼玉県), confirmed by Saitama's own leaflet; conflicts' stale claim that the MAFF search "did not return a result" replaced with primary grant data; bredAt "the current name" was wrong — the station today is 埼玉県茶業研究所; Lineage's intermediate line "56G1-99" is superseded — the breeding institution published a correction in 茶業研究報告 139 naming 5507（埼玉13号）, both designations now recorded; 4 sources added.
FLAGGED: 輪斑病 "moderate, somewhat better than Yabukita" follows the paper's §3.5 but its own 摘要 and English abstract say やや弱 / "slightly weak" — internal contradiction in the primary source; もち病 §3.5 appears to swap the labels relative to Table 8 (the record's own "(weak)" matches the table); buddingTime 極晩生 is the paper's category while MAFF rates ほう芽期 かなり晩 / 摘採期 晩 — different scales, worth attributing; Saitama's page credits a different institute name than the paper's byline.
CROSS-CHECK: intro says "Fukumidori (1986)" while Saitama's page says 昭和63年品種登録 (1988) — consistent with fukumidori.md's established 1986 茶農林 / 1988 PVP pair, so this is a registry-tier label question, not an error.
DEAD_SOURCES: none

### okuhikari — both
FIXED: registrationNumber null → PVP No.1387 (granted 1987-08-07, applied 1986-03-24), explicitly noted as not a 茶農林 number; conflicts rewrote the "Registration unverified" clause (MAFF record confirms number, date and all four breeders — the now-404 wachaclub page is corroborated, not relied on) and gained an anthracnose note; History prose replaced its hedged caution with the confirmed record; MAFF URL added.
FLAGGED: anthracnose "strong" — MAFF's filing says やや強 while O-CHA NET (written by breeder 中村順行) and the Shizuoka guidebook say 強; teaTypes kamairicha has no primary support (MAFF calls it 煎茶用品種) and appears to rest on vendor pages; Shizu-Cy225's Hubei origin uncorroborated.
DEAD_SOURCES: none

### okumidori — both
FIXED: first-flush plucking "about 8 days" after Yabukita → about 9 (the release paper says 摘採期で9日遅い; o-cha.net's 八日 is the lowest tier); the release paper (武田ら, 育種学研究 8(3), 2006) was absent from sources and is now added.
FLAGGED: recommendedRegions is wrong in substance — the paper lists 10 奨励品種採用県 and Shizuoka and Aichi are NOT among them, while Nara, Kagawa, Kumamoto and Oita are missing; the list looks derived from o-cha.net production notes rather than 奨励品種 status; diseaseResistance omits 輪斑病 強 and 裂傷型凍害 中 (with the paper's autumn-fertiliser warning); "thick with theanine and notably low in bitterness and astringency" contradicted by the paper's own table (amino acids 1.76% vs Yabukita 1.78%, catechins 11.74% vs 11.83% — essentially level) and rests on retail sources; 釜炒り茶 missing from teaTypes; "put forward in February 1974" unsourced; Lineage claims "two full siblings" (only one sibling line) and that "none of the four records mention" the route — harumoegi.md and sakimidori.md both do; strainNames prefix 茶本 not in the registry table.
REPO-WIDE: bredAt "reorganised since as NARO's Institute of Vegetable and Tea Science" is outdated (abolished 2016) and appears in shizu7132, okuhikari, okuyutaka, sunrouge, okumidori — kanayamidori.md already has the correct phrasing. Also 国立茶業試験場 is not the period name (paper says 農林省茶業試験場).
CROSS-FILE: sakimidori.md:80 and shunmei.md:74 both call F1NN29 a PARENT of Okumidori — it is Okumidori's own strain name.
DEAD_SOURCES: none

### okumusashi — both
FIXED: Yamatomidori called "the latest-picking and most cold-hardy of the four compared" → latest-picking only (the table rates it 耐寒性 大, same as Yabukita and Sayamamidori; Okumusashi alone is はなはだ大); "transferred to the newly established Saitama Prefectural Tea Research Institute" → newly ATTACHED to (the institute dates from 1928); "all of whom had stayed with the line since the Kumagaya days" — Yonemaru joined only in 1952, only Fuchinoue and Tanaka span 1947–61; intro "roughly ten days later than Yabukita and Sayamamidori" → ten after Yabukita, four after Sayamamidori.
FLAGGED: kanji 奥武蔵 unattested as the registered rendering; buddingTime records 摘採期 not 萌芽期, and the paper's English abstract (7–10 days) differs from its Japanese body (約10日); the paper's English abstract claims high yield, contradicting its own Japanese text and yield table (file follows the Japanese — correct); "Sanui Hajime" reading unverified; Sayamamidori/Yamatomidori/rarity claims secondary-only.
DEAD_SOURCES: japaneseteasommelier 403; ja.wikipedia 奥武蔵 is the region article and supports only the place name; ocha.tv has no Okumusashi entry.

### okunoyama — both
FIXED: "Kyoto's recommended cultivars, which currently number just four" → twelve (the cited PDF is three pages; only page 1 had been read); source annotation corrected; conflicts claimed the selection funnel and years "appear in no source found" — false, chapter 4 of Horii's own 7 Stories, already in sources, gives 1981 start, 2,000→58→24→8, final two 1994, registered 2002; prose claimed MAFF credits colour as the basis for legal distinctness — MAFF rests it on mature-leaf shape, budding time and shoot number; buddingTime reworded (MAFF gives absolute ratings, not a comparison to Yabukita/Asahi).
FLAGGED: nameMeaning attributes an English gloss to Horii that is not on their English site; selectedYear null because Horii's two accounts disagree; a source author's name transliteration.
DEAD_SOURCES: none

### okuyutaka — both
FIXED: lineageNote + prose called Shunmei a HALF-sibling — it comes from the same ゆたかみどり×F1NN8 cross in the same orientation, so they are full siblings (the repo's own shunmei.md already said so); registry "Ministry of Agriculture and Forestry" → MAFF (農林省 was renamed in 1978, five years before this 1983 registration; this was the only post-1978 record still using the old name).
FLAGGED: documentation says no release paper was retrieved — one exists (安間・渡辺・武田 1983) with NDL URLs; strainNames omits 茶本F1NN50 (1967–74), making the prose wrong for the clonal-comparison phase; selectedYear 1964 is the programme start, not this line's selection year (1965/66); recommendedRegions omits Fukuoka; buddingTime "late" vs the literature's 中晩生; the cold rating drops the "comparable under severe damage" caveat; caffeine (higher than Yabukita) omitted, which sits oddly beside the shading speculation; bredAt successor stale (see repo-wide note) and the 1958 site was 東海近畿農業試験場茶業部.
DEAD_SOURCES: none

### rokuro — both
FIXED: "Nakamura Yorishito" → Nakamura Yoriyuki (中村順行), in prose and the source title; "by 1972 Yabukita alone held 88% of Shizuoka's tea fields" → of the CULTIVAR-PLANTED area (4,092/4,676 ha; of all tea fields it is 20%); conflicts' hypothesis that 玉露 was a mis-keying of 玉緑 is REFUTED by the 1961 Himemidori paper, which records that sencha cultivars including Rokuro were being shaded for gyokuro in Yame — field rewritten, source added.
FLAGGED: parents.female/selectedFrom/lineageNote/summary say "Shizuoka Zairai" but the MAFF registry gives 茶農林9号's 来歴 as bare 在来種 while 6/7号 read 静岡在来種実生 — the registry withholds the locality deliberately, so this is inference; no strainNames field though both primaries record 旧系統名 六郎, and kanji 六郎 is the strain name not the registered form; "3区6号地 of the trial ground" overreads the paper; "wartime demand" — the source says 輸出の拡充強化.
DEAD_SOURCES: none

### ryofu — both
FIXED: bredAt successor "NARO's Institute of Vegetable and Tea Science" → Institute of Fruit Tree and Tea Science (野菜茶業研究所 dissolved in the April 2016 reorganisation — SAME ERROR as fushun.md); documentation claimed no release paper was retrieved — Kondo et al., 茶業研究報告 87 (1999) exists and is now in sources.
FLAGGED: cold hardiness is a real conflict (handbook says 裂傷型凍害は「やぶきた」並 while the release paper abstract states it resists bark-splitting injury) so conflicts:null is understated, and the prose inference "not a cold-hardiness cultivar" rests on the handbook alone; bredAt's historical name ambiguous between the 1972 cross era and the 1997 registration affiliation; crossedYear absent though firmly established as 1972; registered:1997 correct but the 茶農林 grant (July) and the PVP filing (May) are unrelated events.
DEAD_SOURCES: none

### saeakari — flagged (2 sources added, no values changed)
ADDED: the 茶農林登録品種一覧 (positively confirms registrationNumber:null — the list ends at 52号) and MAFF PVP 22070 (confirms 2012-11-14 registration).
FLAGGED: recommendedRegions "Grown nationwide" — two NARO sources disagree (handbook says 全国的に栽培が可能 but NARO's variety page and the breeding paper say 静岡以南の温暖地から暖地), conflicts:null should record it; teanursery.com in sources states Saeakari is "tea cultivar No.55" registered 2011 — false, no 茶農林53–55 exists, contamination risk; lineageNote's "Uji reaches it via Asatsuyu" is incomplete — Z1 is a natural-cross seedling of たまみどり, so there are two routes; parentNotes omits that Z1 is also めいりょく's pollen parent; "Fushun registered 1991, twenty-one years earlier" mixes registries; bredAt gives only the modern name where siblings carry the historical one; 交配年 1989 and 系統名 枕崎30号 documented but absent; 輪斑病 "somewhat strong or better" understates the PVP filing's 強.
DEAD_SOURCES: none

### saemidori — both
FIXED: buddingTime "6.7 days early to budding, 4.4 to harvest, averaged across trial sites and years" — those are the Miyazaki breeding site alone; the actual all-site average is 5.3 / 2.6; both now stated, plus NARO's 4–7-day range; nameMeaning called 冴え緑 "a folk rendering" — NARO's handbook itself glosses the name as 「さえみどり」（冴え緑）, reworded (kanji:null retained since MAFF registers hiragana); yield conflated two footnotes — 1979–1989 applies to phenology, 6–9年生 to fresh-leaf yield; NARO handbook added to sources.
FLAGGED: yield "clearly beat Yabukita across every flush" — the 2022 NARO handbook says 収量は「やぶきた」と同程度 and the multi-site trial puts it at index 112/125, so the "upper bound" caveat is understated; cultivationShare "roughly 4%" sourced only to a WordPress list, no primary acreage figure found; conflicts overstates the survival range (Yabukita's is 6–100%, not 1–100%); "a deeper steam is often used to bring out the colour" has no primary support and the handbook points the other way.
DEAD_SOURCES: none

### sakimidori — both
FIXED: Lineage said the MAFF table records F1NN29 as Okumidori's PARENT — the column is 旧系統名, it is Okumidori's own former strain name (confirms the okumidori.md cross-file flag; shunmei.md:74 still needs the same fix); strain history corrected to Mi84-117 from 1984, then 宮崎15号 from 1988; trial scope "fifteen stations" → adaptation at fifteen, characteristic testing at two more; four author romanisations fixed per the paper's own English byline (Tsuruyoshi, Maso, Sadaichi, Tsugio); conflicts wrongly called the 1996 date "an English machine summary" — it is the paper's own printed English Summary.
FLAGGED: anthracnose "weak" contradicts the release paper's 炭疸病…中 (NARO handbook implies weak) — contested; もち病 (中) missing from the list; prose calls Minamisayaka "Cha Norin No. 42, registered 1994" mixing registries (茶農林42号 is 1991, PVP 3932 is 1994); bredAt omits the 茶業支場; registrationNumber gives only "August 1997" where the paper has 1997年8月19日; teaTypes fukamushi rests on a retailer.
DEAD_SOURCES: none (hinshu2.maff.go.jp unreachable from that agent's environment)

### samidori — both
FIXED: grey blight "weak / Pseudocercospora" → やや弱 / 輪斑病 — the prefecture's table says やや弱, and 輪斑病 is Pestalotiopsis longiseta, so the binomial was simply wrong; prose credited the Institute with selecting Asahi — Kyoto's page names the grower 平野甚之丞 (same error asagiri.md had); characteristics PDF added to sources.
FLAGGED: recommendedRegions Aichi and Fukuoka have NO source in any tier; yield やや多 vs the 奨励品種 table's 中 (both Kyoto official); white peach scale "weak" traces only to myjapanesegreentea.com and cold "strong" appears in no primary source (the table rates 府内寒冷地適応性 適, which is not a strength rating); registered:1954 is the 育成年, and no source says that was the 奨励品種 designation year — prose conflates them; teaTypes omits sencha (table marks 煎茶 ○); "registered in February 2006" month uncorroborated; the Koyamaen founder link is speculative.
DEAD_SOURCES: ja.wikipedia 宇治茶 resolves but contains no さみどり or 小山政次郎 — supports nothing here.

### satowase — both
FIXED: registrationNumber null → PVP No.1025 (granted 1986-07-11, applied 1985-03-22, right lapsed 1996-07-12); parent kanji 阿部1号 → 安倍1号; selectedFrom/parentNotes corrected to 自然交雑 open-pollinated seed and 固定品種; bredAt gained breeder 佐藤光輝 and address; prose claimed the prefecture was "inferred from a blog association rather than a registration record" — the registration gives the breeder's Shizuoka-city address outright; diseaseResistance null → もち病 strong plus five medium ratings, and prose "no source gives disease resistance or tasting notes" corrected with the filing's quality ratings; buddingTime gained 萌芽期やや早/摘採期早; yield now records the conflict (filing says 成木の収量性やや少 vs Tanaka's 989 kg/10a); the claim that MAFF "could not be queried directly" removed; nameMeaning's Sato = breeder surname confirmed (佐藤光輝); MAFF source added.
FLAGGED: kanji:null kept but the registered name さとう早生 already carries kanji — 佐藤早生 remains unattested; "unusually upright leaf habit" — the filing says 樹姿は開/開張型, Tanaka's 48.2° is leaf-blade inclination only; lineageNote calls Abe No.1 "already a selected individual" — 安倍 is a Shizuoka river/valley name, a locality strain is at least as likely.
DEAD_SOURCES: none

### sawamizuka — both
FIXED: registrationNumber null → PVP No.4292 (granted 1995-03-09, applied 1992-07-31 by Shizuoka Prefecture, right lapsed 2013-03-10), styled to match inaguchi.md/shoju.md; History claimed the registration "is not stated outright by any single source" — false, the Shizuoka leaflet already in sources says 平成7年に種苗法による品種登録が行われました and MAFF carries it outright; MAFF source added.
FLAGGED: diseaseResistance "ring spot / gray blight (medium)" and "bacterial shoot blight (weak)" trace only to myjapanesegreentea.com and MAFF rates NEITHER — "gray blight (medium)" is almost certainly a mistranslation of もち病抵抗性 中 (blister blight); MAFF's actual ratings are 赤枯やや強/青枯強/炭そ病やや強, recommend replacing; cold rating conflict (MAFF 赤枯 やや強 vs leaflet 中); "carried through regional trials from 1974, named 1992" is myjapanesegreentea.com only; the leaflet's warning that young plants are weak to 裂傷型凍害 is absent; bredAt omits the parent institute.
DEAD_SOURCES: none

### sayamakaori — both
FIXED: conflicts said Kanaya Homare's registration number "could not be pinned down" — it is PVP No.17961 (2009-03-19, same applicant); Sainomidori dated 2006 in two prose passages → 2003 (two-registry trap: 茶農林50号 is 2003, PVP 13753 is 2006); Nanmei attributed to Miyazaki → NARO's Makurazaki station; source added.
FLAGGED: diseaseResistance says no ratings were found for ring spot — NARO's handbook rates Sayamakaori by name (輪斑病 strong, plus scale-insect resistance), so the negative claim is false; conflicts claims the 茶農林 table routes MIYAMAKAORI through さやまかおり — it does not (52号 = 京研283×埼玉1号, both sources agree on さやまみどり, so there is no conflict); the Musashikaori conflict IS real; buddingTime and cultivationShare rest on secondary/prefectural sources only.
DEAD_SOURCES: wachaclub.com/dictionary/archives/5464 (摩利支) — 404

### sayamamidori — both
FIXED: prose called Sayamakaori "Sayamamidori's own descendant" — it is 茶農林31号, やぶきた実生, and the claim contradicted the record's own conflicts and rarity fields.
FLAGGED: kanji 狭山みどり is a folk rendering (registered form is hiragana); notableDescendants incomplete — はるのなごり (埼玉1号 × 宮崎8号) is a fifth DIRECT seed-parent descendant, plus おくはるか and なごみゆたか; Characteristics ¶2 is likely misattributed — "thicker branches", "notably glossy", "rounder in outline" are verbatim the Okumusashi paper describing OKUMUSASHI, and the supporting figures sit in scanned images that could not be read, so they are unverified; buddingTime "medium to medium-late" vs the paper's flat 中生種; "the same original Uji seed stock as Asatsuyu" is inference — the paper gives Asatsuyu a distinct chain; Beniibara / Kimura Noboru absent from the handbook, the 茶農林 table and MAFF's PVP DB.
DEAD_SOURCES: japaneseteasommelier 403 — its conflicts claim could not be re-checked

### seimei — both
FIXED: selectedYear null → 2000 (individual F189447 from 58 F1 seedlings, per the release paper); yield "no kg/10a figure located" → 1,075 kg/10a at Makurazaki 2008–2012 vs Saemidori 758 and Yabukita 489; Lineage called Fushun a "NARO Makurazaki-line cultivar" with "no registration record" — it was bred at NARO KANAYA and is registered (PVP 3697, Oct 1993); summary "buds about four days before Yabukita" → "is plucked" (萌芽期 −5, 摘採 −4), and "out-yields both parents" → out-yields Yabukita and Saemidori (Yabukita is not a parent); the ~1.4-fold decade growth is matcha PRODUCTION, not shaded acreage, and the press release does not tie it to export demand; conflicts "four distinct dates" → three.
FLAGGED: bredAt — NIVTS did not exist until 2001, so the 1992-era name is wrong, but no source states it outright; strainNames omits 枕系49-8; documentation:null though every sibling carries a value and Seimei has a 21-page release paper; anthracnose 中 (press release/handbook) vs やや弱 wound-inoculation (paper) vs 中～やや弱 (成果情報); クワシロカイガラムシ "on par with Yabukita" vs the paper's lower incidence; Kirari 31 called "a different station" — it is Miyazaki Prefecture's, not NARO's.
DEAD_SOURCES: none (MAFF's record shows no 交配親, so parentage rests on NARO sources)

### shizu7132 — both
FIXED: trial sites "its Fuji and Nakagawane branches" → the Nakagawane venue was a TOWN agriculture and forestry centre, not a station branch (paper also names 本川根町須山 and 森町大河内 as further test sites).
FLAGGED: selectedYear null while the collection's own kurasawa.md dates this line's selection to 1967 — the two records disagree in specificity (source is secondary and now 403s); summary states "genuine coumarin-driven cherry-leaf aroma" as fact when J-Stage and CiNii carry no coumarin or 桜葉様香気 analysis for this line — the prose hedges it correctly, the summary does not; "reddish new shoots may have kept it out of contention" is a grower/retailer account, and kurasawa.md quotes a different reason; "open-pollinated (自然交雑)" comes from 心向樹, the breeding paper says only 静7132（やぶきた実生）; kana null.
DEAD_SOURCES: none (ja-shimizu.org now serves a TLS-mismatch page but the record correctly cites the Wayback copy)

### shoju — CLEAN (no edits)
The cross-file lead was a FALSE ALARM. shoju.md records PVP No.4952 / application 6225 / filed 1993-08-09 — exactly what MAFF shows — and has done so in every commit touching the file. It never contained No.4954/6649 (that is みえ緑萌1号's record). The mineyutaka agent misattributed those numbers.
Verified line by line against MAFF 4952: 松寿（ショウジュ）, breeder 松下栄市 of 西之表市, くりたわせ枝変わり (supports parents.male:null), 極早生, 収量性やや少, 消滅日 1998-03-19 (the file's term/lapse hedge is correct), and the entire Characteristics paragraph matches the registry row for row. diseaseResistance:[] is correct — MAFF carries no ratings.
FLAGGED: 松寿院/篤姫 etymology and the Kuritawase Shizuoka-vs-Kagoshima argument are secondary-only but already labelled as such.
DEAD_SOURCES: none

### shunmei — both
FIXED: the "1988 vs 1990" conflict was not a conflict — it is the two-registry split (茶農林37号 1988; PVP 2159 granted 1990-04-03); recommendedRegions "central Japan and northern Kyushu" → the registration's 東海、四国及び九州の降霜の少ない温暖な地域; Lineage called F1NN13 and F1NN29 lines "never released as cultivars themselves" — F1NN13 IS Kanayamidori's 旧系統名 and F1NN29 IS Okumidori's (this is the error okumidori.md and sakimidori.md flagged — now fixed at the source); "F1NN27 used in breeding Minamikaori" wrong — Minamikaori is やぶきた×宮A11, and F1NN27 is the seed parent of Sakimidori and Harumoegi and pollen parent of Minamisayaka; "S6, F1NN8's own mother" → pollen parent; Okuyutaka "about two days after Yabukita" → about a week; 2 MAFF sources added.
FLAGGED: crossedYear 1958 still vendor-sourced (no release paper exists); buddingTime "4–5 days before Yabukita" — registry says only 早生; kanji 春茗 appears in no reachable Japanese source; bredAt right for the 1958 cross but not for 1988; the cold rating's "comparable to Yabukita" is a secondary phrasing over absolute registry ratings; rarity's "handbook covers 1991 onward" is an inference, not stated policy.
DEAD_SOURCES: ocha.tv page never mentions Shunmei; japantea-chachacha's entire entry is one sentence with no registration, parentage or budding data.

### sofu — both
FIXED: four disease ratings all wrong — anthracnose and 赤葉枯病 "medium" → やや強 (and the frontmatter contradicted its own prose), 赤枯 "medium, on par with Yabukita" → やや強, 青枯 and 裂傷型凍害 "weak" → やや弱; buddingTime's 4–7 day range was attributed to "secondary sources" when it is NARO's own handbook; prose called Fujikaori a "full sibling bred from the same two parents" — it is the RECIPROCAL cross (Fujikaori has 静印雑131 as seed parent); "Manipuri No. 15" → "Manipur No. 5" (same correction as inzatsu131.md — confirms that fix); a source host that no longer resolves was updated and the 茶農林 list added.
FLAGGED: crossedYear null / selectedYear 1977 — NARO's DB calls 1977 the selection year while the handbook's chart labels it 交配; teaTypes kamairicha has NO primary support (registry says 煎茶・半発酵茶); yield "young bushes slower to bush out" is contradicted by both NARO sources (幼木期の生育は優れる); mochi disease 中 (DB) vs やや弱 (handbook) and anthracnose 中程度 (handbook) vs やや強 (DB) — contested between NARO's own sources; Shizuoka 奨励品種 "since 2005" unconfirmed; the Shizu-Inzatsu 131 selection details rest on a WordPress blog.
DEAD_SOURCES: none

### sunrouge — both
FIXED: registrationNumber null → PVP No.21262 (registered 2011-12-20, applied 2009-06-03, 40-year term, held by NARO); conflicts + History attributed the 2011 date to two secondary sites, now cited to MAFF with the exact date; Characteristics "cold hardiness is moderate, short of Yabukita's" → NARO rates 赤枯れ and 裂傷型凍害 強, 青枯れ やや強; 2 sources added.
FLAGGED: History says it was bred at "the Kurume Branch of the Ministry of Agriculture and Forestry's Vegetable and Tea Science Experiment Station — now NARO's Makurazaki Tea Research Station" — almost certainly wrong on all three counts (Kurume was the vegetable branch and never became Makurazaki; the ministry was 農林水産省 by 1993; MAFF and the handbook both give 育成地 枕崎), but the 2005 bulletin PDF has broken font encoding so the correct 1993 station name could not be sourced; "Nippon Paper Group held a patent until 2013" rests on one secondary site and MAFF shows rights held solely by NARO to 2051; "95%+ survival with a refined propagation-bed method" overstates Ikeda (2021), which reports that with ORDINARY cuttings; several 1994–2004 dates unverified for lack of an extractable text.
DEAD_SOURCES: none

### takachiho — both (many misread tables)
FIXED: buddingTime's comparison partner was Unkai, not Yabukita — the table carries only うんかい and たかちほ, and the old text credited "Yabukita's 31 March / 5 May"; yield 1,743/2,284 kg/10a are the EIGHTH and NINTH years not seventh and eighth, and the 対たかちほ比 119/130 means Unkai OUT-yielded Takachiho, not that Takachiho was "19–30% below" — same inversion in the years 3–5 figures; anthracnose 判定 is 中〜弱, not medium; mochi disease had no 判定 column at all, reworded to the actual field survey; cold hardiness — the table rates Yabukita やや強, IDENTICAL to Takachiho, where the old text said Yabukita was "strong"; the 1953 breakdown is eight sencha, not ten; 朝倉 is Kochi's station, not Fukuoka; "medium vigour" → strong (the file's own History already said strong); Minekaori "around 1990" → 1988.
FLAGGED: mature leaf "medium-sized" vs the 1953 paper's 大きく (sources conflict); "no anthocyanin colouration" and "soft-textured" unsourced; kamairicha quality "good" understates 品質優良; "the two are comparable on aroma" — Unkai scores 18.0 vs 17.1, measurably better; teaTypes plain sencha not in the Shinkoju listing.
DEAD_SOURCES: none

### takanewase — both
FIXED: buddingTime + two prose passages claimed it buds and picks earlier than Yabukita AND earlier again than Surugawase, Oiwase and Yamakai — the MAFF registry distinguishes it from those three on shoot number, red-blight resistance and leaf characters, NOT earliness, which appears only against Yabukita; prose called Makinohara "Shizuoka's second-largest tea area after Shizuoka City" → first in Japan for aracha output, second nationally in garden area.
FLAGGED: "open-pollinated" (in selectedFrom, parentNotes, lineageNote, summary and prose) is asserted flatly — MAFF says only 「やぶきた」の実生苗から選抜 and never says 自然交雑; kanji 高嶺早生 is uncorroborated anywhere reachable and 高根早生 is equally plausible, so nameMeaning's etymology rests on an unverified spelling; the reading "Muramatsu Hoichi" is unsourced (the cited table itself prints the reading as unknown); prose says both registry tables confirm the Yabukita-seed origin — only one does.
VERIFIED: reg. 898, filed 1984-02-20, registered 1985-07-18, 18-year term with rights lapsing 1994 (the record IS internally inconsistent, as it says), breeder 村松穂一, all ratings, and no 茶農林 number.
DEAD_SOURCES: none

### tamamidori — both
FIXED: parentNotes.female duplication artefact removed (confirms the miyoshi.md lead); Lineage "one of three Uji-strain selections registered in the same 1953 cohort" → three NISHIGAHARA selections, with a note that MAFF records FIVE 1953 cultivars as 宇治在来種実生 (Nos. 2,3,4,5,8) — confirms the second lead; leaf shape — the paper says 葉は楕円形 (elliptical), not 稍円形, so the quoted Japanese, the "somewhat rounded" gloss and the Characteristics claim that 稍円形 is "a distinct term from plain 楕円形" were all wrong; Takachiho quotation 釜炒り茶 → 釜炒茶; Saeakari "registered 2011" → 2012 (repo's own saeakari.md agrees); "Institute of Vegetable and Tea Science" → Institute of Fruit Tree and Tea Science.
FLAGGED (significant): Meiryoku is listed as a Tamamidori descendant via Z1 in notableDescendants, summary and prose — but MAFF's own 1986 dossier gives Meiryoku as やぶきた × やまとみどり with no Z1, and meiryoku.md already resolves this the other way. Two primaries conflict and the change ripples through four fields; if followed, Tamamidori loses Meiryoku and "Z1 used as a parent three times" becomes twice. NEEDS A DECISION.
FLAGGED: selectedYear 1940 is the 育成 line-fixing year, not a selection year; Saeakari credited to the Kanaya narrative though its 育成地 is Makurazaki.
DEAD_SOURCES: none

### tenmyo — both
FIXED: registry gained PVP No.14535, granted 14 Dec 2006 — the same day as Houshun's 14534, confirming that lead — with breeders and the note that no 茶農林 number exists (registrationNumber left null per repo convention); prose "registered together in 2006" given the exact date and both numbers; diseaseResistance — both ratings were flagged in prose as uncorroborated when both are official (輪斑病 中 in the gazette, 炭疽病 弱 / 輪斑病 中 in Kyoto's table), entries now carry their source; added selectedFrom and strainNames [53-38] to match houshun.md's field set; 2 sources added.
FLAGGED: prose calls it "the same 1977 batch of Samidori seedlings" — the gazette dates seed collection to 1975 and only selection to 1977 (same issue as houshun.md); yield "high" is the institute's wording where Kyoto's table rates 収量性 中; 摘採期 やや早 (PVP) vs "1–2 days later than Yabukita" (institute); 樹勢・株張 rated 中 in the table against the prose's "strong vigour and broad spread"; teaTypes gyokuro is stronger than the record implies (table marks 玉露 ◎); nameMeaning "Exhibition" reads as machine translation of 展茗.
DEAD_SOURCES: none

### terakawawase — both
FIXED: added cold hardiness (strong) from MAFF 2092 and corrected the prose "no cold-hardiness data was found"; mature leaf "with few creases" → creases are 中, it is the MARGIN WAVES that are やや少; buddingTime cited only the Asahi comparison where the registration states it is earlier than BOTH Yabukita and Asahi; prose called Asahi "one of the earliest Uji cultivars" — Kyoto sources (and this repo's asahi.md) give 中生, on par with Yabukita; "ran the statutory 18 years and lapsed on 7 February 2002" was self-contradictory — the term ran to 2008 and the right lapsed early, twelve years in; tencha quality "good colour and taste with a medium aroma" → 形状・色沢 上, 滋味 上, 香気 中上; yield replaced with the registration's 幼木やや多 / 成木多; "Asahi and Asatsuyu in Uji before it" — Asatsuyu was selected at Kanaya from Uji zairai seed; MAFF source added.
FLAGGED: the registration calls it a 固定品種, not a 栄養系, so the prose's "every bush is a clone" is plausible but not what the primary says; lineageNote groups Asatsuyu under "chosen and cloned by a private grower" — it was a research-station selection; recommendedRegions presents origin plus observed Mie cultivation as if official (PVP records carry no such data); tasting notes unverified this session.
DEAD_SOURCES: none confirmed (wachaclub live URL 404s but the record cites a Wayback capture this environment blocks)

### toyoka — both
FIXED: nameMeaning called 豊香 "the conventional kanji gloss used on vendor pages" and read it as 豊 (abundant) + 香 — Saitama Prefecture states verbatim that the name comes from 豊岡 (the pre-relocation test site) plus 香, and 豊香 is the prefecture's own rendering; matching prose sentence rewritten.
FLAGGED: bredAt 埼玉県茶業試験場 vs 埼玉県茶業研究所 — Saitama's own page applies the names retroactively and backwards chronologically, so neither is safely primary (the 豊岡試験地 detail is solid); the "current recommended cultivars" prose omits that the page also lists Yabukita and Sayamakaori (the core claim that とよか is absent holds); "NARO's pedigree charts for Saitama's cultivars only run from Saemidori (1991)" — Saemidori is a NARO cultivar, not Saitama's, and the earliest Saitama entry is さいのみどり (2006); the 1976 release article 農業技術協會 31(8) is not in sources.
DEAD_SOURCES: none

### tsukasamidori — flagged (no edits)
FLAGGED: parents.female/selectedFrom/summary/lineageNote/intro all say "Shizuoka zairai" but MAFF No.511 says only 在来種 with no prefectural qualifier — the attribution is inferred from the registrant's address, and the body's own Lineage section quotes it correctly while the frontmatter states it as fact; rarity "Not found on any vendor, hub, or reference site consulted" is contradicted by two sites the file itself cites; the intro conflates the 区別性 list (網もち病・輪斑病 only) with the separate 特性の概要 (which is where anthracnose belongs) — the Characteristics section has it right; teaTypes sencha is a sound inference but the registration has no 用途 field.
VERIFIED: MAFF No.511 registration 1984-03-19, application 702 filed 1983-01-11, breeder 山崎裕司 of 俵峰, rights extinguished 1992-03-20, and the entire characteristic table match exactly.
DEAD_SOURCES: japaneseteasommelier 403; the Weblio mirror in sources has EMPTY 育成の経過 and 特性の概要 sections, so it does not actually mirror the characteristic data the file leans on — use the MAFF page.

### tsuyuhikari — both
FIXED: diseaseResistance had the "level with Yabukita" rating attached to the WRONG trait — the paper says cold (赤枯れ) resistance is BETTER than Yabukita's and もち病 is the one that merely matches; same correction in Characteristics prose; a J-Stage source URL 404'd and was replaced with the real article; a bare hinshu2.maff.go.jp root URL replaced with the record deep link (No.11103, 2003-03-17); documentation dropped "though the paper itself was not retrieved".
FLAGGED: "cultivation outside Shizuoka was restricted in 2021" appears in recommendedRegions, rarity, summary AND prose but traces only to teanursery.com — no Japanese source found; recommendedRegions "suitable nationwide" — the paper scopes it to 静岡県では茶栽培地帯の全域; teaTypes tencha/kamairicha/fukamushi and "potential for oxidised styles" are secondary-only (paper and MAFF say 煎茶用 only); yield "notably strong autumn crop" misreads 秋整枝量 (trimming volume); nameMeaning incomplete — the paper glosses ひかり as 茶業に光明を与える; the 静7132 details match shizu7132.md but rest on retail pages there too.
DEAD_SOURCES: two fixed in place (a 404 J-Stage contents URL and a bare MAFF root URL that supported nothing)

### ujihikari — both
FIXED: conflicts claimed japaneseteasommelier lists Uji-hikari as "Registered, 1954" — it actually places it in the NON-registered table, so the supposed registration conflict does not exist and the source agrees with the Institute; conflicts + Lineage said the Kyoto page labels Asahi, Samidori and Gokou 宇治在来種選抜 — it labels UJIMIDORI too, and Uji-hikari's 京研170号 is the only one of the five WITHOUT an origin annotation; yield's "short picking period" was attributed to the Kyoto Institute, which says no such thing (both Kyoto documents give only 収量 中) — attribution moved to Matcha Direct, claim kept.
FLAGGED (significant): the Uji-zairai origin is stated as fact in selectedFrom, parents.female, parentNotes, lineageNote, summary AND the opening prose, but NO primary source supports it — the prefectural page uniquely gives this cultivar no 来歴, and the only source offering one says "Kyoto indigenous tea tree", not Uji; registered:1954 sits against the record's own conclusion that it was never registered (1954 is 育成年); rarity's ranking omits three cultivars the same list puts ahead of it; "thinnest and palest-leaved of the three" contradicted by the table (Samidori is 淡緑 too, Asahi's covered leaf is 極軟); prose calls a 新葉 row the mature leaf.
SCOPE DEVIATION: this agent also edited apps/web/content/cultivars/ujihikari.md to keep it byte-identical. All other agents touched only research/.
DEAD_SOURCES: none

### ujimidori — both
FIXED: teaTypes [gyokuro, tencha] → [gyokuro] — Kyoto's table marks 玉露 ◎ only and leaves てん茶 blank, and the frontmatter contradicted its own prose; buddingTime "medium" → 中早生, 2 days earlier than Yabukita; diseaseResistance field was ABSENT and the prose claimed "no disease-resistance ratings were found at all" — the table rates 炭疽病 やや強 and 輪斑病 強; yield null → 中, and "no yield figures survive" corrected; registry "unregistered" → Kyoto 茶奨励品種 and one of the ten 宇治種; recommendedRegions gained the 寒冷地は避けた方がよい caveat; 2 sources added; summary "mid-season" → "medium-early".
FLAGGED: yield disagreement between two official Kyoto publications (table 中 vs institute page やぶきた同等で多い) recorded in conflicts rather than resolved; the 2009–2010 blending trial and the 1985 5.9 g figure rest solely on teanursery.com; registered:null retained (1983 is a selection year).
DEAD_SOURCES: none

### unkai — both
FIXED: nameMeaning + History claimed "the 1971 release paper does not state why the name was chosen" — the paper has a §9 命名の由来 (the 雲海 of the Kumamoto/Miyazaki mid-mountain kamairicha districts, plus "spreading like clouds"); tannin "roughly one percentage point higher than either" → ~1pt ABOVE Yabukita and ~1pt BELOW Takachiho, with T/N ratios added; 1965 trial sites — "Kagoshima Prefectural Tea Experiment Station and a further Miyazaki station" → MAFF's NATIONAL station and Miyazaki's Miyakonojo farm (Kagoshima appears separately, 1969); cold/disease "rated 強 across the board, ahead of Takachiho and Yabukita, both rated only やや強" is not in the paper at all, replaced with its actual 強/極強 ratings and the −15/−17°C cutting test; Minekaori "seed parent" → POLLEN parent; intro called Izumi a Miyazaki cultivar — it was bred at 九州農業試験場; source page range 7–10 → 7–22; 茶農林 list added.
RESOLVED LEAD: bredAt is right as written — the paper gives 川南分場 of 宮崎県農業試験場 at the time of the 1952 cross and 宮崎県総合農業試験場茶業支場 by publication, so unkai.md and minamisayaka.md are both correct for their respective eras.
FLAGGED: buddingTime "about 2 days later than Yabukita" is not in the paper, which compares to TAKACHIHO (発芽期 2–5 days later, 摘採期 1–3 earlier); the prose dates sit in an unextractable table image; the "(strong)" disease labels are a coarse gloss; teaTypes sencha/fukamushi/black tea rest on shinkoju alone (the paper evaluates kamairicha only).
DEAD_SOURCES: none

### yabukita — both (the reference cultivar)
FIXED: bredAt and History said the cultivar was "trialled and promoted after his death by Shizuoka Prefecture" — the 1953 paper gives 昭和10〜21年 (1935–1946), so the station's work began SIX YEARS BEFORE Sugiyama's 1941 death; both passages corrected; notableDescendants was missing Minekaori (seed parent) and Ryofu (pollen parent), both of which have records in this collection; prose pollen-parent list gained Ryofu; the record contradicted itself on its own corpus size — lineageNote said "twenty-one of the seventy-one records" and prose said "twenty-one of the sixty-nine" — both now "twenty-four of the eighty-two" (verified: 82 files, 24 name Yabukita in parents); the 1953 registration paper added to sources.
FLAGGED: bredAt gives 旧有渡郡有度村 but Shizuoka City's official page says 旧安倍郡有度村 — 有渡郡 merged into 安倍郡 in 1896, so by 1908 it was 安倍郡; selectedYear 1908 is the bamboo-clearing date, and the 1953 paper gives no year and says the selection was 古木中より選拔 (from OLD trees); notableDescendants mixes registries (Harumidori and Sofu quote PVP years where every other entry uses the 茶農林 year); diseaseResistance matches ja.wikipedia verbatim with no primary source found, and 赤枯れ/青枯れ are cold-injury syndromes, not diseases.
DEAD_SOURCES: none

### yaeho — both
FIXED: prose "Kiyomidori" → Kyomidori (茶農林19号 is きょうみどり); yield "combining all three flushes" → first and third only, the table is headed 1・3番茶合計 and the second flush went unsurveyed in 1944–45 for insect damage; chemistry "three-year averages" → two-year, 1975–76; THREE source titles were not the papers' actual titles and were corrected — one had been given as 細菌性萎縮病 when the paper is on 赤焼病; the MAFF record for Marishi added, since the conflicts claim previously rested on a retailer's excerpt.
FLAGGED: "In October 1954 it was registered nationally" — the bulletin says only 昭和29年度 and October is the journal issue date; white-star disease "weak" understates 多少弱い / やや弱; cold hardiness "of mature leaves" — the bulletin gives plain 耐寒性 強 and Yaeho is absent from the mature-leaf table, so the qualifier is unsupported; the rooting narrative treats two separate cutting cohorts (1975 and 1970 batches) as one followed over time; cultivationShare attributed to "one Shizuoka Yaeho producer" comes from a Hamamatsu retailer; "the 1978 paper describes Ooiwase as inheriting Yaeho's earliness" — the paper states the earliness but does not attribute it to Yaeho.
DEAD_SOURCES: none

### yamakai — both
FIXED: yield "about the same as Yabukita" → やや多 per the Shizuoka Tea Industry Council leaflet; the 山峡 vs 山狭 conflict is SETTLED by a primary prefectural source, which gives 山峡 together with the very rationale the record had attributed to the 山狭 reading; Lineage claimed none of the 7000-series lines "went on to parent a later registered cultivar" — Kurasawa is Koshun's seed parent and Shizu-7132 is Tsuyuhikari's; 2 sources added.
FLAGGED: selectedYear 1949 has no primary support and traces only to myjapanesegreentea.com — the leaflet dates the origin to 昭和10年 (1935); the line numbers Shizu-7109/7111/7224 are unverified and no source assigns 静7166 to Yamakai either, though the 7000系統群 grouping IS primary-confirmed (this resolves the koshun.md lead: the series is real, the individual numbers are not sourced); "trials in the late 1960s alongside Suruga-wase and Fuji-midori" is off per Nakamura's 奨励品種 table, which does confirm Yamakai ran 昭42 to current; the leaflet contradicts itself on registration and the record follows the correct half; frost causation is attributed by both primaries to early bud break, not harvest timing; the Kyoto/Shiga/Fukuoka regions and three disease ratings are secondary-only.
DEAD_SOURCES: none

### yamanoibuki — both
FIXED: registrationNumber null → PVP No.5430 (registered 1997-03-07, applied 1994-03-31, right lapsed 2000-03-08) and the prose claim "No exact registration number was found in any source consulted" replaced with the filing and breeder detail; selectedFrom/lineageNote/summary/intro/Lineage all said the seedling was raised from Yabukita seed AT THE STATION — MAFF and the prefectural guidebook give a collection-then-selection origin (穂木 collected 1975 from a Yabukita seedling garden at 中川根町), corrected everywhere; nameMeaning claimed no sourced etymology exists — the guidebook has a 命名の由来 block; anthracnose "strong" → 中 (strong only RELATIVE to Yabukita); prose said the Shizuoka station "also bred Okuhikari and Meiryoku", self-contradicting three sentences later, and Meiryoku is a national Kanaya cultivar — changed to Okuhikari and Tsuyuhikari; MAFF source added.
FLAGGED: yield — three sources disagree (MAFF 中, o-cha.net やぶきた並, guidebook 上); selectedYear left null because 1975 is a COLLECTION year; 立枯れ症 and クワシロカイガラムシ ratings rest solely on o-cha.net while MAFF's 青枯抵抗性 やや弱 is absent from the record; 赤枯れ 強 (MAFF) vs やや強 (guidebook); "Sayamakaori selected four decades earlier" is only true measured from its 1950s selection work, not its 1971 registration.
DEAD_SOURCES: none

### yamatomidori — both
FIXED: notableDescendants gained Meiryoku (Yamatomidori as pollen parent); lineageNote and prose "its one documented descendant" → two registered cultivars (Okumusashi 1962, Meiryoku 1986); bredAt 奈良県農事試験場茶業分場 → 奈良県立農事試験場茶業分場 (the 1953 paper's name); History "Yabukita (No. 6) and twelve others" → thirteen others (15 cultivars registered in 1953); conflicts attributed the 樹勢中/収量中 figures to Japanese Wikipedia "without citing its source" — Wikipedia does cite MAFF's 登録品種一覧表, re-attributed; 2 sources added.
FLAGGED: cold hardiness "very strong" (1953 paper, NARO table 耐寒性特に強く) vs the 1962 Okumusashi paper's 耐寒性 大, equal to Yabukita and Sayamamidori — different scales; rarity's "exceeded 50 hectares" appears in NONE of the cited sources; kanji 大和みどり uses no attested kanji form.
MEIRYOKU PARENTAGE — THIRD DATA POINT: this agent found the archived NARO 登録品種一覧表 gives 茶農林35号 as やぶきた×やまとみどり, agreeing with MAFF's 1986 dossier (via Kozaki 1987). Only the minorien 茶農林 table says やぶきた×Ｚ１. Tally is now 2 sources for Yamatomidori vs 1 for Z1 — which bears on tamamidori.md's claim to Meiryoku as a descendant via Z1.
DEAD_SOURCES: none

### yutakamidori — both
FIXED: History credited a 1972 comparison to "the prefecture's tea research station" — the paper's byline is the NATIONAL station's Makurazaki branch, and the prefectural station appears only as a cited reference; "aiming for an optimal first-flush plucking date around 18 April" → the trial MEASURED it at 18 April, eight days ahead of Yabukita; Characteristics claimed canopy spread and branch diameter were "significantly larger than every comparison cultivar in the study" — spread was joint-largest with Kanayamidori, and Yutakamidori was not even in the second test.
FLAGGED: cultivationShare 5.2% (Dec 2013) is stale — NARO's 2021 manual cites MAFF 2020 at 6.3%, and Kagoshima's share as 27.1% vs the record's "about 30%" (no citable URL recoverable this session); anthracnose and grey blight ratings rest only on My Japanese Green Tea, though cold/frost "weak" IS primary-confirmed (it is the 裂傷型凍害 susceptible check in NARO's Haruto 34 paper); notableDescendants omits Kanaemaru (2022), a grandchild via 金F183 — consistent with the asatsuyu.md lead.
DEAD_SOURCES: none
