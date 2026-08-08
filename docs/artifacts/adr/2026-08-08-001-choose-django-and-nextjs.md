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

Eight things about this app constrain the stack. Everything else is preference.

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
7. **Developer preferences and fluency:** Python for backend work, Tailwind for CSS, Django REST
   Framework for the API, and more fluency in React than in Django templates. React fluency decided
   the frontend; the DRF preference is honoured in *The seam* below, along with what it costs.
8. **Accounts are both local and federated.** Email/password sign-in, plus Discord, Google and
   GitHub — Discord first. Users must be able to *bind* an additional provider to an account they
   already hold, which is a different flow from signing in with one. That difference is a security
   boundary, not a convenience.

**Assumed, not confirmed:** web-first with no native mobile app in the first year, single developer
or small team, hundreds-to-thousands of users rather than millions.

## Decision

| Layer | Choice |
| --- | --- |
| Backend | Django 6.1 (Python 3.14) |
| Python toolchain | `uv` — interpreter, dependencies, lockfile |
| Settings | Split by environment — `config/settings/{base,local,test,production}.py` |
| API layer | Django REST Framework + `drf-spectacular` |
| API documentation | Scalar, via `django-scalar` |
| Frontend | Next.js (App Router), TypeScript, React |
| CSS | Tailwind CSS v4 |
| UI components | shadcn/ui — generated into the repo, Radix underneath |
| Auth | `django-allauth` headless, `app` client, allauth's JWT token strategy |
| Token custody | Next.js Route Handlers as broker; refresh token in a first-party httpOnly cookie |
| Database | PostgreSQL 18+ |
| Primary keys | UUIDv7, generated in Python via `uuid.uuid7()` |
| Media storage | Cloudflare R2 (S3-compatible) via `django-storages` |
| Image delivery | `next/image` with a custom loader |
| Cache, queue broker, token state | Redis |
| Background jobs | Celery — see *Alternatives considered* |
| Hosting | Both apps on Fly.io, managed Postgres |
| Repo | One repository — `apps/api` and `apps/web` |
| Task runner | `just`, one `justfile` at the root, shared with CI |
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

FastAPI's advantages — async-first, Pydantic-typed, API-shaped — are given up here rather than
recovered. Django Ninja would have brought most of them inside Django, and was the runner-up for
exactly that reason; *The seam* below is explicit about what choosing DRF instead costs.

### Versions — Django 6.1 and Python 3.14

Django 6.1 was released on 5 August 2026 and supports Python 3.12–3.14. Taking it on a greenfield
codebase is cheaper than starting on 5.2 LTS: the eventual 6.1 → 6.2 LTS hop is small, where a
5.2 → 6.2 jump would not be. Django 6.0 also brought native CSP support and the `django.tasks`
interface, both of which are relevant here.

**The cost is a hard date.** 6.1 is not an LTS. Mainstream support ends around April 2027 and
extended support around December 2027, against April 2028 for 5.2 LTS. This project must therefore
be on 6.2 LTS by roughly April 2027 — which is a scheduled piece of work, not a background risk, and
it sits alongside the Next.js upgrade treadmill noted under *Consequences*.

The secondary risk is ecosystem lag rather than Django itself. Three days after release, the
dependency graph is the thing to verify, not the framework. DRF already declares support for Django
5.2, 6.0 and 6.1 and for Python 3.10–3.14, so the two central choices agree. `django-allauth`,
`django-storages`, `django-cors-headers`, `drf-spectacular` and `pytest-django` should be confirmed
against 6.1 at scaffold time rather than assumed. Celery is the known laggard — 5.6.0 carries only
*initial* Python 3.14 support, which is the main reason the alternative in the table below is worth
a look before committing to a broker-backed queue.

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

### The seam — DRF with generated TypeScript

Use **Django REST Framework** with **`drf-spectacular`** for the OpenAPI schema. DRF is the stated
preference (constraint 7) and it earns that on ubiquity: most Django packages that touch an API
assume it, its patterns are the ones the available answers are written against, and its slow release
cadence reads as stability on a codebase touched monthly rather than daily. `django-allauth` ships a
DRF authentication class, so the auth layer below drops in without glue.

The point of the schema is what sits downstream: **generate the TypeScript client from the OpenAPI
schema, commit the generated file, and regenerate in CI so the build fails when it drifts.** This
converts the split architecture's main standing cost — an API contract maintained against yourself
— into a compile error. Set it up on the first endpoint, not once it hurts.

**This is where DRF costs something, and the cost is not optional.** The generated client is only as
truthful as the schema, and DRF's schema is *inferred* rather than declared. `drf-spectacular` reads
`ModelSerializer` plus generic views well, but every custom action, every non-CRUD endpoint and every
polymorphic response needs an explicit `@extend_schema`. Miss one and CI still passes, the client
still generates, and the frontend receives a plausible-looking type that is quietly wrong — worse
than no generation at all, because it is trusted.

So the annotation is part of writing the endpoint, not a follow-up:

- `@extend_schema` on every view that is not a plain `ModelViewSet` action.
- **Turn `drf-spectacular`'s schema warnings into CI failures.** It reports every endpoint it could
  not infer; an un-annotated view should break the build exactly as a type error does. This is the
  single control that keeps the generated client honest.
- Review rule: a pull request that adds an endpoint and no schema annotation is incomplete.

Django Ninja was the runner-up and would have made all of this free — with Pydantic the types *are*
the schema, so there is nothing to keep in sync and nothing to enforce. It also supports async views,
where DRF does not. Both points lost to ubiquity and to constraint 7. The async one is the one that
could age badly; see *What would reopen this*.

**Serve the schema through Scalar**, using `django-scalar` alongside `SpectacularAPIView`. The schema
already has to exist for the TypeScript generation above, so a readable reference over it is nearly
free, and Scalar's is better than Swagger UI's or Redoc's. It also gives the annotation discipline a
visible payoff: an endpoint documented badly *looks* bad, which catches the sloppy `@extend_schema`
that CI will not.

Two caveats worth recording. `django-scalar` is a young package at 0.2.0 — but it is a thin wrapper
that serves a JavaScript viewer over a schema URL, so the blast radius is a docs page, and swapping
back to Redoc is an afternoon. Separately, **there will be two API reference surfaces**: this one for
the product API, and allauth's own spec at `/_allauth/openapi.html` for the auth endpoints. That is
a consequence of not reimplementing auth and is the right trade, but do not expect one unified page.

### Toolchain — uv and just

**`uv`** manages the interpreter, the dependencies and the lockfile. It replaces pyenv, pip and venv
with one binary, which matters more than usual here for a specific reason: **Python 3.14 and Django
6.1 are both new**, and `uv python pin 3.14` makes the interpreter an explicit, reproducible part of
the project rather than something each machine and image happens to have.

- `pyproject.toml` holds direct dependencies; **`uv.lock` is committed** and holds the resolved tree.
  Given how much of this stack is within weeks of release, a lockfile is what makes "works on my
  machine" and "works in CI" the same claim.
- Dependency groups separate production from development, so `pytest`, `factory_boy` and the
  schema tooling stay out of the runtime image.
- In the Dockerfile, copy `pyproject.toml` and `uv.lock` and run `uv sync` **before** copying the
  source. Dependencies change rarely and code changes constantly; that ordering is the whole layer
  cache.
- Manage commands run as `uv run python manage.py …`.

**`just`** is the task runner, with a single `justfile` at the repository root. This is worth more
here than in a single-language project. The repo has two halves with unrelated idioms — `uv run` and
`manage.py` on one side, `pnpm` scripts on the other — plus tasks that span both and have an order
that must not be guessed at: regenerate the OpenAPI schema, then regenerate the TypeScript client,
then typecheck the frontend. A recipe encodes that sequence once.

- One `justfile` at the root, so `just` with no arguments lists every operation the project supports.
  It is the closest thing to onboarding documentation that cannot go stale, because it is what CI
  runs.
- **CI calls the same recipes.** The point is not convenience, it is that `just check` means the same
  thing on a laptop and in the pipeline. Where a recipe and a workflow file disagree, the workflow
  file is the bug.
- Recipes worth having from the start: `dev`, `test`, `lint`, `migrate`, `schema` (regenerate and
  fail on drift), and `check` as the composition CI runs.
- `just` over `make`: no tab significance, no phony-target ceremony, arguments work as arguments, and
  nothing here needs a build graph — it is a command runner, which is all that is wanted.

### Settings — split by environment

```
config/settings/
├─ base.py         everything true everywhere
├─ local.py        development
├─ test.py         pytest
└─ production.py   deployed
```

Each environment module does `from .base import *` and overrides from there.
`DJANGO_SETTINGS_MODULE` selects one, and the `justfile` is where that mapping is written down, so
which settings module a command runs under is never something anyone has to remember.

**The rule that makes this work: structure in modules, values in the environment.** Conflating the
two is what gives split settings their bad reputation.

- *Structure* is what differs in kind between environments — whether the debug toolbar is installed,
  whether email is a console backend or a real one, whether storage is local disk or R2. That
  belongs in a module.
- *Values* are credentials, hostnames, bucket names, DSNs. Those come from the environment through
  `django-environ`, in every module including `local.py`.

A `production.py` full of literal values has smuggled configuration into version control. A
`base.py` that branches on `if DEBUG:` has smuggled structure into a value. They are the same
mistake in opposite directions.

**This project needs the separation more than most, because its environment-divergent settings are
mostly the security ones.** Nearly everything that differs between local and production is something
whose dev value is dangerous in production:

| Setting | Local | Production |
| --- | --- | --- |
| Refresh cookie `Secure` / `SameSite` | relaxed for `http://localhost` | `Secure`, `SameSite=Lax` |
| `CORS_ALLOWED_ORIGINS` | `localhost:3000` | the real origin, never `*` |
| `HEADLESS_FRONTEND_URLS` | localhost | the deployed frontend |
| Discord callback | localhost callback | production callback |
| Storage backend | local disk | R2 via `django-storages` |
| `HEADLESS_JWT_PRIVATE_KEY` | throwaway dev key | real key, from the environment |

That table is the argument. Under a single `settings.py` with `if DEBUG:` branches, every one of
those is one accidental truthy value away from shipping a development posture to production. Under
split modules, `production.py` states its own values outright and cannot inherit a relaxed one by
falling through a conditional.

Two rules that follow:

- **Secrets have no defaults in `base.py`.** `env("HEADLESS_JWT_PRIVATE_KEY")` with no fallback, so
  a missing key is a loud startup failure rather than a silent downgrade to a development value.
  This matters specifically for the signing key: a production app that quietly signs with a dev key
  is a total auth compromise that looks like a working deployment.
- **`just check` runs `manage.py check --deploy` against `production.py`** in CI. Django already
  knows most of the ways this goes wrong; the split is what makes that check meaningful, because
  there is a production settings module to point it at.

Keep the environment modules short. If `production.py` grows long, something in it was true
everywhere and belonged in `base.py`.

### Auth — allauth headless, our own JWTs, brokered by Next

Constraint 8 asks for three things: email/password, social sign-in starting with Discord, and **our**
access/refresh pair once a third-party handshake succeeds. The provider's token authenticates the
handshake and nothing more — it never becomes the session credential.

**`django-allauth` in headless mode covers all three on its own.** This is the entire auth stack:

- `allauth.account` — email/password, email verification, password reset.
- `allauth.socialaccount` — Discord, Google, GitHub. Discord first; the other two are configuration,
  not code.
- `allauth.headless` with **`HEADLESS_TOKEN_STRATEGY` set to allauth's JWT strategy** — issues an
  access/refresh pair in the response `meta` payload once a user is fully authenticated, whether
  they arrived by password or by Discord. Refresh rotation is on by default.
- `JWTTokenAuthentication`, allauth's own DRF authentication class, on the API side.

**No `djangorestframework-simplejwt`, and no `dj-rest-auth`.** simplejwt last released 5.5.1 in July
2025 and declares support only through Django 5.2 and Python 3.13 — neither of the versions chosen
above. `dj-rest-auth` wraps allauth *and* simplejwt, so it inherits the problem. allauth's native
strategy makes both redundant, which turns the version choice from a standing risk into a non-issue.

The frontend uses the headless **`app` client** (`X-Session-Token`), not the `browser` client. The
`browser` client is the cookie-and-CSRF path, which is the thing being deliberately not done here.

#### Token custody — Next.js is the broker

**No token is ever readable by browser JavaScript.**

- The refresh token lives in an httpOnly, `Secure`, `SameSite=Lax` cookie that **the Next app sets on
  its own origin**. It is first-party, and the browser never sends it to Django.
- Access tokens live server-side in Next — Route Handlers and Server Components — which attach
  `Authorization: Bearer …` when calling Django.
- The browser calls Next. Next calls Django. The Next server is the token boundary.

The plumbing is worth it on this product specifically. The app is built almost entirely out of
user-generated content — review bodies, brand names, and a tag vocabulary that authors extend by
design (constraint 3). That is a real XSS surface, and tokens in `localStorage` are exfiltratable the
moment one payload gets through. Brokering makes an XSS bug a content bug rather than an account
breach.

It also removes a constraint. A session-cookie design would make a **shared registrable domain a hard
prerequisite**, since one cookie would have to be valid for both hosts. Under brokering the only
cookie is first-party to the Next app and Next→Django is a server-to-server Bearer call, so the two
apps no longer need to share a domain. Co-locating them is still the plan and one domain is still
tidier — but it is now a preference, not something that must be settled before the first login
screen.

#### Binding is not signing in

The second half of constraint 8 is a security boundary, and conflating the two flows is the classic
account-takeover bug.

- **Binding requires an already-authenticated user.** Connecting Discord to an existing account
  happens from inside a session. It is never a side effect of a login attempt.
- **Never auto-link on a matching email.** Leave `SOCIALACCOUNT_EMAIL_AUTHENTICATION` at its default
  of `False`. allauth's own reasoning is the right one: an untrustworthy provider could otherwise log
  into any local account by fabricating social account data.
- Signing up via Discord with an email that already belongs to a password account must **not**
  silently merge them. Send the user to log in, then bind.
- If this is ever relaxed, relax it per-provider and only where the provider reports the email as
  verified. Discord does expose that flag.

#### JWT settings that are decisions, not defaults

| Setting | Value | Why |
| --- | --- | --- |
| `HEADLESS_JWT_ALGORITHM` | `RS256` (default) | Lets a native client or second service verify a token without calling Django. **Generate the keypair now** — changing algorithm later invalidates every token in circulation. |
| `HEADLESS_JWT_ACCESS_TOKEN_EXPIRES_IN` | `300` (default) | Five minutes. Correct. |
| `HEADLESS_JWT_REFRESH_TOKEN_EXPIRES_IN` | `2592000` — **not** the `86400` default | A diary is used occasionally. A 24-hour refresh window logs people out daily for no gain that rotation does not already provide. Thirty days. |
| `HEADLESS_JWT_ROTATE_REFRESH_TOKEN` | `True` (default) | Keep. |
| `HEADLESS_JWT_STATEFUL_VALIDATION_ENABLED` | `True` — **not** the `False` default | Off, logging out does not invalidate an already-issued access token — the standard JWT complaint. On, it does. Costs a datastore lookup per request, which Redis is already in the stack to serve. "Log me out of the device I lost" is a feature a social app gets asked for. |

Enabling stateful validation means these are not purely stateless tokens, and that is deliberate:
statelessness was never the goal here. Federated identity handling was.

Set `HEADLESS_SERVE_SPECIFICATION = True` in development. allauth serves its own OpenAPI spec at
`/_allauth/openapi.html`, which is the authoritative reference for the provider-redirect endpoints in
`app` mode — read it before writing the Discord flow rather than guessing at endpoint names.

For Discord: request the `identify` and `email` scopes, and register the callback URL for **both**
production and localhost up front. Discord matches redirect URIs exactly.

### Database — PostgreSQL

Constraints 3, 4 and 5 all point the same way.

```
-- every `id` below is a uuid (v7), not a bigint; see Primary keys
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
- **allauth owns the identity tables.** `User`, `EmailAddress`, `SocialAccount` and the provider
  records are allauth's and are not modelled above. `Review.author_id` points at the Django user, and
  one user may hold several `SocialAccount` rows — that multiplicity is what constraint 8's binding
  requirement amounts to in storage.

### Primary keys — UUIDv7

Every application table uses a **UUIDv7 primary key**, declared in Python:

```python
class Base(models.Model):                      # abstract; every app model inherits it
    id = models.UUIDField(primary_key=True, default=uuid.uuid7, editable=False)

    class Meta:
        abstract = True
```

**Why UUIDs at all.** Record IDs are public here — they sit in review URLs and in every API
response. Sequential integers would leak the total number of reviews, users and powders, and would
let anyone walk the entire catalogue by counting upwards. On a social product that is a real
exposure, and it is not fixable later without changing every URL that has been shared.

**Why v7 rather than v4.** UUIDv4 is the usual way people pay for that privacy, and it is a known
Postgres performance mistake: random values scatter inserts across the B-tree, causing page splits,
index bloat and WAL amplification. UUIDv7 puts a 48-bit timestamp in the high bits, so inserts land
at the right edge of the index like a `bigint` while keeping the unguessable tail. Published
benchmarks on 50M rows put the v7 index roughly 25% smaller with substantially faster ordered scans.
On the feed — which is `ORDER BY created_at DESC` over the largest table in the schema — that is the
access pattern that benefits most.

**Why generated in Python, not by the database.** Python 3.14 ships `uuid.uuid7()` in the standard
library, so this costs no dependency — a direct dividend of the version choice above. Generating
application-side means the ID exists *before* the insert, which the photo tray needs: the browser
uploads to R2 against a key derived from a photo ID that no round trip has yet returned. Postgres 18
also provides a native `uuidv7()`, which stays available for bulk loads and raw SQL.

**Two things to know going in.**

- `DEFAULT_AUTO_FIELD` cannot express this — it only accepts `AutoField` subclasses. The abstract
  base model above is the mechanism, and a model that forgets to inherit it silently gets a `bigint`.
- **A UUID `User.pk` requires a custom user model, and that must exist before the first migration.**
  Retrofitting one onto a migrated database is among the most painful things Django asks of anyone.
  It is listed under *Do these before writing feature code* for that reason. allauth's auxiliary
  tables (`EmailAddress`, `SocialAccount`) keep their own `bigint` keys; they are never exposed in a
  URL, so there is nothing to gain by fighting that.

**The accepted leak:** a UUIDv7 discloses its creation time to anyone who parses it. For reviews,
powders and photos this is already public — the diary shows dates. For users it reveals signup time,
which is minor and accepted. If a table ever holds something where creation time is genuinely
sensitive, that table takes a v4 key instead.

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

### CSS and components — Tailwind v4 with shadcn/ui

Tailwind lives in the Next app with the standard PostCSS setup. Django serves no styled HTML of its
own; the admin keeps its own CSS.

The existing design system ports cleanly, because it is already a token set. `styles.css` defines
colour, type, spacing and radius as custom properties; Tailwind v4's `@theme` block takes those same
values and generates the utilities from them.

**Colour is authored in OKLCH** — `DESIGN.md`, `styles.css` and the prototype markup all carry
`oklch()` values, and `CLAUDE.md` states the convention. This agrees with the stack rather than
fighting it: Tailwind v4 ships its own default palette in OKLCH and its colour manipulation assumes
that space, and shadcn's theme variables are OKLCH on v4 too. So the port is a substitution of
values into a slot that already expects this format, not a conversion. It also makes the token
overrides below verifiable — a tint that disagrees with its base on `H` is visible in the value,
where hex hides it.

**Components come from shadcn/ui.** On Tailwind v4 that means the CSS-variable architecture — an
`@theme inline` block mapping this project's tokens onto the names the components reference, and
`"tailwind.config": ""` in `components.json`. Radix sits underneath, so dialog, dropdown, select and
combobox arrive with focus management, keyboard navigation and ARIA correctness already handled.
On a product with a filter grid, a record sheet and a chip builder, that is the substance of the
choice; the styling is secondary.

The property that makes it safe here is that **shadcn is a generator, not a dependency**. Components
are copied into the repo and owned outright. Where a generated component disagrees with the design
system, the fix is to edit it rather than to fight or wrap it.

#### The design system must win, and by default it will not

The port has one real risk, and shadcn sharpens it rather than creating it.

The design system is deliberately near-flat — `--r-md` is 5px, `--r-lg` is 8px, and taste-note chips
are square on purpose. Tailwind's defaults are rounder (`rounded-lg` is 8px, `rounded-xl` is 12px)
and shadcn's are rounder still: its components lean on `rounded-md` and `rounded-lg` throughout, all
derived from a single `--radius` that ships at around 10px.

Three rules follow, ordered by how expensive each becomes if applied late:

1. **Set `--radius` to this project's scale during `shadcn init`, before generating a single
   component.** Correcting it once twenty components exist is twenty files; correcting it first is
   one line.
2. **Override the radius and spacing scales in `@theme` rather than extending them**, so the 4pt
   scale is the only thing available and a stray `rounded-xl` has nothing to resolve to.
3. **Map shadcn's semantic tokens onto the existing palette — never run two palettes side by side.**
   shadcn addresses colour through roughly two dozen semantic names (`--background`, `--foreground`,
   `--primary`, `--muted`, `--border`, `--input`, `--ring`, and their `-foreground` pairs). Each must
   resolve to a value already in `styles.css`. If shadcn's defaults survive alongside the project
   palette, "what colour is a border" has two answers and the design system has quietly lost.

**Green must not be mapped to `--primary`.** The rule that green is reserved for state and data
survives from the prototype, and shadcn is the thing most likely to break it: `--primary` drives
buttons, active states and focus rings, so mapping green there would turn every default button green
and violate the rule automatically rather than occasionally. Map `--primary` to a neutral and let
green stay deliberate.

That is the one part of the design system a theme file can enforce rather than merely record. The
rest of the green rule stays a review rule.

#### What shadcn does not supply

The controls that make this product what it is are in no registry: the click-to-rate bar, the photo
tray with cover selection, the chip builder for an open tag vocabulary. shadcn covers the generic
layer around them — dialog, dropdown, select, form, tabs, toast, command — and that division is the
point. It removes the accessibility-critical boilerplate so the bespoke work sits where the product
actually differs.

### Hosting — co-locate both apps on Fly.io

One provider, one bill. Two specific reasons beyond tidiness:

1. Server Components *and* the token broker call Django from the server on nearly every request. On
   Fly they can do it over the private network rather than back out through the public internet — a
   real latency saving on exactly the requests that render the feed, and on every token refresh.
2. One place where secrets and the JWT signing keypair live, and one bill.

Vercel is the alternative and its Next.js DX is better. Brokering removed the cross-provider cookie
problem, so the only remaining cost against it is metered image optimization on a photo-heavy app —
which makes Vercel a more serious option than it would have been under a session-cookie design. A
single Hetzner VPS running everything under Docker Compose is perhaps a quarter of the cost at small
scale and a reasonable move later, once someone is willing to own upgrades, backups and restore
drills.

### Repo layout

```
justfile                  every operation, for both halves and for CI
apps/
├─ api/                   Django — models, admin, DRF viewsets, allauth config, Celery tasks
│  ├─ config/settings/    base.py + local.py / test.py / production.py
│  ├─ pyproject.toml
│  └─ uv.lock             committed
└─ web/                   Next.js — App Router, Tailwind, generated API client
```

One repository keeps changes that cross the seam atomic — a schema change and its frontend consumer
land in one commit, which is the main thing that makes a split architecture bearable solo. No
Turborepo or Nx at this size; two directories and two Dockerfiles.

## What happens to the prototype

- **`styles.css` tokens** move into Tailwind's `@theme`, with the override warning above, and become
  the values shadcn's semantic names resolve to. They are already OKLCH, which is the format both
  Tailwind v4 and shadcn expect, so this is a copy rather than a conversion. The token set is the
  source of truth; shadcn's vocabulary is a layer of aliases over it, never a second palette.
- **`ratings.js` is ported to a React component, not rewritten.** The behaviour is specified in the
  prototype README and the logic — half-step quantisation, pointer position to value, keyboard
  nudges, click-to-clear — carries across almost line for line. It is roughly eighty lines. shadcn
  has nothing to contribute here, which is expected.
- **The HTML prototypes stay** in `docs/artifacts/ui-prototype/`. They are the visual and
  behavioural reference for the port, and they were never production code.

## Consequences

**Good.**

- `next/image` on a photo-heavy product, as a default rather than as work.
- React's component model for the genuinely stateful controls, in the ecosystem the developer
  already knows.
- The Django admin curates the powder database at no build cost.
- **One dependency covers local and federated identity and issues our own tokens.** No simplejwt, no
  `dj-rest-auth`, no NextAuth — which also sidesteps the one library that had not kept pace with the
  chosen Django and Python versions.
- An API and real tokens exist from day one, so a native client later is incremental rather than
  architectural.
- The two apps do not have to share a registrable domain, so hosting stays a reversible decision.
- Public IDs are unguessable without giving up index locality, and on Python 3.14 that costs no
  dependency.
- One `justfile` and one `uv.lock` mean a laptop and CI run the same commands against the same
  interpreter — worth more than usual while half the stack is weeks old.
- Split settings make `check --deploy` meaningful and keep the security-sensitive values out of
  version control by construction rather than by vigilance.
- Radix accessibility arrives with the generic controls, so the bespoke ones are where the effort
  goes.
- Postgres serves search until there is a reason for something else.

**Costs, accepted knowingly.**

- Two deployables, two Dockerfiles, two sets of environment variables.
- Every feature crossing the seam touches both sides. Generated types make drift a compile error,
  but the work is still there.
- **Schema annotations are mandatory, not advisory.** DRF infers its OpenAPI schema, so an
  un-annotated endpoint silently produces a wrong TypeScript type. CI enforcement is what makes this
  a cost rather than a defect; Django Ninja would not have needed it.
- **Django 6.1 is not LTS.** Being on 6.2 LTS by roughly April 2027 is scheduled work, and it lands
  on top of the Next.js upgrade treadmill below.
- **Token brokering is real Next.js code** — refresh-on-expiry, concurrent-request coalescing, and
  cookie handling in Route Handlers. It buys XSS resistance and it is not free.
- Stateful token validation trades a Redis lookup per request for the ability to actually log
  someone out. Deliberate, but it is a request-path cost.
- UUID keys are 16 bytes against 8, and every foreign key pays it. Accepted: at this scale the
  enumeration exposure matters more than the index size, and v7 removes the write cost that would
  otherwise have made the trade a bad one.
- **Generated shadcn components are now this project's code**, so upstream fixes do not arrive on
  their own. That is the same trade that makes them safe to edit, but it is a maintenance cost and
  not a free one.
- Next.js version churn — App Router and caching semantics have moved repeatedly — is a maintenance
  cost on a codebase touched monthly rather than daily.
- **DRF is sync-only**, which sharpens rather than creates the async limitation. If the app becomes
  I/O-bound against slow third-party APIs, this is the pressure point.

**Do these before writing feature code.**

1. **Create the custom user model, with a UUIDv7 primary key, before the first migration.** This and
   the keypair below are the two decisions that are genuinely expensive to reverse. Add the abstract
   base model in the same change so no table is created with a `bigint` key by accident.
2. Generate the RS256 keypair and settle the token lifetimes. Changing the algorithm later
   invalidates every token in circulation.
3. `uv python pin 3.14`, then confirm `django-allauth`, `django-storages`, `drf-spectacular` and
   `pytest-django` resolve against Django 6.1 while scaffolding, while switching is still cheap.
   Commit `uv.lock` in the same change.
4. Write the `justfile` while there are only three recipes in it, and point CI at them immediately.
   A task runner adopted after the commands have scattered never catches all of them.
5. Stand up OpenAPI → TypeScript generation on the very first endpoint, **and fail CI on
   `drf-spectacular` schema warnings** in the same change. The generation is worthless without the
   enforcement.
6. Register the Discord OAuth application with both production and localhost callback URLs.
7. Build the token broker — cookie flags, refresh path, and the server-side fetch wrapper — before
   the first authenticated screen, not after.
8. Port the design tokens into `@theme`, overriding the radius and spacing scales — **then** run
   `shadcn init` with `--radius` already set to this project's value, and only then generate the
   first component. This ordering is the whole difference between a one-line fix and a twenty-file
   one.
9. Pick the image variant widths.
10. Write a spec artifact for the data model — the sketch above is an argument, not a schema.

## Alternatives considered

| Alternative | Why not |
| --- | --- |
| **Django + HTMX + Alpine**, single deployable | The initial recommendation, and a good option: one language, one deploy, no API contract. Rejected on developer familiarity (constraint 7) and on `next/image` being materially better for a photo-heavy app. Everything else about it was sound. |
| **Django Ninja** instead of DRF | The runner-up, and better on the merits of the seam: with Pydantic the types *are* the schema, so no annotation discipline is required, and it supports async views. Lost to DRF's ubiquity and to constraint 7. |
| **FastAPI + Next.js** | Would rebuild auth, admin and migrations to no benefit, and lose the curation UI that constraint 2 requires. |
| **Django 5.2 LTS** instead of 6.1 | Support to April 2028 rather than December 2027, and a settled ecosystem. Rejected because on a greenfield codebase the 6.1 → 6.2 LTS hop is cheaper than a later 5.2 → 6.2 jump, and 6.0 brought CSP and `django.tasks`. |
| **Session cookies on a shared parent domain** | Simpler for a web-only product — no refresh plumbing, no token-storage question. Rejected because constraint 8 wants federated identity, a native client is plausible, and it would make a shared registrable domain a hard prerequisite. |
| **`simplejwt` + `dj-rest-auth`**, or NextAuth | The conventional JWT route. Rejected on maintenance: simplejwt last released July 2025 and declares Django ≤ 5.2, Python ≤ 3.13. allauth issues the same token pair natively, so this would add a dependency and subtract version coverage. |
| **Tokens in `localStorage`** | Removes the broker and is materially less code. Rejected because this app is built out of user-generated content, so one XSS bug would become an account breach rather than a content bug. |
| **`django-tasks` instead of Celery** | **Open.** Django 6.0's `django.tasks` is an interface with no worker; the `django-tasks` package supplies the database backend and the worker command. For image variants and email it would drop a broker entirely and sidestep Celery's merely *initial* Python 3.14 support. Celery stays for now because it handles retries, chains and scheduling when jobs get real. Decide before the first background job, not after. |
| **Swagger UI or Redoc** instead of Scalar | Both are more established and `drf-spectacular` ships views for them. Scalar is the preference (constraint 7's spirit); the wrapper is thin enough that reverting is an afternoon. |
| **A packaged component library** (MUI, Mantine, Chakra) | Faster to a working screen, but the design system is specific and near-flat, and a packaged library is fought rather than edited. shadcn's generated components are owned outright, which is the property that matters when the house style disagrees with the defaults. |
| **Radix primitives with no shadcn layer** | The accessibility benefit without the styling opinions, and therefore without the radius and palette collisions described above. Rejected as the slower path to the same place: shadcn *is* Radix plus a starting point, and the starting point is editable. |
| **Full-stack Next.js** (Prisma, no Python) | Coherent and good, but drops Python, and the curation admin would have to be built by hand. |
| **`bigint` primary keys** | Faster and smaller, and the Django default. Rejected because IDs are public in review URLs, where sequential keys leak record counts and invite enumeration — and that is not fixable after URLs have been shared. |
| **UUIDv4 primary keys** | The usual way to get unguessable IDs, and it does not leak a timestamp the way v7 does. Rejected on write performance: random keys scatter B-tree inserts, bloating the index and amplifying WAL. v7 keeps the privacy that matters here and drops the cost. |
| **Database-generated keys** (`db_default`, Postgres 18 `uuidv7()`) | Available and fine, but the ID would not exist until after the insert. Python-side generation lets the photo upload flow mint an ID before any round trip. |
| **`make` instead of `just`** | Universally installed, which is its whole advantage. Rejected for tab significance, phony-target ceremony and awkward argument handling, none of which buy anything when there is no build graph to express. |
| **Single `settings.py`** with `if DEBUG:` branches | Fewer files, and adequate on a project without a security-sensitive configuration surface. Rejected because here the environment-divergent settings are cookie flags, CORS origins and the JWT signing key — where one truthy value in the wrong place ships a development security posture to production. |
| **All configuration in environment variables**, one settings module | Purer twelve-factor, and it is what the *values* already do. Rejected for the structural differences — installed apps, storage backend, email backend — which become unreadable when expressed as environment lookups. |
| **Django + SQLite** | Loses Postgres full-text and trigram search, weakens dev/prod parity. Fine for a prototype, wrong for the first real deploy. |
| **Streamlit / Gradio** | Data-tool framing. Cannot express this design system or a social feed. |

## What would reopen this

- **A native mobile client.** Largely pre-solved now: allauth already issues RS256 JWTs and the
  headless `app` client is what a mobile app would talk to. What changes is that the client reaches
  Django without the Next broker, so tokens live in the platform keychain instead of a cookie.
- **Schema drift escaping CI.** If wrong generated types keep reaching the frontend despite the
  enforcement in *The seam*, the annotation discipline has failed in practice rather than in theory,
  and Django Ninja becomes the answer it nearly was.
- **DRF's sync-only request path.** If the app becomes I/O-bound against slow third-party APIs, this
  binds before Django itself does.
- **April 2027.** Django 6.1 leaves mainstream support and 6.2 LTS is the destination. Scheduled, not
  speculative.
- **The seam proving heavier than expected.** The fallback is not HTMX — it is narrowing what
  crosses the boundary by moving more rendering into Server Components that read Django over the
  private network.
- **Realtime features** (live notifications, presence) — move Django to ASGI and add Channels.
- **Search outgrowing Postgres** — add Meilisearch or Typesense as a read index. Not before.
- **The feed becoming the bottleneck** — precomputed fan-out timelines in Redis, which is already in
  the stack for cache, broker and token state.
