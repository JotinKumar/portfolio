# Hero Rotating Border Design

## Goal

Add a configurable animated gradient border around the home page's existing glass hero panel. The scroll cue must remain outside the border and retain its current overlap and scrolling behavior.

## Scope

The change is limited to the public home hero and a reusable UI primitive:

- Add `components/ui/border-rotate.tsx` as a reusable wrapper.
- Add the wrapper's animation and reduced-motion styles to `app/globals.css`.
- Wrap only the existing `Glassmorphism` panel in `components/home/HeroSplit.tsx`.
- Preserve the hero's current split interaction, dimensions, clipping, typography, buttons, responsive layout, and scroll cue.

No dependencies, content changes, database changes, or downstream page redesigns are included.

## Component Design

`BorderRotate` will accept children, standard `div` attributes, an optional class name and style object, animation mode, animation speed, three gradient colors, background color, border width, and border radius. Its default palette will use the supplied warm brown and gold values.

The component will render two background layers: a solid inner layer and a conic-gradient border layer. The gradient stops will progress in ascending order so browsers do not clamp them into unintended hard bands. CSS custom properties will carry configurable values into the stylesheet.

Three animation modes will be supported:

- `auto-rotate`: rotate continuously.
- `rotate-on-hover`: remain static until hovered.
- `stop-rotate-on-hover`: rotate continuously and pause while hovered.

The global stylesheet will register the animated angle with `@property`, define the keyframes and mode classes, and disable animation under `prefers-reduced-motion: reduce`.

## Hero Integration

`HeroSplit` will place `BorderRotate` directly around the current `Glassmorphism` element. The wrapper will own the existing maximum width, fixed/responsive height, overflow clipping, and responsive corner radius. The glass panel will fill that wrapper.

The `ScrollCue` remains a sibling after the bordered wrapper. Its negative top margin, stacking level, click handler, test ID, and accessible label remain unchanged.

The border will use a two-pixel width and a deliberately slow continuous rotation so it reads as ambient polish rather than a competing focal animation. Its solid inner background will match the existing surface color and will not cover the hero's portraits or split content because those remain inside the glass panel above it.

## Accessibility and Resilience

- Respect `prefers-reduced-motion` by presenting a static gradient border.
- Preserve existing keyboard, pointer, and screen-reader behavior because the wrapper is non-interactive.
- Preserve button contrast and all current accessible labels.
- Keep `box-sizing: border-box` on the wrapper so the border does not expand the intended hero dimensions.
- Avoid new horizontal overflow and retain the hero's existing clipping boundary.

## Verification

1. Add a focused failing contract check before implementation to establish that the reusable component and hero integration do not yet exist.
2. Implement the minimum component, stylesheet, and hero wrapper changes needed to satisfy that check.
3. Run ESLint and the production build.
4. Run the relevant browser verification at desktop and mobile widths.
5. Confirm that the border animates around only the glass panel, reduced-motion disables rotation, hero mode controls still work, portraits and text remain visible, and the scroll cue remains outside and functional.

## Acceptance Criteria

- A warm animated gradient border surrounds only the main glass hero panel.
- The scroll cue is not enclosed by the border.
- All three component animation modes behave as documented.
- The border does not alter the hero's layout, clipping, interaction, or content visibility.
- Reduced-motion users receive a static border.
- No new dependency is added.
- Lint and build complete successfully, and browser verification finds no new console or layout errors.
