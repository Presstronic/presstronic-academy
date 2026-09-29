## Context

- `apps/web/tailwind.config.ts` and `apps/admin/tailwind.config.ts` are byte-identical. Each extends `graphite`, `cyan`, `volt`, and `magenta` colors, an `academy` easing, and `mono`/`sans` font families, all pointing at `--academy-*` custom properties declared in `packages/ui/src/styles/academy.css`. Both scan `../../packages/ui/src/**/*.{ts,tsx}`.
- `academy.css` also defines `--academy-green-*` and `--academy-red-*`, which have no Tailwind mapping today.
- Both apps use PostCSS (`tailwindcss`, `autoprefixer`) and `@tailwind base/components/utilities` in `src/styles.css`.
- `packages/ui` `cn()` combines `clsx` and `tailwind-merge` 2.
- Tailwind 4 is CSS-first (`@import "tailwindcss"`, `@theme`, `@source`), ships a Vite plugin, handles vendor prefixing itself, and requires Safari 16.4+, Chrome 111+, and Firefox 128+.

## Goals / Non-Goals

**Goals:**

- Tailwind 4, `tailwind-merge` 3, and `lucide-react` 1.x with no visual change.
- One token source in `packages/ui`.
- A documented browser baseline.

**Non-Goals:**

- Redesigning tokens or adding new ones. The unmapped green and red tokens get mapped only if a component already uses them.
- Visual regression tooling.
- Container queries or other new Tailwind 4 features beyond what the migration needs.

## Decisions

### 1. `@theme` in `packages/ui`, imported by both apps

**Chosen:** `academy.css` keeps the `--academy-*` custom properties and adds a `@theme` block that maps Tailwind namespaces to them. For example, `--color-graphite-950: var(--academy-graphite-950);`, `--ease-academy: var(--academy-ease-out);`, and `--font-mono: "IBM Plex Mono", …;`. Each app's `src/styles.css` becomes `@import "tailwindcss";`, `@import "@presstronic-academy/ui/styles.css";`, and `@source "../../../packages/ui/src";`. Default palettes stay available, as they did with `extend`, unless a later change decides to reset them.

**Alternatives considered:**
- *Keep a JS config through the `@config` compatibility directive*: This keeps the duplication and relies on a legacy path.
- *Per-app `@theme`*: Still duplicated.

### 2. The Vite plugin replaces PostCSS

**Chosen:** Add `@tailwindcss/vite` to both `vite.config.ts` files, and delete `postcss.config.js` and the `autoprefixer` / `postcss` dev dependencies. Tailwind 4 handles prefixing.

### 3. Official upgrade tool, then manual review

**Chosen:** Run `npx @tailwindcss/upgrade` for utility renames and default changes. Then review every diff line by hand, especially the border color default (`currentColor`) and ring width. Components that relied on a gray default border must state their color explicitly.

### 4. Upgrade `lucide-react` to 1.x in the same change

**Chosen:** Icons are rendered with Tailwind classes, and both upgrades touch the same components. Update renamed imports as the release notes list them.

**Alternatives considered:**
- *A separate icon upgrade*: A tiny change touching the same files, which isn't worth a second round of review.

## Risks / Trade-offs

- [Subtle visual regressions (borders, rings, preflight differences)] → Compare screenshots of both scaffold screens (and any screens that exist by then) before and after at desktop and mobile widths. List accepted differences in the PR.
- [The browser baseline excludes older Safari] → No users yet. The product owner accepts the baseline in this change, and it's documented in the README.
- [`tailwind-merge` 3 doesn't know custom color names] → Custom colors follow standard `color-*` namespaces, so `twMerge` resolves conflicts. Add a unit test for `cn("bg-graphite-900", "bg-cyan-300")`.

## Migration Plan

1. Schedule after AuthN (Iteration 9 or later), unless UI-heavy work starts sooner.
2. Rollback: revert the commit and lockfile.
