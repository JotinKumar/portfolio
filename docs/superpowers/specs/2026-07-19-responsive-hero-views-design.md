# Responsive Hero Views Design

## Goal

Create dedicated desktop, tablet, and mobile hero components for the homepage. Each component is selected automatically by viewport width. Only the hero changes; all other homepage sections remain untouched.

## Responsive Architecture

- Desktop keeps the existing split hero implementation without visual or behavioral changes.
- Tablet uses a new tablet-specific hero component based on the supplied reference.
- Mobile uses a new mobile-specific hero component based on the supplied reference.
- `ResponsiveHero` uses `useSyncExternalStore`, `window.innerWidth`, and `matchMedia` subscriptions at 768px and 1024px. After hydration, it mounts exactly one viewport-selected hero instead of keeping inactive variants in the DOM.
- Server rendering and the first hydration render contain one aria-hidden, height-preserving placeholder and no hero variant. This keeps server/client markup stable while viewport state becomes available.
- Ranges follow the project's existing Tailwind conventions: mobile below `md`, tablet from `md` through below `lg`, and desktop at `lg` and above.

## Tablet and Mobile Behavior

Both new responsive heroes have three internal views:

1. Choice view: portrait, identity summary, and Professional/Tech selection cards.
2. Professional view: professional title, concise experience summary, skills, contact action, and a resume action only when `SiteConfig.resumeUrl` is nonblank. When resume is unavailable, Contact is the sole action and uses the primary treatment.
3. Tech view: tech title, concise technology summary, skills, projects action, and articles action.

Selecting a card replaces the choice content inside the hero. A back control returns to the choice view. This does not change the URL or navigate away from the homepage.

## Content and Navigation

- Existing `HeroContent` and `SiteConfig` data remain the source of names, titles, descriptions, skills, labels, portrait URLs, and resume URL.
- Existing internal destinations remain unchanged: contact, projects, and blogs.
- No database, API, CMS, or schema changes are required.

## Visual Direction

- Preserve the established dark, orange, and neutral visual language.
- Tablet uses a centered portrait and two wide stacked selection cards.
- Mobile uses a compact portrait, greeting, two stacked selection cards, and shortcuts to `/contact`, `/projects`, and `/blogs`.
- The existing public `Header` and `FloatingBlobsBar` remain unchanged. The compact display-name band inside the mobile hero is identity chrome, not replacement navigation or a second site header.
- Detail views prioritize concise, scannable text and full-width primary/secondary actions.
- All new hero icons use Phosphor Icons, as required by the repository.
- Motion is limited to purposeful view transitions and respects reduced-motion preferences.

## Component Boundaries

- `HeroSplit` remains the desktop implementation.
- A responsive hero wrapper owns the viewport subscription, hydration placeholder, and mutually exclusive variant mounting while passing existing content data through unchanged.
- Tablet and mobile hero components own their local selected-view state independently.
- Crossing 768px or 1024px unmounts the prior variant, so a remounted mobile or tablet hero intentionally starts at its choice view.
- Shared presentational code may be extracted only when it clearly reduces duplication without coupling the responsive layouts.

## Accessibility and Resilience

- Selection cards and back controls are semantic buttons with accessible labels.
- Focus styles remain visible and keyboard operation is supported.
- Images retain meaningful alternative text and responsive sizing.
- Choice labels and role summaries are limited to two lines, detail titles to three lines, and detail subtitles to four lines. These surfaces and skill tokens use `overflow-wrap:anywhere` so long CMS strings cannot create horizontal overflow.
- Internal destinations remain unchanged. Mobile and tablet omit the resume action when its URL is missing or blank instead of rendering a placeholder href; unchanged desktop fallback behavior remains outside this feature.

## Verification

- Run TypeScript checking, lint, and the production build.
- Verify the homepage at representative mobile, tablet, and desktop widths.
- Confirm SSR and the first hydration render contain one placeholder and no hero variant; after hydration and every breakpoint resize, confirm exactly one responsive hero is mounted.
- Confirm both tablet/mobile cards open the correct in-place detail view and back returns to the choice view.
- Run the checked-in Playwright regression against its test-only fake Supabase service to verify breakpoint boundaries, focus transfer/restoration, hrefs, reduced motion, long CMS content, and horizontal overflow without a live database.
- Confirm the desktop hero remains visually and behaviorally unchanged.
- Confirm no non-hero homepage section changes.

## Scope Exclusions

- No separate URL routes for hero modes.
- No changes to sections below the hero.
- No content-model, admin, database, dependency, or global navigation redesign.

## Accepted Tradeoffs

- The viewport-specific hero is hydration-gated. Without client JavaScript, the height-preserving placeholder remains, so hero content and interactivity are not present in server-only output.
- Static imports keep all three hero modules in the client dependency graph even though only one variant mounts. Removing inactive modules from that graph is a separate optimization, not part of this design.
- Breakpoint changes remount the selected variant and reset its local Professional/Tech selection and focus state. This is intentional and keeps inactive state out of the DOM.
