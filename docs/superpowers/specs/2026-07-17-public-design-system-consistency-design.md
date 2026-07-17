# Public Design System Consistency

## Objective

Create one consistent typography, color, and corner-radius system across every public-facing page except Profile. Preserve the portfolio's warm editorial identity while removing component-level visual drift.

## Scope

Included public surfaces:

- Home
- Blogs and blog details
- Projects and project details
- Contact
- Shared public header, footer, cards, forms, navigation, badges, tags, and controls

Excluded:

- Profile and Profile-specific components
- Admin pages
- Content, data, routing, and application behavior
- Image and portrait corner treatments

## Design Rules

### Geometry

- Major page shells, hero containers, cards, and layout sections remain rounded.
- All internal interactive and informational UI elements are square: buttons, icon buttons, inputs, textareas, search controls, badges, tags, chips, filters, and navigation controls.
- Images, portraits, and content media retain their existing shapes.
- Shared radius roles will be defined globally instead of using unrelated arbitrary radii in individual components.

### Typography

- Playfair Display is the public heading and editorial display family.
- Outfit is the body, lead, navigation, button, label, tag, and metadata family.
- Font weights used by components must exist in the loaded font configuration; synthesized bold and black weights are not allowed.
- Public pages will use the shared semantic type classes in `app/globals.css`.
- Body text will be at least `1rem`. Metadata and tags will not be reduced below `0.75rem` when they contain meaningful information.
- Timeline numerals will use Outfit with tabular numerals rather than an undefined monospace font.
- Page-specific size overrides will be removed when an existing semantic type role can provide the same hierarchy.

### Color

- The existing warm ivory, brown, charcoal, and burnt-orange direction remains.
- Semantic light and dark tokens in `app/globals.css` are the source of truth.
- Burnt orange is the sole interactive brand accent.
- Hard-coded archive-card colors, cyan controls, neon decorative colors, fixed white surfaces, and fixed black surfaces will be replaced with theme-aware semantic tokens where they are not required for image contrast.
- Dark-theme primary buttons will use a dark foreground on the brighter orange background to meet WCAG AA contrast.
- A stronger control-border token will distinguish interactive boundaries from subtle decorative borders.
- Reduced-opacity text will be limited to decorative or nonessential content; meaningful labels must retain readable contrast.

## Global-First Implementation

1. Update `app/globals.css` with semantic typography, color, control-border, radius, and shared control/tag rules.
2. Keep shared primitives such as Button, Badge, Input, and Textarea as the implementation boundary for repeated controls.
3. When the same visual override exists in multiple components, merge it into a shared primitive or global semantic class rather than duplicating fixes.
4. Remove page-level overrides only after the global/shared rule exists.
5. Leave Profile-specific selectors and components unchanged.

## Component Consolidation

- Button variants share square geometry and semantic foreground/background pairs.
- Badge and tag styles share square geometry, minimum type size, and semantic colors.
- Form controls share square geometry and the stronger control border.
- Public headings and body copy use the semantic type classes instead of repeated font declarations.
- Image-overlay controls may use dedicated overlay tokens, but their geometry remains square.
- Circular avatars and media are not converted because images are explicitly excluded.

## Accessibility Requirements

- Normal text contrast meets WCAG AA at 4.5:1.
- Large text and visible control boundaries meet at least 3:1.
- Dark primary-button text must meet 4.5:1.
- Focus rings remain visible in both themes.
- Meaningful public text is not made unreadable through low opacity or sub-12px sizing.

## Verification

- Run ESLint across the project.
- Run TypeScript type checking without emitting files.
- Run the production build.
- Inspect Home, Blogs, Projects, Contact, one blog detail, and one project detail in light and dark themes.
- Confirm Profile has no intentional styling changes.
- Search public components for remaining pill-shaped controls, hard-coded off-palette colors, unsupported font weights, and duplicated semantic styling.

## Success Criteria

- Public pages use one recognizable Playfair/Outfit hierarchy.
- Light and dark themes express the same warm editorial palette.
- All internal controls, tags, and badges are square.
- Outer layout surfaces remain rounded.
- Images retain their existing corner treatments.
- Shared patterns are implemented globally or through shared components instead of repeated local overrides.
