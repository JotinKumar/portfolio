# Responsive Hero Views Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add isolated desktop, tablet, and mobile homepage hero components, with in-place Professional and Tech detail views on tablet and mobile.

**Architecture:** Keep `HeroSplit` as the desktop implementation and introduce a client responsive wrapper that renders an SSR/first-hydration placeholder, then exclusively mounts the viewport-selected variant through a shared breakpoint model. Tablet and mobile variants consume existing `HeroContent` and `SiteConfig` props and own only their local view state.

**Tech Stack:** Next.js App Router, React, strict TypeScript, Tailwind CSS, Framer Motion, Next Image, Phosphor Icons, Node test runner, Playwright.

## Global Constraints

- Only the homepage hero may change; all sections below it remain untouched.
- Desktop behavior and appearance remain unchanged at `lg` and above.
- Mobile is below `md`; tablet is `md` through below `lg`; desktop is `lg` and above.
- Selection changes content in place and never changes the URL.
- After hydration, exactly one hero variant is mounted; server output uses one aria-hidden height placeholder.
- Existing CMS data remains the only hero content source.
- Mobile and tablet omit an unavailable resume action; when Contact is the only professional action, it is primary.
- The existing public header and floating top bar remain unchanged.
- All new icons use Phosphor Icons.
- Do not change the database, APIs, admin UI, or global navigation.

---

## File Structure

- Create `components/home/responsive-hero.tsx`: breakpoint wrapper and shared prop boundary.
- Create `components/home/tablet-hero.tsx`: tablet choice and detail states.
- Create `components/home/mobile-hero.tsx`: mobile choice and detail states.
- Create `components/home/responsive-hero-model.ts`: breakpoint selection and conditional professional-action policy.
- Modify `app/(public)/page.tsx`: replace the direct desktop hero render with the responsive wrapper.
- Modify `package.json` and `package-lock.json`: add `@phosphor-icons/react`, required by repository icon policy.
- Create `tests/responsive-hero-model.node.mjs`: breakpoint-boundary and unavailable-resume model coverage.
- Create `playwright.config.ts`, `tests/e2e/responsive-hero.spec.ts`, and `tests/fixtures/*`: durable browser coverage backed by deterministic test-only CMS data.

### Task 1: Phosphor Icon Foundation

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: `HeroContent`, `SiteConfig | null`.
- Produces: the `@phosphor-icons/react` dependency used by Tasks 2 and 3.

- [ ] **Step 1: Record the current desktop contract**

Confirm `HeroSplit` receives the existing props and no lower homepage section depends on it:

```tsx
<HeroSplit heroContent={heroContent} siteConfig={shellData.siteConfig} />
```

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`

Expected: exit code 0 before hero implementation, or record pre-existing errors verbatim.

- [ ] **Step 2: Install the required icon package**

Run: `cmd /c npm install @phosphor-icons/react`

Expected: `package.json` and `package-lock.json` add `@phosphor-icons/react`; no unrelated dependency upgrades.

- [ ] **Step 3: Type-check and commit**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`

Expected: exit code 0.

Commit:

```text
feat: add responsive hero component boundary
```

### Task 2: Tablet Hero

**Files:**
- Create: `components/home/tablet-hero.tsx`

**Interfaces:**
- Consumes: `{ heroContent: HeroContent; siteConfig: SiteConfig | null }`.
- Produces: `TabletHero`, with local `"choice" | "professional" | "tech"` state.

- [ ] **Step 1: Add the tablet state contract and accessible controls**

Use a closed union and semantic buttons:

```tsx
"use client";

type HeroView = "choice" | "professional" | "tech";
const [view, setView] = useState<HeroView>("choice");
```

The Professional and Tech cards call `setView("professional")` and `setView("tech")`; the back button calls `setView("choice")` and uses `aria-label={heroContent.resetViewLabel}`.

- [ ] **Step 2: Implement the tablet choice view**

Render a centered display name, portrait, and two full-width cards inside a bounded hero panel. Use `Briefcase`, `Code`, and `CaretRight` from `@phosphor-icons/react`. The cards expose the CMS labels and concise fixed descriptors: `Pricing, Strategy, Operations` and `Projects, Blogs, Tech Stack`.

- [ ] **Step 3: Implement the two tablet detail views**

Professional detail always renders `/contact` and renders the CMS resume link only when its trimmed URL is nonblank. Tech detail renders `techTitle`, `techSubtitle`, `techSkills`, `/projects`, and `/blogs`. Clamp titles and subtitles visually, allow skill chips to wrap without panel overflow, and keep the action region outside clamped copy.

- [ ] **Step 4: Add purposeful transitions**

Wrap view content in `AnimatePresence mode="wait"` and use a keyed `motion.div`:

```tsx
<motion.div
  key={view}
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.24, ease: "easeOut" }}
>
```

Respect reduced motion through Framer Motion's `useReducedMotion` and substitute zero-distance, near-instant transitions when enabled.

- [ ] **Step 5: Type-check and commit**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`

Expected: exit code 0.

Commit:

```text
feat: add tablet-specific hero flow
```

### Task 3: Mobile Hero

**Files:**
- Create: `components/home/mobile-hero.tsx`
- Create: `components/home/responsive-hero.tsx`
- Modify: `app/(public)/page.tsx`

**Interfaces:**
- Consumes: `{ heroContent: HeroContent; siteConfig: SiteConfig | null }`.
- Produces: `MobileHero`, with local `"choice" | "professional" | "tech"` state.
- Produces: `ResponsiveHero`, which uses the shared viewport model to exclusively mount mobile, tablet, or unchanged desktop after hydration.

- [ ] **Step 1: Add the mobile state and compact shell**

Use the same closed view union locally. Keep the existing public `Header` and floating top bar unchanged. Inside the mobile hero, add only a compact CMS display-name identity band, followed by the square portrait, greeting, two-line role summary, and stacked selection cards. Do not use emoji; the greeting is text-only.

- [ ] **Step 2: Implement mobile detail views**

Use a back arrow and concise hierarchy. Render the same CMS-backed content and links as tablet, with full-width action buttons and wrapped skills. Keep title lines within two to three lines and avoid fixed heights that clip localized or CMS content.

- [ ] **Step 3: Add mobile action icons**

Use Phosphor icons only. Include meaningful actions supported by existing data: contact via `/contact`, projects via `/projects`, and blogs via `/blogs`. Do not invent social URLs that are not supplied to the component.

- [ ] **Step 4: Add reduced-motion-aware transitions**

Use the same `AnimatePresence` keyed-view pattern as tablet, with smaller vertical travel appropriate to the compact viewport.

- [ ] **Step 5: Add the responsive wrapper and connect the homepage**

Create a client `ResponsiveHero` using `useSyncExternalStore`. Return the shared aria-hidden placeholder for the server snapshot, then return only the active branch and subscribe at the 768px and 1024px boundaries. Replace only the direct `HeroSplit` import and render in `app/(public)/page.tsx` with `ResponsiveHero`.

- [ ] **Step 6: Type-check and commit**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`

Expected: exit code 0.

Commit:

```text
feat: add mobile-specific hero flow
```

### Task 4: Visual and Project Verification

**Files:**
- Modify only hero files if verification identifies responsive defects.

**Interfaces:**
- Consumes: completed responsive hero variants.
- Produces: verified responsive behavior at mobile, tablet, and desktop widths.

- [ ] **Step 1: Run static verification**

Run:

```text
cmd /c npm run lint
cmd /c npx tsc --noEmit --pretty false --incremental false
cmd /c npm run build
cmd /c node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON --test tests\responsive-hero-model.node.mjs
cmd /c npm run test:e2e
```

Expected: each command exits 0. If a failure predates this change, capture the exact output and distinguish it from changed-file errors.

- [ ] **Step 2: Start the application**

Run: `cmd /c npm run dev`

Expected: Next.js reports a local URL and serves the homepage without runtime errors.

- [ ] **Step 3: Verify representative viewports**

Inspect the homepage at 390x844, 820x1180, and 1440x900. Exercise exact boundary widths at 767, 768, 1023, and 1024. Confirm:

```text
390px: mobile hero only
820px: tablet hero only
1440px: existing desktop HeroSplit only
SSR/first hydration: placeholder only
after hydration: exactly one mounted variant
```

- [ ] **Step 4: Verify interaction paths**

At both 390px and 820px, exercise:

```text
choice -> professional -> back -> tech -> back
```

Confirm every link has the expected href, local view transitions do not change the URL, focus transfers to Back and restores to the originating choice with a visible ring, content does not overflow horizontally, and reduced-motion behavior remains usable. Use long CMS fixture strings to verify two-line choice/role limits, three-line detail titles, concise subtitles, breakable skill tokens, and unclipped actions.

- [ ] **Step 5: Review scope and commit fixes**

Run: `git diff -- components/home app/(public)/page.tsx package.json package-lock.json tests playwright.config.ts docs/superpowers`

Expected: only responsive hero integration, its component/model files, tests, documentation, and the Phosphor dependency changed. Confirm `HeroSplit.tsx`, `ProfessionalHero.tsx`, and `TechHero.tsx` have no diff. Commit any verification-only adjustments as:

```text
fix: refine responsive hero layouts
```

## Accepted Implementation Tradeoffs

- The hydration placeholder avoids server/client viewport mismatch, but hero content and interactivity begin only after hydration; without client JavaScript, the placeholder remains.
- Static imports leave inactive hero modules in the client graph even though only one variant mounts. Code splitting is intentionally deferred.
- Crossing 768px or 1024px remounts a different variant and resets its local view/focus state to the choice screen.
