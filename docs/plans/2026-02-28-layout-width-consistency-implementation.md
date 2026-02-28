# Layout Width Consistency Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Normalize page shell widths so public and admin pages feel consistent in transitions, while preserving `login` and `contact` as explicit exceptions.

**Architecture:** Introduce one shared width primitive and apply it through route-group layouts and selected pages. Refactor admin shell so sidebar and content live inside the same centered max-width container, then remove conflicting nested wrappers from key public pages (especially profile). Keep behavior and routing unchanged.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS.

---

### Task 1: Add Shared Shell Width Primitive

**Files:**
- Create: `lib/layout.ts`
- Modify: `app/(public)/layout.tsx`
- Modify: `app/(admin)/layout.tsx`

**Step 1: Write failing type usage expectation**

Add imports in both layouts for a not-yet-existing `APP_SHELL_CLASS` from `@/lib/layout`.

**Step 2: Run typecheck to verify it fails**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: FAIL with module/symbol not found for `@/lib/layout`.

**Step 3: Write minimal implementation**

Create `lib/layout.ts`:

```ts
export const APP_SHELL_CLASS = "w-full max-w-[1280px] mx-auto px-4";
```

Use it in both group layouts.

**Step 4: Run typecheck to verify it passes**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 5: Commit**

```bash
git add lib/layout.ts app/(public)/layout.tsx app/(admin)/layout.tsx
git commit -m "refactor: add shared app shell width primitive"
```

### Task 2: Refactor Admin Shell To Bounded Unified Width

**Files:**
- Modify: `app/(admin)/admin/layout.tsx`
- Modify: `components/admin/sidebar.tsx`

**Step 1: Write failing visual expectation checklist**

Define expected UI behavior:
- sidebar + content align inside centered shell
- no full-bleed sidebar outside app max width
- admin routes maintain existing functionality.

**Step 2: Implement minimal shell structure changes**

Update admin layout to:
- wrap in `APP_SHELL_CLASS`
- place sidebar and main content in one flex row
- keep content padding consistent (`py-8`, `px-0` or equivalent)

Update sidebar container classes only as needed to fit bounded shell.

**Step 3: Verify type safety**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Verify runtime routes**

Run: `cmd /c npm run dev`
Expected: `/admin/dashboard`, `/admin/articles`, `/admin/projects` render with coherent shared width.

**Step 5: Commit**

```bash
git add app/(admin)/admin/layout.tsx components/admin/sidebar.tsx
git commit -m "refactor: align admin sidebar and content within unified shell width"
```

### Task 3: Normalize Public Page Wrappers (Profile Priority)

**Files:**
- Modify: `app/(public)/profile/page.tsx`
- Modify: `app/(public)/articles/page.tsx`
- Modify: `app/(public)/projects/page.tsx`
- Modify: `app/(public)/articles/[slug]/page.tsx`

**Step 1: Write failing wrapper consistency checklist**

Define expected behavior:
- pages rely on group shell width by default
- remove nested `container mx-auto` wrappers that compress/expand inconsistently
- preserve readable text widths for long-form article detail.

**Step 2: Implement minimal wrapper normalization**

- Replace conflicting page-level outer containers with simpler section wrappers (`py-*`, local spacing only).
- Keep internal readability caps where needed (`max-w-3xl` for article content area), but anchor within common shell.

**Step 3: Verify type safety**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Verify visual continuity**

Run: `cmd /c npm run dev`
Expected: smooth edge alignment when navigating `/`, `/profile`, `/articles`, `/projects`, `/articles/[slug]`.

**Step 5: Commit**

```bash
git add app/(public)/profile/page.tsx app/(public)/articles/page.tsx app/(public)/projects/page.tsx app/(public)/articles/[slug]/page.tsx
git commit -m "refactor: normalize public page wrappers to shared shell"
```

### Task 4: Preserve Explicit Exceptions (Login, Contact)

**Files:**
- Verify: `app/(admin)/login/page.tsx`
- Verify: `app/(public)/contact/page.tsx`

**Step 1: Confirm exception constraints**

- `login` remains centered narrow card layout.
- `contact` keeps its current bespoke grid layout.

**Step 2: Run typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 3: Manual smoke check**

Run: `cmd /c npm run dev`
Expected: exception pages remain visually intentional and unaffected.

**Step 4: Commit**

```bash
git add app/(admin)/login/page.tsx app/(public)/contact/page.tsx
git commit -m "chore: preserve login and contact as layout exceptions"
```

### Task 5: Final Verification and Evidence

**Files:**
- Verify only

**Step 1: Typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 2: Build**

Run: `cmd /c npm run build`
Expected: successful compile; if sandbox raises `spawn EPERM`, record as environment limitation and retain typecheck + manual dev verification evidence.

**Step 3: Navigation smoke test**

Run: `cmd /c npm run dev`
Expected:
- consistent shell alignment across admin and main pages
- sidebar and content aligned inside same width
- profile updated and coherent
- login/contact exception behavior preserved.

**Step 4: Commit**

```bash
git add app components lib
git commit -m "feat: enforce coherent cross-page layout width system"
```