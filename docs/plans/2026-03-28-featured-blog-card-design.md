# Featured Blog Card Design

## Goal

Replace the current main featured article surface on the public blogs page with an adapted editorial card based on the provided reference component.

## Direction

The new featured article should keep the reference layout logic:

- a lifted image panel on the left
- a structured content panel on the right
- a bottom utility strip with date and multiple icons
- a floating circular action button

The styling should be adapted to the existing portfolio language rather than copied directly. That means:

- warmer off-white and paper-like surfaces instead of pure white
- restrained editorial typography that matches the authored tone already used on the blogs page
- accents drawn from the existing `primary` token and site palette
- shadows and motion that feel refined rather than glossy or template-like

## Behavioral Intent

- The featured article should read as the main story, distinct from the supporting compact cards.
- If the article has no cover image, the card should still render with the placeholder image asset rather than collapsing into a decorative fallback block.
- The bottom strip should keep multiple icons as requested, but they should behave as supporting visual metadata/actions rather than noisy primary controls.
- The floating action button should remain the most active micro-interaction on the card.

## Scope

- Modify the main featured article display inside `components/sections/blogs/blogs-editorial-hero.tsx`
- Reuse existing article data rather than changing the query layer
- Add targeted test coverage for the featured card structure on `/blogs`

## Non-Goals

- Do not redesign the compact side cards
- Do not restructure the broader blogs page layout
- Do not add new backend fields or CMS requirements
