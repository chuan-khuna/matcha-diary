# Artifacts

Everything under `docs/artifacts/` follows the naming convention below. It applies to files you
create there and to files you rename or move there. Do not invent an alternative scheme.

## Layout

```
docs/artifacts/
├─ adr/
│  └─ 2026-08-05-001-choose-sqlite-over-postgres.md
├─ prd/
│  ├─ 2026-08-05-004.00-review-sharing.md      ← index
│  ├─ 2026-08-05-004.01-permissions-model.md   ← detail
│  └─ 2026-08-05-004.02-share-link-expiry.md   ← detail
└─ bug/
   └─ 2026-08-06-001-cover-photo-not-persisting.md
```

## Category

The directory name. **Always a singular noun**, lowercase, kebab-case if it needs more than one
word. One category per kind of document — not per feature, not per sprint.

| Category       | Holds                                                                    |
| -------------- | ------------------------------------------------------------------------ |
| `adr`          | Architecture decision record — a decision, its context, its consequences |
| `prd`          | Product requirements — what to build and why                             |
| `issue`        | A tracked piece of work                                                  |
| `bug`          | A defect report and its investigation                                    |
| `spec`         | A technical specification for something already agreed                   |
| `research`     | An investigation with no commitment attached                             |
| `postmortem`   | What broke, why, what changes                                            |
| `ui-prototype` | Clickable, non-production interface prototypes                           |

Create a new category only when a document genuinely fits none of the existing ones. Prefer an
existing category over a near-duplicate (`bug`, never `bugs` or `defect`).

## Filename

```
yyyy-mm-dd-NNN[.MM]-topic.{md,html}
```

| Field        | Rule                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------- |
| `yyyy-mm-dd` | Date the artifact was **created**. Never changes when the file is edited.                   |
| `NNN`        | Running number, zero-padded to 3 digits, starting at `001`. **Required.**                   |
| `.MM`        | Sub-document number, zero-padded to 2 digits. **Optional** — see below.                     |
| `topic`      | Short lowercase kebab-case slug. Two to five words. No dates, no numbers, no category name. |
| extension    | `.md` by default. `.html` only for artifacts that must render or be interactive.            |

**The running number is per category.** Each directory keeps its own counter. `adr/…-001-…` and
`bug/…-001-…` are unrelated documents and both are correct. Numbers are assigned in creation order
and are never reused, even after a file is deleted.

## Sub-documents (`.MM`)

Use `.MM` only when one artifact is too large for a single file and splits into parts.

- `NNN.00` is the **index** — the overview, the summary, the table of contents pointing at its parts.
- `NNN.01`, `NNN.02`, … are the **detailed content** belonging to that same `NNN`.

A number must exist as a plain `NNN-topic` document before it can gain sub-documents. When it
splits, rename the original to `NNN.00-topic` and add the parts:

```
2026-08-05-004-review-sharing.md            # standalone, no parts yet
                    ↓ it grows too large
2026-08-05-004.00-review-sharing.md         # becomes the index
2026-08-05-004.01-permissions-model.md      # part
2026-08-05-004.02-share-link-expiry.md      # part
```

Never create a `.MM` file for a number that does not yet exist. Never leave `.01` without a `.00`.
Sub-documents keep the creation date of the part, not of the parent.

## Adding an artifact

1. Pick the category directory. Create it only if no existing category fits.
2. Find the highest `NNN` **in that directory** and add one:
   ```bash
   ls docs/artifacts/adr | sed -E 's/^[0-9]{4}-[0-9]{2}-[0-9]{2}-([0-9]{3}).*/\1/' | sort -u | tail -1
   ```
   An empty directory starts at `001`.
3. Use today's date and a kebab-case topic.
4. Open with an `# H1` that restates the topic in prose, then the body.

## Multi-file artifacts

When an artifact is a bundle rather than a document — a prototype with its own stylesheet and
assets — the bundle is one numbered unit: a **directory** named by the same grammar with no
extension, holding its files under whatever internal names they need.

```
docs/artifacts/ui-prototype/
└─ 2026-08-05-001-matcha-diary-showcase/
   ├─ README.md
   ├─ index.html
   └─ styles.css
```

The directory takes the number; the files inside it do not.
