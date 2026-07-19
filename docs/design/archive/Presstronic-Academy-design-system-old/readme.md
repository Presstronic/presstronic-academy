# Presstronic Academy Design System

The design language for **Presstronic Academy** — a branching, story-driven learning
platform where developers sharpen their craft by playing through narrative coding
adventures. Built by Presstronic LLC as a sibling product to Station, but with a
**fully independent look**.

> Art direction in one line: **Night City at a desk job.** Cyberpunk 2077's mood —
> graphite blacks, instrument cyan, a rare flash of volt yellow — dialed way down into
> something muted, precise, and professional enough that people feel good paying a
> subscription for it. Square corners everywhere. One notched corner as the signature
> mark. No neon overload, no Matrix green (the old placeholder theme is retired).

---

## Product

**Presstronic Academy** (in development) — choose-your-own-adventure learning:
branching story paths, skill challenges (code puzzles), modular lessons, and a
progression/achievement system. React 18 + Vite frontend moving to **shadcn/ui**;
NestJS + PostgreSQL backend; multi-tenant with RBAC.

## Sources

- **GitHub — `Presstronic/presstronic-academy`**
  <https://github.com/Presstronic/presstronic-academy>
  Monorepo (pnpm + turbo). Frontend at `apps/frontend/` currently uses MUI v6 with a
  placeholder "Matrix green" theme at `apps/frontend/src/theme/index.ts`; pages:
  Home, Login, Register, Dashboard, Profile, 404/Error. This system replaces that
  theme wholesale — nothing visual was carried over except page inventory.
- Parent brand context: the Presstronic / Station design system (aqua-on-navy).
  Academy deliberately does **not** share its palette or type.

### Connecting this system to the repo

The tokens here are authored against the **shadcn/ui CSS-variable contract**
(`--background`, `--primary`, `--ring`, …) with dark as `:root` default and light
under `[data-theme='light']` / `.light`. Handoff path:

1. Copy `tokens/*.css` into `apps/frontend/src/` and import from the global css.
2. Init shadcn/ui; point its theme at these variables; set `--radius: 0`.
3. Fonts: Archivo + IBM Plex Mono (Google Fonts — see substitution flag below).
4. Use the component specs in `components/` and screens in `ui_kits/academy/` as
   the visual source of truth for the shadcn ports.

---

## Content fundamentals — how Academy writes

The register is **narrative SaaS**: a serious product that speaks like a mission
briefing. Playful adventure fiction is the flavor, professionalism is the base.

- **Voice:** second person, active, quietly in-world. *"Your next objective is
  waiting."* *"Choose your path. Every decision branches."* The UI addresses the
  learner as an operative on assignment, never as a "student."
- **Fiction vocabulary (used sparingly):** paths, branches, objectives, missions,
  logs, clearance, checkpoints, transmissions. One flavor word per surface, not five.
- **Casing:** sentence case for headlines and body. **UPPERCASE + wide tracking**
  only for mono labels, eyebrows, badges, and status readouts.
- **Eyebrows:** short, mono, uppercase, prefixed with a slash: `// MISSION LOG`.
- **Numbers and data** always render in mono (`XP 2,140`, `07 / 12`, `v0.4.1`) —
  it signals telemetry, not decoration.
- **Punctuation:** periods on headlines are fine. Em-dashes for asides. No
  exclamation marks in product chrome; the story engine's narrative text may use them.
- **No emoji, ever.** Meaning is carried by mono badges and Lucide icons.

---

## Visual foundations

**Overall vibe.** Graphite-on-black instrument panel. Calm, dense where data lives,
generous where marketing lives. One cyan accent doing real work; volt yellow held in
reserve for story-critical moments; red only for danger.

- **Color.** Neutral graphite ramp (`--gray-950 #0a0b0c` → `--gray-50 #f7f8f9`),
  no blue cast. Primary accent **signal cyan `#22c3d6`** (text-level `#4fd8e6`).
  Reserve highlight **volt yellow `#d4b52e`** — story choice markers, caution states,
  never decoration. Third signal **synth magenta `#cf3f9a`** — narrative/system flavor
  (REC/LIVE indicators, code keywords, hero gradient word, HUD corner accents), used
  thinner than cyan and volt. Status: green `#46c97e` success, red `#e14b4b` destructive.
  Tints via `color-mix()` so they track light/dark. Never introduce new hues.
- **Modes.** Dark is default (`:root`); light mode via `[data-theme='light']`.
- **Backgrounds.** Flat graphite. Permitted decoration: a faint square grid
  (1px lines at ~4% white, 48px cells) masked with a radial fade, and a single soft
  cyan radial glow behind heroes. No photos, no gradients-as-decoration, no noise.
- **Type.** Display + body = **Archivo** (700/800 display, tracking `-0.025em`;
  400–600 text). Data/labels/code = **IBM Plex Mono**. Scale in
  `tokens/typography.css`. Hero at 56–72px, body 15px.
- **Corners.** **Square. Radius 0 on everything** — buttons, inputs, cards, dialogs,
  badges. No pills. The signature motif is a **single notched (clipped) top-right
  corner** (`--notch`, 12px) on feature cards and primary CTAs — use on at most one
  element class per screen.
- **Cyberpunk dress (used sparingly).** `.hud` — cyan/magenta corner brackets on one
  hero surface per screen. `.scanlines` — faint repeating-gradient overlay on dark
  terminal/story panes only. `.neon-top` — 2px cyan top edge + inset glow on a hero
  card. `.ink-signal` — cyan→magenta gradient text for one emphasized hero word.
  `.hazard` — diagonal volt stripe divider at story decision points. `.sig-dash` /
  `.sig-dash.mag` — small cyan/magenta rules flanking eyebrows (replaces any
  language-glyph decoration — none is used in this system). Never stack more than one
  of these treatments per element.
- **Borders.** Hairline 1px, low-opacity (`--border-hairline`). Strengthen on hover.
  Active/selected elements get a **2px left edge** in the accent color (cyan for
  nav/selection, volt for story choices).
- **Shadows & glows.** Deep diffuse elevation on dark (`--shadow-1..3`). Primary
  CTAs and focused terminal panes may carry a subtle `--glow-cyan`. Never both glow
  and shadow on one element.
- **Spacing & layout.** 4px base; ~112px section rhythm; content maxes at 1200px;
  app chrome uses a 264px sidebar. Everything flex/grid + `gap`.
- **Cards.** `--surface-card` fill + hairline border, radius 0. Hover: border
  strengthens, background lightens one step, no lift. Selected: 2px accent left edge.
- **Motion.** Quick, eased, never bouncy: `--ease-out` at 120–320ms. Hovers change
  border/color, not position. Presses darken. Terminal/story text may type-on
  (30–60 chars/s); respect `prefers-reduced-motion`.
- **Hover / press.** Links: `--text-body` → `--cyan-400`, no underline until hover.
  Ghost buttons gain accent border + text. Primary buttons darken to `--cyan-600`.
- **Transparency & blur.** Sticky nav: page color at 85% + `backdrop-filter:
  blur(12px)` once scrolled. Overlay scrim: black at 65%.
- **Imagery.** Prefer real product UI (terminal panes, code, branching diagrams).
  If photography is ever used: dark, cool, desaturated. Never illustrations or 3D.

---

## Iconography

- **Library: [Lucide](https://lucide.dev)** pinned to `0.460.0` from CDN — the
  native pairing for shadcn/ui. Outline, `currentColor`, 2px stroke, rounded joins.
- Usage: `<i data-lucide="git-branch"></i>` + `lucide.createIcons()`; in React,
  render statically and style the resulting `svg`.
- Recurring glyphs: `git-branch` (story paths), `terminal` (challenges),
  `book-open` (lessons), `trophy` / `medal` (progression), `shield` (clearance/RBAC),
  `map` (adventure), `zap` (XP), `chevron-right` (choices).
- Mono labels (`// OBJECTIVE`) act as quasi-iconography for wayfinding.
- **No emoji. No hand-authored SVGs.** No logo exists yet — render "PRESSTRONIC
  ACADEMY" as a type lockup (Archivo 800, tight tracking, "ACADEMY" in cyan) until
  a real mark is provided.

> ⚠️ **Font substitution flag:** no font binaries were provided. Archivo and
> IBM Plex Mono load from Google Fonts (`tokens/fonts.css`). Drop in licensed
> binaries and replace the `@import` with `@font-face` rules when available.

---

## Index / manifest

- `styles.css` — single entry point; `@import`s the four token files.
- `tokens/` — `colors.css` (ramps + shadcn contract, dark default + light),
  `typography.css`, `spacing.css` (incl. notch motif, glows, motion), `fonts.css`.
- `guidelines/` — foundation specimen cards for the Design System tab.
- `components/` — reusable primitives (Button, Badge, Card, Tabs, Progress, Input,
  Select, Checkbox, Switch, Dialog, Tooltip), each with `.d.ts` + `.prompt.md`.
- `ui_kits/academy/` — hi-fi screens: story/adventure view (flagship), landing,
  login/register, dashboard, lesson/challenge, profile, progression.
- `SKILL.md` — Agent-Skills front-matter for use in Claude Code.
