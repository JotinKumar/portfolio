# Profile Hybrid Resume Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform `/profile` into a hybrid resume page with stronger visual hierarchy, cleaner experience storytelling, and polished but restrained visual styling.

**Architecture:** Keep page as a server component driven by `getProfileData` plus resume fallback constants. Restructure page into semantic sections with reusable local mappings, preserving existing data behavior while improving layout, spacing, and presentation.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, existing UI components.

---

### Task 1: Establish Sectioned Profile Skeleton

**Files:**
- Modify: `app/(public)/profile/page.tsx`

**Step 1: Write failing structure expectation**

Define expected section blocks:
- Hero
- Summary
- Experience
- Competencies
- Contact actions

**Step 2: Implement minimal section wrappers**

Refactor top-level JSX into these semantic sections with consistent spacing.

**Step 3: Verify typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/(public)/profile/page.tsx
git commit -m "refactor: structure profile page into semantic resume sections"
```

### Task 2: Build Hybrid Hero + Quick Facts

**Files:**
- Modify: `app/(public)/profile/page.tsx`

**Step 1: Implement hero layout**

Add two-column hero:
- left: identity/title/CTA
- right: quick facts card (location, years, current role, competency tags)

**Step 2: Keep fallback-safe data mapping**

Derive hero and facts from `settings` or resume constants safely.

**Step 3: Verify typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/(public)/profile/page.tsx
git commit -m "feat: add hybrid profile hero with quick facts"
```

### Task 3: Improve Experience Storytelling

**Files:**
- Modify: `app/(public)/profile/page.tsx`

**Step 1: Normalize parsed experience data once**

Create mapped experience model including parsed arrays.

**Step 2: Render experience cards with hierarchy**

Prioritize role/company/date/location, then impact bullets, then skills chips.
Highlight current role clearly.

**Step 3: Verify typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/(public)/profile/page.tsx
git commit -m "feat: redesign profile experience section for resume readability"
```

### Task 4: Competencies + Contact Band Polish

**Files:**
- Modify: `app/(public)/profile/page.tsx`

**Step 1: Upgrade competencies block**

Use grouped cards/lists with clearer visual separation.

**Step 2: Add polished contact action band**

Include email/social/resume actions in a compact finishing section.

**Step 3: Add subtle motion classes**

Use non-intrusive entrance animation utility classes only.

**Step 4: Verify typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/(public)/profile/page.tsx
git commit -m "feat: finalize profile competencies and contact action design"
```

### Task 5: Final Verification

**Files:**
- Verify only

**Step 1: Typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 2: Tests**

Run: `cmd /c npm test`
Expected: PASS.

**Step 3: Build**

Run: `cmd /c npm run build`
Expected: compile success; if sandbox `spawn EPERM` appears, document limitation.

**Step 4: Commit**

```bash
git add app/(public)/profile/page.tsx
git commit -m "feat: deliver hybrid resume profile page redesign"
```