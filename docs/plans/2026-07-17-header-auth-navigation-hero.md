# Header Auth, Active Navigation, Blobs, and Hero Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore vibrant circular header blobs, add active navigation styling and role-aware header authentication, provide regular users a private editable basic profile, and refine split-screen hero titles and badges.

**Architecture:** Keep server-loaded public shell data unchanged and add a client-side header auth controller backed by the existing Supabase browser client. Reuse one extracted authentication panel in both the modal and `/auth`, store regular-user basics in Supabase Auth metadata, and determine owner privileges with the existing configured admin email. Keep visual changes token-based and scope the round-blob exception to the decorative canvas.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Auth, React Hook Form, Zod, Radix Dialog, Tailwind CSS 4, Framer Motion.

---

### Task 1: Add regression coverage for the requested behavior

**Files:**
- Modify: `scripts/public-design-system-selftest.cjs`

**Step 1: Write failing source assertions**

Add named assertions requiring:

- circular canvas drawing through `ctx.arc` and forbidding `fillRect` in the blob draw loop;
- vibrant light/dark decorative token chroma;
- a centralized active-route helper used by desktop and mobile navigation;
- an auth control beside the theme switcher with logged-out and authenticated branches;
- Admin and regular-user account actions;
- a login Dialog and account Dialog;
- initial split-screen hero titles larger than the existing `0.95rem` value;
- hero badges using compact padding and a smaller explicit type treatment.

Keep image/avatar exceptions explicit and do not weaken the recursive public audit.

**Step 2: Run the test to verify it fails**

Run: `node scripts/public-design-system-selftest.cjs`

Expected: FAIL with missing circular blob/auth/active-route/hero assertions.

**Step 3: Commit the failing test**

```bash
git add scripts/public-design-system-selftest.cjs
git commit -m "test: define header auth and hero behavior"
```

### Task 2: Restore vibrant circular header blobs

**Files:**
- Modify: `app/globals.css`
- Modify: `components/ui/floating-blobs-bar.tsx`
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Replace square canvas geometry**

In the blob draw loop, draw each blob with a centered circular path:

```ts
const radius = blob.size / 2;
ctx.beginPath();
ctx.arc(blob.x, blob.y, radius, 0, Math.PI * 2);
ctx.fill();
```

Use the radius for bounce boundaries. Preserve the current animation lifecycle, theme MutationObserver, and reduced-motion immediate repaint.

**Step 2: Strengthen decorative theme tokens**

Give `--decorative-1`, `--decorative-2`, and `--decorative-3` clearly vibrant but coordinated light/dark OKLCH values. These tokens remain limited to non-content decoration.

**Step 3: Run focused verification**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint components/ui/floating-blobs-bar.tsx
git diff --check
```

Expected: blob assertions PASS; unrelated auth assertions remain failing until later tasks if the test is staged by section.

**Step 4: Commit**

```bash
git add app/globals.css components/ui/floating-blobs-bar.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: restore vibrant circular header blobs"
```

### Task 3: Add active navigation styling

**Files:**
- Create: `lib/navigation-state.ts`
- Modify: `components/layout/header.tsx`
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Add route matching helper**

Implement `isNavigationItemActive(pathname, href)` so `/` matches only Home and other internal links match themselves and nested routes. External/hash links return false.

**Step 2: Apply one active-state contract**

Use `aria-current="page"` and a persistent semantic shade such as `border-primary/35 bg-primary/12 text-foreground` for active desktop links. Apply an equivalent full-width shade to active mobile Sheet links. Preserve hover/focus styles.

**Step 3: Verify**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint components/layout/header.tsx lib/navigation-state.ts
git diff --check
```

Expected: active-route assertions PASS.

**Step 4: Commit**

```bash
git add lib/navigation-state.ts components/layout/header.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: highlight active public navigation"
```

### Task 4: Extract reusable authentication panel and Dialog primitive

**Files:**
- Create: `components/ui/dialog.tsx`
- Create: `components/auth/auth-panel.tsx`
- Modify: `app/(public)/auth/page.tsx`
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Add Radix Dialog wrapper**

Create the project-standard Dialog exports using the already installed `@radix-ui/react-dialog`. Keep the outer Dialog surface rounded with `--radius-layout`; internal close and form controls remain square.

**Step 2: Extract authentication behavior**

Move email login, signup, Google OAuth, validation, loading, and error behavior from the public auth page into `AuthPanel`. Accept `onAuthenticated(user)` and an optional `redirectTo` so a modal can close without forcing navigation while the full page can redirect.

**Step 3: Reduce `/auth` to composition**

Render the shared `AuthPanel` inside the existing page card. Preserve all current login/signup capabilities.

**Step 4: Verify**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint components/ui/dialog.tsx components/auth/auth-panel.tsx "app/(public)/auth/page.tsx"
git diff --check
```

Expected: reusable auth/Dialog assertions PASS and existing auth behavior remains represented once.

**Step 5: Commit**

```bash
git add components/ui/dialog.tsx components/auth/auth-panel.tsx "app/(public)/auth/page.tsx" scripts/public-design-system-selftest.cjs
git commit -m "refactor: share public authentication panel"
```

### Task 5: Add role-aware header account control

**Files:**
- Create: `components/layout/header-account-control.tsx`
- Modify: `components/layout/header.tsx`
- Modify: `app/api/auth/logout/route.ts` only if its existing response contract needs no-op-safe handling
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Track Supabase auth state**

On mount, call `supabase.auth.getUser()` and subscribe to `onAuthStateChange`. Clean up the subscription. Render a same-height square Login button while unauthenticated and an avatar/initials button when authenticated.

**Step 2: Add Login Dialog**

Compose `AuthPanel` inside the accessible Dialog. Close it when authentication succeeds and refresh the router so server components see the session.

**Step 3: Add account Dialog**

Use `isAdminEmail(user.email)` for branching:

- Admin: `/admin/dashboard`, `/admin/settings`, Log out.
- Regular: `/account/profile`, Log out.

Use `user_metadata.avatar_url` when present; otherwise derive initials from `display_name`, `full_name`, or email. The outer trigger remains square and matches the theme control.

**Step 4: Implement logout**

Sign out through the existing trusted endpoint or Supabase client, clear local state, close the Dialog, refresh the router, and show a success/error toast.

**Step 5: Verify**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint components/layout/header-account-control.tsx components/layout/header.tsx
git diff --check
```

Expected: logged-out, regular, Admin, and logout source assertions PASS.

**Step 6: Commit**

```bash
git add components/layout/header-account-control.tsx components/layout/header.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: add role-aware header account control"
```

### Task 6: Add the regular-user profile page

**Files:**
- Create: `app/(public)/account/profile/page.tsx`
- Create: `components/account/account-profile-form.tsx`
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Protect the page on the server**

Use `getUser()`. Redirect unauthenticated visitors to `/?login=1`. If the owner/Admin opens the route, redirect to `/admin/settings` so site-profile editing stays in the protected admin surface.

**Step 2: Build the basic profile form**

Display email read-only. Edit `display_name`, `avatar_url`, and `bio`. Validate reasonable lengths with Zod. Submit using `supabase.auth.updateUser({ data: ... })`, preserve values on failure, and refresh on success.

**Step 3: Open requested login state**

Teach the Header account control to open its Login Dialog when the URL contains `login=1`, then remove or ignore the query after opening to avoid repeat behavior.

**Step 4: Verify**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint "app/(public)/account/profile/page.tsx" components/account/account-profile-form.tsx components/layout/header-account-control.tsx
git diff --check
```

Expected: profile metadata fields, server protection, and Admin redirect assertions PASS.

**Step 5: Commit**

```bash
git add "app/(public)/account/profile/page.tsx" components/account/account-profile-form.tsx components/layout/header-account-control.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: add editable user account profile"
```

### Task 7: Refine split-screen hero titles and badges

**Files:**
- Modify: `components/home/ProfessionalHero.tsx`
- Modify: `components/home/TechHero.tsx`
- Test: `scripts/public-design-system-selftest.cjs`

**Step 1: Increase initial role-title size**

Replace the `isInitial` `text-[0.95rem]` branch with a responsive clamp around 1.15–1.4rem that still fits each half. Allow controlled wrapping rather than forcing overflow where necessary.

**Step 2: Compact hero badges**

Use a small explicit label size around 0.7–0.72rem with reduced horizontal/vertical padding. Keep `rounded-none`, readable contrast, and square geometry.

**Step 3: Verify**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npx eslint components/home/ProfessionalHero.tsx components/home/TechHero.tsx
git diff --check
```

Expected: title and compact badge assertions PASS.

**Step 4: Commit**

```bash
git add components/home/ProfessionalHero.tsx components/home/TechHero.tsx scripts/public-design-system-selftest.cjs
git commit -m "feat: refine split hero typography"
```

### Task 8: Full verification and browser QA

**Files:**
- Modify only if a verified defect requires a targeted correction.

**Step 1: Run static verification**

Run:

```bash
node scripts/public-design-system-selftest.cjs
npm run lint
npx tsc --noEmit --pretty false --incremental false
npm run build
git diff --check main...HEAD
git status --short
```

Expected: self-test and lint pass. Document the known baseline `playwright.config.ts` `chromiumSandbox` type error and restricted Google Fonts build failure if unchanged.

**Step 2: Run browser matrix**

With the worktree `.env` available, start the dev server and verify:

- desktop and mobile, light and dark;
- circular vibrant blobs behind the header;
- active Home, Profile, Blogs, Projects, Contact states;
- Login Dialog open/close, invalid validation, login, signup switch, Google entry;
- regular user avatar, profile edit/update, logout;
- Admin avatar actions and protected Admin link;
- larger split-screen role titles and smaller badges;
- Profile exception and image presentation unchanged.

Capture screenshots for logged-out Home and at least one authenticated account state without exposing credentials.

**Step 3: Final review**

Inspect `git diff main...HEAD`, confirm no secrets or `.env` files are staged, and request code review before branch handoff.

