# Choose Django and Next.js for the Matcha Diary stack

**Status:** Accepted · 2026-08-08

Covers the whole stack as one decision, because the layers pick each other. Individual layers can
be superseded by a later ADR without reopening the rest.

## Context

Matcha Diary is a social diary for matcha: people log a cup, write about it, tag taste notes, rate
each note out of five, and attach photos. Alongside the diary sits a reference database of matcha
powders — brand, blend name, cultivars, description, taste notes, photos. The UI prototype in
`docs/artifacts/ui-prototype/` is the current definition of the product. No application code exists
yet.

Seven things about this app constrain the stack. Everything else is preference.

1. **It is photo-heavy.** Every entry carries several photos with one chosen as the cover; powder
   records carry galleries. Upload, storage, resizing and delivery are a first-class concern from
   the first release, not something to bolt on.
2. **The powder database is curated, not user-generated.** Someone has to add records, correct a
   cultivar, merge two spellings of the same brand. That needs an admin interface on day one, and
   building one by hand is weeks of work that buys nothing distinctive.
3. **Tag vocabularies are open.** Taste notes and cultivars are both tags that authors can extend
   (prototype README: "The set of notes is not fixed"). They need to be shared across records so
   that filtering, counting and suggestion work — so they are rows, not strings in a column.
4. **Ratings are sparse and per-note.** A review rates whichever notes its author chose, 0–5 in
   half steps, with no overall score. Two reviews of the same cup can rate different things. There
   is no fixed set of rating columns to model.
5. **Search is a real feature.** The database page searches brand, name, cultivar and note
   together; reviews will want the same later.
6. **Interactivity is component-shaped.** A photo tray with cover selection, a chip builder, a
   filter grid, a custom click-to-rate bar, a record sheet. The prototype implements these in about
   a hundred lines of vanilla JS per page, so the app does not *require* a client framework — but
   every one of them is a stateful widget, which is the shape React handles best.
7. **Developer preferences and fluency:** Python for backend work, Tailwind for CSS, and more
   fluency in React than in Django templates. The last of these decided the frontend.

**Assumed, not confirmed:** web-first with no native mobile app in the first year, single developer
or small team, hundreds-to-thousands of users rather than millions.

## Decision

| Layer | Choice |
| --- | --- |
| Backend | Django 5.2 LTS (Python 3.13+) |
| API layer | Django Ninja |
| Frontend | Next.js (App Router), TypeScript, React |
| CSS | Tailwind CSS v4 |
| Auth | `django-allauth` in headless mode, session cookies |
| Database | PostgreSQL 17+ |
| Media storage | Cloudflare R2 (S3-compatible) via `django-storages` |
| Image delivery | `next/image` with a custom loader |
| Cache, sessions, queue broker | Redis |
| Background jobs | Celery |
| Hosting | Both apps on Fly.io, managed Postgres |
| Repo | One repository — `apps/api` and `apps/web` |
| Tests | pytest + `pytest-django` + `factory_boy`; Playwright and Vitest on the frontend |

### Backend — Django over FastAPI

Both are Python and both are good. Django wins on constraint 2: the powder database needs a
curation UI, and `django.contrib.admin` is that UI for free, including the tag merging and record
correction that reference data always turns out to need. Auth, sessions, migrations, permissions
and pluggable file storage are all in the box too — with FastAPI each of those is a decision plus a
library plus glue, and none of it is the product.

**This choice is what makes the Next.js frontend affordable.** The strongest argument against a
JavaScript frontend was that it would mean rebuilding the curation admin. That argument assumed
FastAPI would replace Django. Keeping Django dissolves it: Next.js becomes a frontend rather than a
whole backend, and admin comes along unchanged.

FastAPI's advantages — async-first, Pydantic-typed, API-shaped — are largely recovered by Django
Ninja below, which brings the same ergonomics inside Django rather than instead of it.

### Frontend — Next.js over server-rendered HTMX

A single Django deployable rendering HTML, with HTMX and Alpine for interactivity, was the initial
recommendation and is a genuinely good option: one language, one deploy, no API contract. It was
rejected on two grounds.

**Familiarity.** Constraint 7. A stack that is theoretically simpler but unfamiliar is not simpler
in practice for the first several months, and velocity on a solo project comes from what the
developer already knows. This is not a technical argument and it outranks the technical ones.

**Images.** `next/image` is materially better than hand-written `srcset` over an image proxy —
responsive sources, lazy loading, blur placeholders and format negotiation as defaults rather than
as work. On a photo-heavy product (constraint 1) that is a real advantage, not a wash.

Constraint 6 supports it too: the prototype's controls are stateful widgets, and React models them
more naturally than Alpine does. The gap widens if the UI grows richer than the prototype.

### The seam — Django Ninja with generated TypeScript

Use **Django Ninja**, not DRF. It is Pydantic-based, emits an OpenAPI schema without extra tooling,
and its ergonomics are close to FastAPI's — which matters now that the API is a real product
surface rather than an afterthought.

The point of choosing it is what sits downstream: **generate the TypeScript client from the OpenAPI
schema, commit the generated file, and regenerate in CI so the build fails when it drifts.** This
converts the split architecture's main standing cost — an API contract maintained against yourself
— into a compile error. Set it up on the first endpoint, not once it hurts.

DRF is the safer-by-ubiquity choice, but its serializer layer is verbose and OpenAPI generation is
a second tool (`drf-spectacular`). Nothing here needs DRF's ecosystem.

### Auth — session cookies on a shared parent domain

Auth across an origin boundary is the main tax of this architecture. Pay it once, at the DNS level,
rather than continuously in token plumbing.

- **`django-allauth` in headless mode** (`allauth.headless`). It exposes signup, login, social
  login, email verification and password reset as JSON endpoints for a JavaScript frontend while
  keeping Django sessions. This is the piece that makes the split cheap: allauth's features survive
  the boundary instead of being reimplemented.
- **Session cookies, not JWT.** Set `SESSION_COOKIE_DOMAIN = ".matchadiary.app"` so the cookie is
  valid for both hosts. CSRF travels as an `X-CSRFToken` header. No tokens in `localStorage`, no
  refresh rotation to build, no silent-renewal edge cases.
- **Both apps must sit on the same registrable domain** — `matchadiary.app` for the Next app,
  `api.matchadiary.app` for Django. This is a hard constraint and the easiest thing to get wrong: a
  Next app on `*.vercel.app` and a Django app on `*.fly.dev` cannot share a cookie, and discovering
  that after the auth flow is built is a rewrite. **Register the domain and point both hosts at it
  before the first login screen.**
- CORS: `CORS_ALLOW_CREDENTIALS = True` with an explicit origin allowlist. Never `*` with
  credentials.

JWT via `simplejwt` plus NextAuth is the alternative. It is the right answer when a native mobile
client is in play — see *What would reopen this*. It is the wrong answer for two web hosts on one
domain, where it adds refresh plumbing and a token-storage decision in exchange for nothing.

### Database — PostgreSQL

Constraints 3, 4 and 5 all point the same way.

```
Powder    id, brand_id, name, description, created_at
Brand     id, name, slug                                    -- so "Ippodo" is one row, not many strings
Cultivar  id, name, slug                                    -- tag vocabulary, shared
Note      id, name, slug, group                             -- taste-note vocabulary, shared, extensible
Photo     id, owner (powder|review), storage_key, position, is_cover

Review    id, author_id, powder_id (nullable), title, body, prepared_as, cafe_id, created_at
Rating    id, review_id, note_id, half_steps (smallint 0-10)  -- sparse: only the notes this review rated
```

Two details worth fixing now rather than migrating later:

- **Ratings store half steps as a small integer, 0–10**, not a float. The UI reads 0–5 in halves;
  integers make the storage exact and comparisons trivial. Divide by two at the edge.
- **Tags are rows with a slug**, so `cut grass` and `Cut Grass` collapse to one filterable tag, and
  suggestions can be ranked by usage count.

Postgres also covers search without a second system: full-text search over brand, name, cultivar
and note with a GIN index, plus `pg_trgm` for fuzzy brand matching ("marukyu koyamaen" vs "marukyu
kohoen" — a misspelling that already exists in the prototype copy).

SQLite would be enough for a prototype, but it gives up the full-text and trigram work above, and
the dev/prod parity is not worth defending once photos and background jobs are in play. Postgres in
a container locally, managed Postgres in production.

### Media — object storage, and the loader

- R2 is the origin and the upload target. **Uploads go browser → R2 via a presigned URL issued by
  Django**, so image bytes never transit the API.
- Serve through **`next/image` with a custom loader** pointing at Cloudflare Images or `imgproxy`,
  rather than Next's built-in optimizer. On a photo-heavy feed the built-in optimizer becomes a
  metered cost on Vercel and a CPU load anywhere else; a loader keeps resizing at the edge and
  leaves Next responsible only for emitting the right markup.
- R2 is S3-compatible and does not charge for egress, which for an image-heavy feed is the whole
  cost argument.
- **Decide the variant widths once, up front.** They end up in the loader, the card grid and the
  gallery, and changing them later touches all three.

### CSS — Tailwind v4

Tailwind lives in the Next app with the standard PostCSS setup. Django serves no styled HTML of its
own; the admin keeps its own CSS.

The existing design system ports cleanly, because it is already a token set. `styles.css` defines
colour, type, spacing and radius as custom properties; Tailwind v4's `@theme` block takes those
same values and generates the utilities from them.

**This port has one real risk.** The design system is deliberately near-flat — `--r-md` is 5px,
`--r-lg` is 8px, and taste-note chips are square on purpose. Tailwind's defaults are rounder and
larger (`rounded-lg` is 8px, `rounded-xl` is 12px). If the tokens are added *alongside* the
defaults, the defaults will leak into new components and quietly undo the shape language.
**Override** the radius and spacing scales rather than extending them, so the 4pt scale stays the
only option.

The rule that green is reserved for state and data cannot be expressed in a theme file. It stays a
review rule.

### Hosting — co-locate both apps on Fly.io

One provider, one bill. Two specific reasons beyond tidiness:

1. The shared-cookie constraint above is satisfied trivially with two Fly apps behind one domain.
2. Server Components can fetch Django over Fly's private network rather than back out through the
   public internet — a real latency saving on exactly the requests that render the feed.

Vercel is the alternative and its Next.js DX is better; the costs are the cross-provider cookie
setup and metered image optimization on a photo-heavy app. A single Hetzner VPS running everything
under Docker Compose is perhaps a quarter of the cost at small scale and a reasonable move later,
once someone is willing to own upgrades, backups and restore drills.

### Repo layout

```
apps/
├─ api/     Django project — models, admin, Ninja endpoints, Celery tasks
└─ web/     Next.js app — App Router, Tailwind, generated API client
```

One repository keeps changes that cross the seam atomic — a schema change and its frontend consumer
land in one commit, which is the main thing that makes a split architecture bearable solo. No
Turborepo or Nx at this size; two directories and two Dockerfiles.

## What happens to the prototype

- **`styles.css` tokens** move into Tailwind's `@theme`, with the override warning above.
- **`ratings.js` is ported to a React component, not rewritten.** The behaviour is specified in the
  prototype README and the logic — half-step quantisation, pointer position to value, keyboard
  nudges, click-to-clear — carries across almost line for line. It is roughly eighty lines.
- **The HTML prototypes stay** in `docs/artifacts/ui-prototype/`. They are the visual and
  behavioural reference for the port, and they were never production code.

## Consequences

**Good.**

- `next/image` on a photo-heavy product, as a default rather than as work.
- React's component model for the genuinely stateful controls, in the ecosystem the developer
  already knows.
- The Django admin curates the powder database at no build cost.
- An API exists from day one, so a native client later is incremental rather than architectural.
- Postgres serves search until there is a reason for something else.

**Costs, accepted knowingly.**

- Two deployables, two Dockerfiles, two sets of environment variables.
- Every feature crossing the seam touches both sides. Generated types make drift a compile error,
  but the work is still there.
- Auth is configuration plus a DNS constraint rather than a single Django setting.
- Next.js version churn — App Router and caching semantics have moved repeatedly — is a maintenance
  cost on a codebase touched monthly rather than daily.
- Django's async story is fine but not FastAPI's. If the app becomes I/O-bound against slow
  third-party APIs, this is the pressure point.

**Do these before writing feature code.**

1. Register the domain and settle both hostnames. Everything in the auth section depends on it.
2. Stand up OpenAPI → TypeScript generation and wire it into CI on the very first endpoint.
3. Port the design tokens into `@theme`, overriding the radius and spacing scales.
4. Pick the image variant widths.
5. Write a spec artifact for the data model — the sketch above is an argument, not a schema.

## Alternatives considered

| Alternative | Why not |
| --- | --- |
| **Django + HTMX + Alpine**, single deployable | The initial recommendation, and a good option: one language, one deploy, no API contract. Rejected on developer familiarity (constraint 7) and on `next/image` being materially better for a photo-heavy app. Everything else about it was sound. |
| **FastAPI + Next.js** | Would rebuild auth, admin and migrations to no benefit, and lose the curation UI that constraint 2 requires. Django Ninja recovers FastAPI's ergonomics without the loss. |
| **Django + DRF + SPA** | Same architecture as chosen, but DRF's serializer layer is verbose and OpenAPI needs a second tool. Nothing here needs DRF's ecosystem. |
| **Full-stack Next.js** (Prisma, no Python) | Coherent and good, but drops Python, and the curation admin would have to be built by hand. |
| **Django + SQLite** | Loses Postgres full-text and trigram search, weakens dev/prod parity. Fine for a prototype, wrong for the first real deploy. |
| **Streamlit / Gradio** | Data-tool framing. Cannot express this design system or a social feed. |

## What would reopen this

- **A native mobile client.** Session cookies stop being the obvious answer; add token auth for the
  mobile surface while keeping sessions for web, rather than converting the web app to tokens.
- **The seam proving heavier than expected.** The fallback is not HTMX — it is narrowing what
  crosses the boundary by moving more rendering into Server Components that read Django over the
  private network.
- **Realtime features** (live notifications, presence) — move Django to ASGI and add Channels.
- **Search outgrowing Postgres** — add Meilisearch or Typesense as a read index. Not before.
- **The feed becoming the bottleneck** — precomputed fan-out timelines in Redis, which is already in
  the stack for cache and broker.
