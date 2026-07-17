# Header Authentication, Navigation, Blobs, and Hero Design

## Objective

Restore the vibrant circular blob animation behind the public header, make the current navigation section visually identifiable, add role-aware authentication controls to the header, and refine split-screen hero typography without changing image presentation.

## Visual behavior

- Floating header decorations return to soft, vibrant circular blobs. They are an explicit decorative exception to the square internal-element rule.
- Blob colors remain theme-aware and retain reduced-motion behavior.
- The active navigation item receives a persistent semantic background, border, and foreground treatment on desktop and mobile. Nested routes activate their parent section; `/` matches only Home.
- The Login control sits directly beside the theme switcher and matches its square height.
- Authenticated users see a square avatar control. A circular avatar image may appear inside it as an image exception; otherwise initials are shown.
- In the initial split-screen hero, “Pricing and Solutions Director” and “Self-Taught Tech Enthusiast” become visibly larger with responsive sizing that avoids overflow.
- Hero skill badges become smaller through reduced font size and padding while remaining square and legible.

## Authentication behavior

- Login opens an accessible modal rather than navigating away.
- The modal supports the existing email/password login, Google login, and account-creation flows.
- Header auth state uses the existing Supabase browser client and reacts to authentication changes without requiring a full reload.
- Admin status is determined by the existing configured owner email through `isAdminEmail`.
- The authenticated avatar menu provides:
  - Admin: Admin Dashboard, Edit Site Profile, Log out.
  - Regular user: My Profile, Edit Profile, Log out.
- Logout uses the existing trusted logout endpoint or Supabase sign-out path and immediately restores the Login control.

## Regular-user profile

- A protected account page shows and edits only the signed-in user’s basic information.
- Editable fields: display name, avatar URL, and short bio. Email is visible but read-only.
- Data is stored in Supabase Auth `user_metadata`, avoiding a new database table or migration for this basic private profile.
- Unauthenticated visitors are redirected to the public site and can reopen the login modal.
- Admin profile editing continues to use the existing protected admin surface; regular users cannot access Admin routes.

## Components and data flow

- Public layout continues to load site/navigation data on the server.
- Header owns client auth state and composes an auth modal and authenticated account menu.
- Reusable auth form logic is extracted from the existing public auth page where practical so modal and full-page behavior do not diverge.
- Navigation active-state matching is centralized in a small helper and shared by desktop and mobile links.
- Floating blob rendering changes from square `fillRect` geometry back to circular paths while preserving theme mutation and reduced-motion repaint handling.

## Accessibility and failure handling

- Modal has an accessible title, description, focus trap, Escape dismissal, labelled fields, and visible validation states.
- Login/avatar controls have explicit accessible names.
- Account menu is keyboard operable and dismisses on selection/outside interaction.
- Authentication errors remain visible through the existing toast system.
- Missing avatar data falls back to deterministic initials.
- Failed profile updates retain form values and display the returned error.

## Verification

- Extend the public design-system self-test for circular blobs, active navigation state, role-aware auth actions, hero title sizing, and compact badges.
- Add focused tests or source assertions for route matching and Admin/regular menu branching.
- Run targeted ESLint, the public design-system self-test, TypeScript checks where the existing Playwright configuration permits, and browser verification at desktop/mobile sizes in light and dark themes.
- Verify logged-out, regular-user, Admin, login, logout, and profile-update paths against the running application.

