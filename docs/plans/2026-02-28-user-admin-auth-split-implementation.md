# User/Admin Auth Split Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement separate user and admin login surfaces with signup on user auth and strict email/password-only admin access.

**Architecture:** Add a dedicated `/auth` page for user auth flows and repurpose `/admin` as admin login entry, while preserving server-side admin access checks in admin layout and callback handling. Keep existing Supabase integration and security utilities.

**Tech Stack:** Next.js App Router, React, TypeScript, Supabase SSR/Auth, Zod, existing UI components.

---

### Task 1: Create User Auth Page (`/auth`)

**Files:**
- Create: `app/(public)/auth/page.tsx`
- Modify: `app/(public)/layout.tsx` (only if route-level links needed)

**Step 1: Add failing route expectation**

Confirm `/auth` does not exist yet.

**Step 2: Implement page**

Build a client page with mode toggle:
- Login mode: email/password + Google
- Sign up mode: email/password signup + switch back to login

Use `createClient()` and existing form components.

**Step 3: Redirect behavior**

- Successful login -> `/`
- Successful signup -> success message (or redirect `/` if immediate session)
- Google login uses `/auth/callback?next=/`

**Step 4: Verify**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 5: Commit**

```bash
git add app/(public)/auth/page.tsx
git commit -m "feat: add user auth page with login, signup, and google"
```

### Task 2: Move Admin Login To `/admin` And Remove Google

**Files:**
- Create: `app/(admin)/admin/page.tsx`
- Delete: `app/(admin)/login/page.tsx`

**Step 1: Implement admin login page at `/admin`**

Port existing admin login UI and logic, but:
- remove Google login button/handler
- keep email/password login only
- keep `isAdminEmail` enforcement and signout on non-admin
- on success route to `/admin/dashboard`

**Step 2: Remove legacy `/login` page**

Delete old admin login file to avoid duplicate entry points.

**Step 3: Verify**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/(admin)/admin/page.tsx app/(admin)/login/page.tsx
git commit -m "feat: use /admin as email-password-only admin login"
```

### Task 3: Update Server Redirects/Guards

**Files:**
- Modify: `app/(admin)/admin/layout.tsx`
- Modify: `app/auth/callback/route.ts`

**Step 1: Update admin guard redirect target**

In admin layout, unauthenticated/unauthorized users redirect to `/admin` (not `/login`).

**Step 2: Update callback failures**

In callback route:
- missing code -> `/admin` if next is admin target, otherwise `/auth`
- exchange failure -> same target logic
- admin unauthorized -> `/admin?error=unauthorized`

**Step 3: Verify**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 4: Commit**

```bash
git add app/(admin)/admin/layout.tsx app/auth/callback/route.ts
git commit -m "fix: align auth redirects with split user and admin login routes"
```

### Task 4: Update Auth Navigation Links

**Files:**
- Modify: `components/layout/header.tsx` (if login/auth links are shown)
- Modify: any existing links targeting `/login`

**Step 1: Replace user auth links**

Any user-facing login CTA should target `/auth`.

**Step 2: Keep admin entry explicit**

Admin entry (if present) should point to `/admin`.

**Step 3: Verify**

Run: `rg -n "href=\"/login\"|router\.push\('/login'|redirect\('/login'" app components lib`
Expected: no stale `/login` references for auth flow.

**Step 4: Commit**

```bash
git add app components lib
git commit -m "chore: update auth navigation links to /auth and /admin"
```

### Task 5: Verification And Merge Safety

**Files:**
- Verify only

**Step 1: Typecheck**

Run: `cmd /c npx tsc --noEmit --pretty false --incremental false`
Expected: PASS.

**Step 2: Security test**

Run: `cmd /c npm test`
Expected: PASS.

**Step 3: Build**

Run: `cmd /c npm run build`
Expected: compile success; if sandbox `spawn EPERM` recurs, record as environment limitation.

**Step 4: Manual flow checks**

Run dev and verify:
- `/auth` login/signup/google
- `/admin` email/password admin login only
- non-admin admin login attempt denied + signed out
- `/admin/dashboard` redirects to `/admin` when not admin

**Step 5: Final commit**

```bash
git add app components lib
git commit -m "feat: implement split user/admin auth with server-side admin enforcement"
```