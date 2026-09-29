## Why

The frontend is on Tailwind CSS 3.4, `tailwind-merge` 2, and `lucide-react` 0.468. The current majors are Tailwind 4.3, `tailwind-merge` 3 (which requires Tailwind 4), and `lucide-react` 1.x. Tailwind 4 changes where configuration lives: the theme moves from `tailwind.config.ts` into CSS. Today `apps/web/tailwind.config.ts` and `apps/admin/tailwind.config.ts` are identical copies that map the Academy tokens from `packages/ui/src/styles/academy.css`. Moving to Tailwind 4 lets the tokens live once, in `packages/ui`, instead of three places. This is a separate change because it touches every styled component and has its own browser-support implications. Dependabot skips majors, so without a change it would never happen.

## What Changes

- **BREAKING (styling toolchain)**:
  - Upgrade `tailwindcss` to the latest 4.x in both apps.
  - Replace the PostCSS setup (`postcss.config.js`, `autoprefixer`) with the `@tailwindcss/vite` plugin.
  - Replace `@tailwind base/components/utilities` with `@import "tailwindcss"`.
- Move the Academy theme (colors, the `academy` easing, font families) into a single `@theme` block in `packages/ui/src/styles/academy.css`, mapped to the existing `--academy-*` custom properties. Use `@source` for `packages/ui` components, and delete both `tailwind.config.ts` files.
- Upgrade `tailwind-merge` to 3.x in `packages/ui`, so `cn()` understands Tailwind 4 class names.
- Upgrade `lucide-react` to the latest 1.x in `apps/web`, `apps/admin`, and `packages/ui`, updating any renamed icon imports.
- Apply Tailwind 4 utility renames and default changes using the official upgrade tool, then review the result by hand. Examples: `shadow-sm` → `shadow-xs`, `rounded` → `rounded-sm`, the default border color becoming `currentColor`, and the ring width default.
- Document the browser baseline Tailwind 4 requires (Safari 16.4+, Chrome 111+, Firefox 128+) as the Academy frontend's supported browsers.
- Add a `Shared Design Token Source` requirement to `academy-frontend-workspaces`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `academy-frontend-workspaces`: Add a `Shared Design Token Source` requirement covering one token source for both apps and a documented supported-browser baseline.

## Impact

- **Code**: `apps/*/vite.config.ts`, `apps/*/src/styles.css`, deleted `apps/*/tailwind.config.ts` and `apps/*/postcss.config.js`, `packages/ui/src/styles/academy.css`, `packages/ui/src/utils.ts` (if `tailwind-merge` 3 needs config), every component using renamed utilities or icons, and each workspace's `package.json`.
- **Users**: Browsers older than the Tailwind 4 baseline lose correct styling. There are no users yet, so the product decision is what matters.
- **Other proposals**: Depends on `upgrade-react-19-and-vite-8` (the `@tailwindcss/vite` plugin targets current Vite) and on `upgrade-frontend-tooling` for the lockfile and pnpm version. Not scheduled into Iteration 7 or 8. Schedule it after AuthN, or earlier if UI work starts before then.
- **Deferred**: A visual regression tooling decision. For now, verification is manual side-by-side screenshots.
