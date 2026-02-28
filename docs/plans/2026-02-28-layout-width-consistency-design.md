# Layout Width Consistency Design

**Date:** 2026-02-28
**Branch:** `feature/vercel-react-remediation`

## Goal
Create a coherent, predictable page width system so transitions between main pages and admin pages feel smooth, while keeping `login` and `contact` as intentional exceptions.

## Scope
- In scope: public + admin layout shells, admin sidebar/content alignment, profile page width normalization, shared width utility usage.
- Out of scope: visual redesign, component restyling, route changes, data logic changes.

## Requirements
1. Public and admin experiences follow the same max-width rhythm.
2. Admin sidebar must be inside the same centered shell as content.
3. `login` and `contact` remain exceptions.
4. Profile page should be updated to match normalized shell behavior.

## Approaches Considered

### Option A: One global shell only
- Put all pages under one hardcoded wrapper.
- Pros: simple mentally.
- Cons: fights admin UX and special-case pages.

### Option B: Shared width token + dedicated shells (selected)
- Define one canonical width wrapper and apply it across public/admin layouts.
- Keep admin shell structure (sidebar + content), but bound it to centered max width.
- Preserve exception pages explicitly.

### Option C: Per-page patching
- Fix each page manually.
- Pros: quick.
- Cons: regressions likely, inconsistent over time.

## Selected Design

### 1) Shared Width Primitive
- Create a shared class helper/constant for shell width:
  - `max-w-[1280px] mx-auto w-full px-4`
- Public and admin layouts consume this primitive instead of ad-hoc container widths.

### 2) Public Layout
- Keep existing background/header/footer stack.
- Ensure page content wrapper is the canonical width primitive.
- Remove nested page-level wrappers where they create conflicting width behavior.

### 3) Admin Layout
- Refactor admin layout to:
  - centered canonical shell wrapper
  - inner row: sidebar (`w-64`) + content (`flex-1`)
  - consistent vertical spacing
- Sidebar and content remain cohesive and aligned with public page edges.

### 4) Page Normalization Rules
- Pages that currently mix `container mx-auto`, custom `max-w-*`, and nested wrappers will be normalized.
- Target first: profile page and article/project public pages.
- Exceptions preserved: `login`, `contact`.

## Error Handling / Regression Safety
- No route/path changes.
- Keep existing auth guards unchanged.
- Restrict edits to layout containers/classes only.

## Testing Strategy
1. Type safety: `npx tsc --noEmit --pretty false --incremental false`.
2. Build verification: `npm run build` (noting existing sandbox `spawn EPERM` limitation).
3. Visual smoke checks in dev:
   - `/`
   - `/profile`
   - `/articles`, `/articles/[slug]`
   - `/projects`
   - `/admin/dashboard` and sibling admin pages
   - `/contact`, `/login` (confirm exceptions remain intentional)
4. Confirm consistent left/right alignment and max width during navigation.

## Success Criteria
- Main and admin pages share the same width rhythm.
- Admin sidebar is no longer visually detached from main shell.
- Profile page matches normalized width behavior.
- No functional regressions.