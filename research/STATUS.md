# Cultivar research — status

Paused 2026-08-15. Records live in `research/cultivars/`. Sources and method notes are in
`research/SOURCES.md`.

## Done

**62 records.** All agents completed; nothing was left half-written.

- **545 source citations** across **297 distinct URLs**
- **36 records** carry an explicit `conflicts:` note rather than silently picking a value
- **19 records** are marked `documentation: sparse` — genuinely thin, not padded out

Coverage is strongest where it matters most for this project: the Uji tencha and gyokuro
cultivars are essentially complete (Samidori, Komakage, Ogura-midori, Kyomidori, Asagiri,
Tenmyo, Terakawa-wase, Narino, Okunoyama, Himemidori, Hoshinomidori), as are the modern
matcha-oriented cultivars (Seimei, Kiyoka, Sakimidori, Harumidori).

Cha Norin numbers recovered from primary sources include Nos. 1, 3, 5, 7, 8, 9, 10, 16, 17, 18,
19, 20, 23, 26, 30, 31, 33, 35, 36, 37, 39, 42, 44, 47, 48, 49.

## Added since the paused run

- **ooiwase** (2026-08-25) — Shizuoka's 1977 prefectural early cultivar, off the *Unregistered*
  list above. Written from the 1978 release paper (茶業研究報告 No. 47) read page by page, plus a
  1985 赤焼病 field survey, a 2002 rust-mite study, and the prefectural planted-area table in the
  2013 Nakamura lecture that `kurasawa.md` already cites. No Cha Norin number — confirmed by
  checking MAFF's own registry table rather than inferred from silence.

## Known cleanup needed

**The `registry:` field is not normalised.** Agents wrote it freely, so it currently holds a mix
of short enum-like values (`MAFF`, `Plant Variety Protection Act`, `unregistered`, `prefectural
recommended cultivar`, `Ministry of Agriculture and Forestry`) and long prose strings carrying
dates and numbers inline. Before this feeds anything, collapse it to a fixed vocabulary and move
the detail into `registrationNumber` / a dated field. `MAFF` and `Ministry of Agriculture and
Forestry` are the same thing and should merge.

**Naming convention: settled, partially applied.** The house style follows Tezumi
(https://www.tezumi.com/collections/matcha) — see the naming section in `SOURCES.md` for the
rule and the three registers. In short: **a place-name or line-code prefix takes a hyphen; every
other compound stays solid.** Slugs are unaffected.

Applied: `ujihikari.md` (`name: Uji-Hikari`, `romaji:` and prose `Uji-hikari`).

Still open:

- **`kyoken283.md`** has `name: Kyoken 283`. Tezumi writes `Kyōken-283` — hyphen *and* macron.
  The hyphen fits the rule; the macron does not, since this corpus is macron-free elsewhere and
  Tezumi itself writes `Gokou`, not `Gokō`. Suggested: `Kyoken-283`. **Undecided.**
- **Ujimidori** has no record yet (only in `example/`). When written it should be `Uji-Midori` /
  `Uji-midori`.
- Five records hyphenate compounds that the rule says should be solid — `Oku-no-yama`
  (vs `Yamanoibuki`), `Takane-wase`, `Sato-wase`, `Terakawa-wase` (vs `Makinoharawase`), and
  `Ogura-midori` (vs `Sayamakaori`, `Kanayamidori`, `Hoshinomidori`). None carries a place
  prefix, so all five should be solid. Not yet applied.
- `Kirari 31`, `Inzatsu 131`, `Shizu-7132` and `Mie Ryokuho No. 1` carry numbers, where a
  separator is standard — leave those alone.
- **`yamanoibuki.md`** writes the cultivar as `Oiwase (おおいわせ)` in one sentence. The 1978
  release paper's own English title is *A New Tea Variety for Green Tea "Ooiwase"*, and
  `ooiwase.md`, `yaeho.md`, `kurasawa.md` and `kanayamidori.md` all write Ooiwase. One-word fix.

**The `example/` drafts contain fabricated data** and should be audited, not trusted — see the
note in `SOURCES.md`. Two confirmed cases so far: Okunoyama's invented selection window and
screening funnel, and Kirari 31's registration date.

**Missing descendant edges.** Records were written independently, so a cultivar discovered to be
a parent late in the run is not always listed in its parent's `notableDescendants`. One known
case: `okumusashi.md` does not list **Sun-rouge**, though NARO's 2005 breeding bulletin confirms
Sun-rouge is *Camellia taliensis* 'Akame' × Okumusashi (crossed 1993). Worth a sweep to make
parent/descendant references symmetrical before building the lineage graph.

**One cross-record inconsistency to reconcile: Meiryoku's pollen parent.**

- `meiryoku.md` gives **Yabukita × Yamatomidori**, from the 1987 peer-reviewed release paper
  (Kozaki, *Japanese Journal of Breeding* 37(1):103–108, reproducing MAFF's own registration
  dossier), and logs the disagreement in `conflicts:`.
- `tamamidori.md` lists **Meiryoku among Z1's descendants**, following MAFF's registry table,
  which gives Yabukita × Z1.

Both agents sourced their claim; they used different sources. `SOURCES.md` sets the rule that a
release paper outranks a registry table on parentage, which favours Yamatomidori — so
`tamamidori.md`'s `notableDescendants` is probably the entry to correct. Verify before editing:
the underlying question of whether the registry table or the release paper is wrong about
Meiryoku is still genuinely open, and it affects the lineage graph either way.

## Not yet researched

Sencha, later registrations: sagarahikari, sagaramidori, sagarakaori, sagarawase, musashikaori,
midorinohoshi, ryokufu, mieuejima, sainomidori, miyamakaori, kiraka, yumewakaba, harunonagori,
hosainishiki, yumekaori, kanayaibuki, kanayahomare, nagomiyutaka, shuntaro, yumesuruga,
kibonome, shizukaori, nanmei, haruto34, kanaemaru, danshin37

Kamairicha: izumi, yamanami, koju

Black tea: indo, hatsumomiji, benitachiwase, benikaori, benifuji, satsumabeni, karabeni,
tadanishiki, benitsukuba, beniibara

Unregistered / lines still in commercial use: surugawase, fujimidori, kondowase,
kominami, shigeru2, misaki, koganemidori, z1

From the Shinkoju sitemap, absent from every other list used here: sayamaakari, hidenosuke,
shimamidori, haruna, yumesumika, mori1go, qingxin-oolong (青心烏龍), and the bare line pages
`ca278` and `n-35-1`

## Resuming

The agent brief, the Shinkoju URL list and the per-cultivar source manifests are in the session
scratchpad and will not survive indefinitely. The durable material is `SOURCES.md`, which carries
the source hierarchy, the URL patterns, the breeding-line decoder, the near-homonym traps and the
verification rules — enough to rebuild a brief from scratch.
