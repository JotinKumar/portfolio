# Responsive Hero Views Design

## Goal

Create dedicated desktop, tablet, and mobile hero components for the homepage. Each component is selected automatically by viewport width. Only the hero changes; all other homepage sections remain untouched.

## Responsive Architecture

- Desktop keeps the existing split hero implementation without visual or behavioral changes.
- Tablet uses a new tablet-specific hero component based on the supplied reference.
- Mobile uses a new mobile-specific hero component based on the supplied reference.
- CSS responsive visibility utilities select exactly one hero at each supported width. JavaScript viewport detection is not used for selecting the initial component, avoiding hydration mismatch and layout flashes.
- Proposed ranges follow the project's existing Tailwind conventions: mobile below `md`, tablet from `md` through below `lg`, and desktop at `lg` and above.

## Tablet and Mobile Behavior

Both new responsive heroes have three internal views:

1. Choice view: portrait, identity summary, and Professional/Tech selection cards.
2. Professional view: professional title, concise experience summary, skills, resume action, and contact action.
3. Tech view: tech title, concise technology summary, skills, projects action, and articles action.

Selecting a card replaces the choice content inside the hero. A back control returns to the choice view. This does not change the URL or navigate away from the homepage.

## Content and Navigation

- Existing `HeroContent` and `SiteConfig` data remain the source of names, titles, descriptions, skills, labels, portrait URLs, and resume URL.
- Existing internal destinations remain unchanged: contact, projects, and blogs.
- No database, API, CMS, or schema changes are required.

## Visual Direction

- Preserve the established dark, orange, and neutral visual language.
- Tablet uses a centered portrait and two wide stacked selection cards.
- Mobile uses a compact portrait, greeting, two stacked selection cards, and compact social/navigation actions where existing project data supports them.
- Detail views prioritize concise, scannable text and full-width primary/secondary actions.
- All new hero icons use Phosphor Icons, as required by the repository.
- Motion is limited to purposeful view transitions and respects reduced-motion preferences.

## Component Boundaries

- `HeroSplit` remains the desktop implementation.
- A responsive hero wrapper owns breakpoint visibility and passes existing content data through unchanged.
- Tablet and mobile hero components own their local selected-view state independently.
- Shared presentational code may be extracted only when it clearly reduces duplication without coupling the responsive layouts.

## Accessibility and Resilience

- Selection cards and back controls are semantic buttons with accessible labels.
- Focus styles remain visible and keyboard operation is supported.
- Images retain meaningful alternative text and responsive sizing.
- Long CMS content is constrained so it cannot overflow the hero; mobile detail copy is kept concise through layout limits rather than modifying stored content.
- Links retain their existing destinations and fallback behavior.

## Verification

- Run TypeScript checking, lint, and the production build.
- Verify the homepage at representative mobile, tablet, and desktop widths.
- Confirm only one responsive hero is visible at each width.
- Confirm both tablet/mobile cards open the correct in-place detail view and back returns to the choice view.
- Confirm the desktop hero remains visually and behaviorally unchanged.
- Confirm no non-hero homepage section changes.

## Scope Exclusions

- No separate URL routes for hero modes.
- No changes to sections below the hero.
- No content-model, admin, database, dependency, or global navigation redesign.
