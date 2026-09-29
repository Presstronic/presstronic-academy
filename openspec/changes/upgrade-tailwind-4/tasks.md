## 1. Baseline

- [ ] 1.1 Capture screenshots of every existing screen in both apps at desktop and mobile widths as the visual baseline.

## 2. Tailwind 4

- [ ] 2.1 Upgrade `tailwindcss` to the latest 4.x and add `@tailwindcss/vite` in both apps; remove `postcss.config.js`, `autoprefixer`, and `postcss`; register the plugin in both `vite.config.ts` files; verify both apps build.
- [ ] 2.2 Add a `@theme` block to `packages/ui/src/styles/academy.css` mapping the existing color, easing, and font tokens to Tailwind namespaces, keep the `--academy-*` properties, and replace each app's `@tailwind` directives with `@import "tailwindcss"`, the shared stylesheet import, and `@source` for `packages/ui/src`; delete both `tailwind.config.ts` files; verify utilities such as `bg-graphite-950`, `text-cyan-100`, and `ease-academy` are generated in both apps.
- [ ] 2.3 Run `npx @tailwindcss/upgrade`, then review each change by hand, giving explicit colors to any border or ring that relied on the old defaults; verify `pnpm check` passes.

## 3. Class Merging and Icons

- [ ] 3.1 Upgrade `tailwind-merge` to 3.x in `packages/ui`; verify a unit test asserts `cn("bg-graphite-900", "bg-cyan-300") === "bg-cyan-300"` and that non-conflicting custom classes are kept.
- [ ] 3.2 Upgrade `lucide-react` to the latest 1.x in all three workspaces and update renamed icon imports; verify `pnpm typecheck` passes and every icon renders.

## 4. Documentation

- [ ] 4.1 Document the Tailwind 4 setup (where tokens live, how to add one) in `packages/ui/README.md`, and the supported browser baseline in the root `README.md`; verify the docs match the code.

## 5. Verification

- [ ] 5.1 Compare post-upgrade screenshots to the 1.1 baseline; verify no differences, or list accepted differences in the PR.
- [ ] 5.2 Run `pnpm format`, `pnpm check`, `pnpm test`, and `pnpm build`; verify all pass.
- [ ] 5.3 Run `openspec validate upgrade-tailwind-4 --strict` and `openspec validate --all --strict`; verify no errors.
- [ ] 5.4 Run `git diff --check`.
