# Public Design System Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make typography, light/dark colors, and square internal controls consistent across every public page except Profile while preserving rounded outer layouts and existing image shapes.

**Architecture:** `app/globals.css` defines the semantic visual contract. Shared UI primitives consume that contract, and public page components remove local overrides that conflict with it. A source-level self-test prevents known regressions, while lint, type-checking, build, and browser review verify the rendered result.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS 4, next/font, TypeScript, Node.js self-tests, Playwright/Chrome visual verification.

## Global Constraints

- Profile and Profile-specific components must remain unchanged.
- Admin pages are outside scope.
- Images, portraits, and avatars retain their existing corner treatments.
- Major shells, heroes, cards, and layout sections remain rounded.
- Buttons, icon buttons, inputs, textareas, search controls, badges, tags, chips, filters, and navigation controls are square.
- Playfair Display is used for public display and heading text; Outfit is used for body, navigation, controls, tags, and metadata.
- Burnt orange is the only interactive accent.
- No new dependencies.
- Repeated styling belongs in `app/globals.css` or a shared primitive rather than duplicated component classes.

---

## File Structure

- `app/globals.css`: semantic color, typography, radius, overlay, and control-border tokens.
- `components/ui/button.tsx`: square button geometry and semantic button colors.
- `components/ui/badge.tsx`: square tag/badge geometry and minimum metadata size.
- `components/ui/input.tsx`: shared square input boundary.
- `components/ui/textarea.tsx`: shared square textarea boundary.
- `components/ui/navigation-menu.tsx`: square navigation triggers.
- `components/ui/glassmorphism.tsx`: theme-token outer glass surface.
- `scripts/public-design-system-selftest.cjs`: source-level invariants for the public design system.
- `components/home/HeroSplit.tsx`: remove hero control pills.
- `components/home/ProfessionalHero.tsx`: align professional actions with global controls.
- `components/home/TechHero.tsx`: remove pill overrides and tiny skill text.
- `components/home/work-timeline.tsx`: remove undefined monospace usage and use tabular Outfit numerals.
- `components/ui/floating-blobs-bar.tsx`: replace the neon rainbow with theme-aware warm decorative tokens.
- `components/ui/scroll-cue.tsx`: square the control and use semantic accent/border colors.
- `components/blogs/blogs-editorial-hero.tsx`: use the shared display type and square search controls.
- `components/blogs/featured-blog-lead-card.tsx`: normalize weights, tags, metadata, and icon action.
- `components/blogs/blogs-taxonomy-rail.tsx`: normalize tag typography and remove unsupported black weights.
- `components/ui/archive-card.tsx`: replace fixed white/gray/multicolor styling with semantic theme tokens.
- `components/ui/article-card.tsx`: square internal controls and make card cutouts theme-aware.
- `components/ui/blog-lead-card.tsx`: use Outfit for body/meta and semantic overlay/accent tokens.
- `components/ui/project-card.tsx`: use semantic image-overlay control tokens.
- Public detail/list components found by the final source audit: remove only conflicting typography/color/control overrides.

---

### Task 1: Establish the global visual contract and shared primitives

**Files:**
- Create: `scripts/public-design-system-selftest.cjs`
- Modify: `app/globals.css`
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/badge.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/textarea.tsx`
- Modify: `components/ui/navigation-menu.tsx`
- Modify: `components/ui/glassmorphism.tsx`

**Interfaces:**
- Produces CSS tokens `--control-border`, `--overlay-surface`, `--overlay-foreground`, `--decorative-1`, `--decorative-2`, `--decorative-3`, `--radius-layout`, `--radius-card`, and `--radius-control`.
- Produces semantic classes `.type-display`, `.type-section-title`, `.type-card-title`, `.type-body-lg`, `.type-body`, `.type-nav`, and `.type-meta`.
- Shared primitives consume `border-control-border`, `text-primary-foreground`, and `rounded-none`.

- [ ] **Step 1: Add a failing global-contract self-test**

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");

const read = (file) => fs.readFileSync(file, "utf8");
const globals = read("app/globals.css");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const input = read("components/ui/input.tsx");
const textarea = read("components/ui/textarea.tsx");
const navigationMenu = read("components/ui/navigation-menu.tsx");

for (const token of [
  "--control-border",
  "--overlay-surface",
  "--overlay-foreground",
  "--decorative-1",
  "--decorative-2",
  "--decorative-3",
  "--radius-layout",
  "--radius-card",
  "--radius-control",
]) assert.ok(globals.includes(token), `Missing ${token}`);

for (const [name, source] of Object.entries({ button, badge, input, textarea, navigationMenu })) {
  assert.ok(source.includes("rounded-none"), `${name} must be square`);
  assert.ok(!source.includes("rounded-full"), `${name} cannot be pill-shaped`);
}

assert.ok(button.includes("border-control-border"));
assert.ok(input.includes("border-control-border"));
assert.ok(textarea.includes("border-control-border"));
console.log("public design-system global contract: PASS");
```

- [ ] **Step 2: Run the self-test and confirm the missing-token failure**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: FAIL with `Missing --control-border`.

- [ ] **Step 3: Add global tokens and normalize the semantic type scale**

Add the following semantic roles to both `:root` and `.dark`, registering color roles in `@theme inline`:

```css
--color-control-border: var(--control-border);
--color-overlay-surface: var(--overlay-surface);
--color-overlay-foreground: var(--overlay-foreground);

/* light */
--control-border: oklch(0.65 0.025 60);
--overlay-surface: oklch(0.2 0.012 45 / 0.78);
--overlay-foreground: oklch(0.965 0.004 92);
--decorative-1: oklch(0.68 0.13 46);
--decorative-2: oklch(0.78 0.08 72);
--decorative-3: oklch(0.58 0.06 38);
--radius-layout: 2.5rem;
--radius-card: 1.25rem;
--radius-control: 0rem;

/* dark overrides */
--control-border: oklch(0.52 0.02 50);
--primary-foreground: oklch(0.222 0.008 48);
--overlay-surface: oklch(0.16 0.01 45 / 0.84);
--overlay-foreground: oklch(0.965 0.004 92);
--decorative-1: oklch(0.62 0.1 46);
--decorative-2: oklch(0.68 0.06 72);
--decorative-3: oklch(0.48 0.05 38);
```

Normalize semantic typography so body is `1rem`, metadata is at least `0.75rem`, and all public heading roles use `var(--font-display)`. Set `--font-mono: var(--font-body)` to remove the undefined family.

- [ ] **Step 4: Point shared primitives at the contract**

Use `border-control-border` for visible control boundaries, preserve `rounded-none`, and remove dark-mode primary foreground overrides. Change both navigation-menu trigger definitions from `rounded-md` to `rounded-none`. Replace raw glassmorphism RGBA colors with `bg-card/80`, `dark:bg-card/85`, and `border-border/70`. Keep focus rings and disabled states unchanged.

- [ ] **Step 5: Run the global self-test, lint the changed files, and commit**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: `public design-system global contract: PASS`.

Run: `npx eslint app/globals.css components/ui/button.tsx components/ui/badge.tsx components/ui/input.tsx components/ui/textarea.tsx components/ui/navigation-menu.tsx components/ui/glassmorphism.tsx scripts/public-design-system-selftest.cjs`

Expected: exit 0.

Commit:

```bash
git add app/globals.css components/ui/button.tsx components/ui/badge.tsx components/ui/input.tsx components/ui/textarea.tsx components/ui/navigation-menu.tsx components/ui/glassmorphism.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: define public visual system tokens"
```

---

### Task 2: Normalize Home and shared decorative controls

**Files:**
- Modify: `components/home/HeroSplit.tsx`
- Modify: `components/home/ProfessionalHero.tsx`
- Modify: `components/home/TechHero.tsx`
- Modify: `components/home/work-timeline.tsx`
- Modify: `components/ui/floating-blobs-bar.tsx`
- Modify: `components/ui/scroll-cue.tsx`
- Modify: `scripts/public-design-system-selftest.cjs`

**Interfaces:**
- Consumes the Task 1 global tokens and shared square primitives.
- Produces theme-aware decorative colors resolved from CSS variables.

- [ ] **Step 1: Extend the self-test with Home invariants**

Add targeted assertions that the Home hero components and ScrollCue contain no `rounded-full`, skill badges contain no `text-[8px]` or `text-[9px]`, the timeline contains no `font-mono`, and ScrollCue contains no `#00AEFE`.

- [ ] **Step 2: Run the test and confirm it fails on the existing Hero and ScrollCue overrides**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: FAIL naming `rounded-full`, `text-[8px]`, or `#00AEFE`.

- [ ] **Step 3: Remove local pill and microtype overrides**

Use the shared Button and Badge geometry. Replace hero skill sizes with `type-meta`. Keep portrait and media radius classes unchanged. Replace timeline `font-mono` with `font-sans tabular-nums`.

- [ ] **Step 4: Make decorative accents theme-aware**

Change the floating blob model to store `colorToken` rather than a fixed neon hex value:

```ts
const COLOR_TOKENS = ["--decorative-1", "--decorative-2", "--decorative-3"] as const;

interface Blob {
  colorToken: (typeof COLOR_TOKENS)[number];
  // existing geometry and velocity fields remain unchanged
}
```

Resolve each token with `getComputedStyle(canvas).getPropertyValue(blob.colorToken).trim()` before assigning `ctx.fillStyle`. Replace ScrollCue cyan with `currentColor`, apply `text-primary` to the button, and use `var(--control-border)` for its neutral stroke.

- [ ] **Step 5: Verify and commit the Home slice**

Run: `node scripts/public-design-system-selftest.cjs`

Run: `npx eslint components/home/HeroSplit.tsx components/home/ProfessionalHero.tsx components/home/TechHero.tsx components/home/work-timeline.tsx components/ui/floating-blobs-bar.tsx components/ui/scroll-cue.tsx scripts/public-design-system-selftest.cjs`

Expected: both commands exit 0.

Commit:

```bash
git add components/home components/ui/floating-blobs-bar.tsx components/ui/scroll-cue.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: align home with public visual system"
```

---

### Task 3: Normalize Blogs typography, colors, tags, and controls

**Files:**
- Modify: `components/blogs/blogs-editorial-hero.tsx`
- Modify: `components/blogs/featured-blog-lead-card.tsx`
- Modify: `components/blogs/blogs-taxonomy-rail.tsx`
- Modify: `components/ui/archive-card.tsx`
- Modify: `components/ui/article-card.tsx`
- Modify: `components/ui/blog-lead-card.tsx`
- Modify: `scripts/public-design-system-selftest.cjs`

**Interfaces:**
- Consumes Task 1 semantic typography, overlay colors, control borders, and square primitives.
- Retains rounded outer article cards and all image/avatar shapes.

- [ ] **Step 1: Extend the self-test with Blogs invariants**

Assert that targeted Blog files contain no `rounded-full` except lines containing `authorAvatar` or image containers, no `font-black`, no archive accent array, no fixed archive colors `#0088FF`, `#D62F1F`, `#40BD00`, `#F5AF41`, `#333`, `#888`, or `#F0F0F0`, and no fixed blog gold `#BDA26B` or `#8e7c49`.

- [ ] **Step 2: Run the test and confirm the current Blog components fail**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: FAIL naming at least one pill, unsupported weight, or fixed color.

- [ ] **Step 3: Apply the shared typography hierarchy**

Change the Blogs masthead to `type-display` with Playfair while retaining its three-word composition. Replace `font-black` and `font-bold` overrides with loaded semantic weights. Use Outfit through `type-body`, `type-meta`, and `type-nav` for excerpts, dates, taxonomy labels, and actions. Do not shrink article titles on hover.

- [ ] **Step 4: Square all internal Blog controls and tags**

Remove pill classes from search, submit, badges, taxonomy tags, article-card badges, and arrow actions. Keep outer card and media radii unchanged. Author avatars remain circular because images are excluded.

- [ ] **Step 5: Replace hard-coded Blog colors with semantic tokens**

Archive cards use `bg-card`, `text-card-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, and `bg-primary`. Image overlays use `bg-overlay-surface` and `text-overlay-foreground`. Article-card cutouts use `bg-background` and CSS-variable shadows derived from `--background`. Remove the independent blue/red/green/yellow accent cycle.

- [ ] **Step 6: Verify and commit the Blogs slice**

Run: `node scripts/public-design-system-selftest.cjs`

Run: `npx eslint components/blogs components/ui/archive-card.tsx components/ui/article-card.tsx components/ui/blog-lead-card.tsx scripts/public-design-system-selftest.cjs`

Expected: both commands exit 0.

Commit:

```bash
git add components/blogs components/ui/archive-card.tsx components/ui/article-card.tsx components/ui/blog-lead-card.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: unify public blog typography and color"
```

---

### Task 4: Audit remaining public surfaces and verify both themes

**Files:**
- Modify: `components/ui/project-card.tsx`
- Modify: `components/layout/footer.tsx`
- Modify: `app/(public)/blogs/page.tsx`
- Verify without intentional changes: `components/projects/*.tsx`, `components/contact/*.tsx`, `components/layout/header.tsx`, `components/layout/page-primitives.tsx`, `components/blogs/blog-detail-shell.tsx`
- Modify: `scripts/public-design-system-selftest.cjs`

**Interfaces:**
- Consumes the completed global contract and shared primitives.
- Produces a clean public-source audit excluding Profile and Admin.

- [ ] **Step 1: Add final source-audit assertions**

Scan public component directories excluding `components/profile` and `components/admin`. Fail on the exact forbidden strings collected in Tasks 1–3, while allowing `rounded-full` only in the explicit image/avatar files `components/blogs/blog-detail-shell.tsx` and `components/blogs/featured-blog-lead-card.tsx`. Fail on `font-black` and public type sizes below `0.75rem`.

- [ ] **Step 2: Run the final source audit and record each remaining violation**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: FAIL with exact file and line details for remaining public violations.

- [ ] **Step 3: Normalize project overlays, footer branding, and the Blogs kicker**

Use shared type classes and semantic colors. In `project-card.tsx`, replace fixed `bg-white text-black` controls with `bg-overlay-foreground text-background`, and replace fixed black translucent controls with `bg-overlay-surface text-overlay-foreground`. Change the footer site name from inherited bold Outfit to `font-serif text-xl font-medium`. Change the Blogs page `0.65rem` Journal kicker to `type-meta`. Do not alter project media radius, author/avatar image radius, or Profile files.

- [ ] **Step 4: Run complete static verification**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: PASS.

Run: `npx eslint .`

Expected: exit 0 with no ESLint errors.

Run: `npx tsc --noEmit --pretty false --incremental false`

Expected: exit 0 with no TypeScript errors.

Run: `npm run build`

Expected: exit 0 with a successful Next.js production build.

- [ ] **Step 5: Run browser verification**

Start the local server and inspect `/`, `/blogs`, `/projects`, `/contact`, one `/blogs/[slug]`, and one `/projects/[slug]` at 1440×1000 and 390×844 in both light and dark themes. Confirm:

- Outer layouts remain rounded.
- Internal controls and tags are square.
- Images preserve their previous shapes.
- Playfair/Outfit roles are consistent.
- Dark primary-button text is readable.
- No fixed white archive cards remain in dark mode.
- Profile renders without intentional source changes.

- [ ] **Step 6: Review the final diff and commit**

Run: `git diff --check`

Run: `git status --short`

Confirm only approved public design-system files, the self-test, and plan/spec documentation are changed.

Commit:

```bash
git add components/ui/project-card.tsx components/layout/footer.tsx app/\(public\)/blogs/page.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: complete public design system consistency"
```
