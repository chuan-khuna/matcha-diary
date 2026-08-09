# Matcha Diary — every operation the project supports, for both halves and for CI.
#
# `just` with no arguments lists everything. This file is the closest thing to
# onboarding documentation that cannot go stale, because it is what CI runs:
# `just check` means the same thing on a laptop and in the pipeline. Where a
# recipe and a workflow file disagree, the workflow file is the bug.
#
# Naming is <service>-<command>: frontend-dev, frontend-build. Recipes that span
# services — or belong to no service — carry no prefix.

# PowerShell 7 on Windows; sh everywhere else. -NoProfile so a recipe behaves the
# same on a laptop with a customised profile as it does on a bare CI runner.
set windows-shell := ["pwsh.exe", "-NoLogo", "-NoProfile", "-Command"]

# Recipes deliberately invoke nothing but `bun` and the tools it resolves, so the
# same line runs unchanged on Windows and on a Linux runner. Reach for a shell
# builtin here and that property is gone.

[private]
default:
    @just --list --unsorted

# Everything CI runs. Add api-check to this line when apps/api lands.
check: frontend-check

# ---- frontend — apps/web (Next.js, bun) ---------------------------------------

# Install dependencies. Honours the 7-day cooldown in apps/web/bunfig.toml.
[group('frontend')]
[working-directory('apps/web')]
frontend-install:
    bun install

# Dev server on http://localhost:3000
[group('frontend')]
[working-directory('apps/web')]
frontend-dev:
    bun run dev

[group('frontend')]
[working-directory('apps/web')]
frontend-build:
    bun run build

# Serve the production build. Requires frontend-build first.
[group('frontend')]
[working-directory('apps/web')]
frontend-start:
    bun run start

[group('frontend')]
[working-directory('apps/web')]
frontend-lint:
    bun run lint

# Typecheck. Regenerates route types first — a fresh clone has no .next/types,
# so tsc would otherwise fail on LayoutProps before reaching a real error.

# Typecheck, route types regenerated first.
[group('frontend')]
[working-directory('apps/web')]
frontend-typecheck:
    bunx next typegen
    bunx tsc --noEmit

[group('frontend')]
frontend-check: frontend-lint frontend-typecheck frontend-build

# ---- api — apps/api (Django, uv) ----------------------------------------------
# Not yet scaffolded. api-dev, api-test, api-lint, api-migrate and api-schema
# land with it; api-check joins `check` above at the same time.
