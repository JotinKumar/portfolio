# User/Admin Auth Split Design

**Date:** 2026-02-28
**Branch:** `main`

## Goal
Introduce separate authentication experiences:
- `/auth` for users (email/password login, email/password signup, Google login)
- `/admin` for admins (email/password only)

with server-side enforcement for admin-only access.

## Requirements
1. User auth is single page at `/auth`.
2. Admin auth is separate page at `/admin`.
3. User signup supports email/password.
4. User login supports email/password and Google.
5. Admin login supports email/password only (no Google).
6. Admin routes remain server-guarded by admin email check.

## Selected Architecture

### Routing
- Add `app/(public)/auth/page.tsx` for user auth.
- Add `app/(admin)/admin/page.tsx` for admin login entry.
- Keep admin protected pages under `/admin/*` and guard in admin layout.

### Server-side Enforcement
- Keep admin gate in `app/(admin)/admin/layout.tsx` using `getUser()` + `isAdminEmail`.
- Redirect unauthenticated/unauthorized admin access to `/admin`.
- In callback route, if `next` starts with `/admin`, validate admin email before allowing redirect; otherwise sign out and redirect to `/admin?error=unauthorized`.

### Auth Callback and Redirects
- Reuse `app/auth/callback/route.ts`.
- User OAuth sets `redirectTo` to `/auth/callback?next=/`.
- Admin email/password login (no OAuth) redirects client-side to `/admin/dashboard` on success.

### UX Rules
- `/auth` has mode switch: Login vs Sign up.
- Login mode: email/password + Google button.
- Sign up mode: email/password signup (no Google action needed there).
- `/admin` has only email/password fields and no Google controls.

## Risk Controls
- Keep `isAdminEmail` check unchanged as the source of truth.
- Ensure non-admin users cannot persist admin session navigation.
- Keep safe redirect sanitization via existing `getSafeRedirectPath` logic.

## Verification Plan
1. Typecheck: `cmd /c npx tsc --noEmit --pretty false --incremental false`
2. Security script: `cmd /c npm test`
3. Manual flow checks:
   - `/auth` login, signup, Google flow.
   - `/admin` email/password admin login.
   - non-admin login attempt on `/admin` rejected and signed out.
   - `/admin/*` access without valid admin session redirects to `/admin`.