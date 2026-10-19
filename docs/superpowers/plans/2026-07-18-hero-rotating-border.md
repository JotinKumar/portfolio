# Hero Rotating Border Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a reusable warm rotating-gradient border around only the home page's glass hero panel while leaving the scroll cue outside it.

**Architecture:** A focused `BorderRotate` UI wrapper owns the two-layer gradient border and exposes configurable motion and color props. Global CSS registers and animates the gradient angle, while `HeroSplit` supplies the existing responsive dimensions and wraps only `Glassmorphism`; the scroll cue remains a sibling.

**Tech Stack:** React 19, TypeScript, Next.js 16 App Router, Tailwind CSS 4, native CSS custom properties and `@property`, Node.js built-in test runner, existing Framer Motion hero implementation.

## Global Constraints

- Do not add dependencies.
- Preserve the current split interaction, clipping, typography, content, buttons, hero dimensions, and scroll-cue behavior.
- Wrap only the existing glass hero panel; do not include `ScrollCue` inside the rotating border.
- Use a two-pixel warm brown/gold border with a slow continuous default rotation.
- Correct gradient stops into ascending percentage order.
- Disable rotation under `prefers-reduced-motion: reduce`.
- Preserve unrelated working-tree changes and stage only files named in each task.

## File Structure

- Create `components/ui/border-rotate.tsx`: reusable gradient-border wrapper and its public prop interface.
- Modify `app/globals.css`: angle registration, animation modes, and reduced-motion fallback.
- Modify `components/home/HeroSplit.tsx`: wrap only `Glassmorphism` and move panel sizing to the wrapper.
- Create `scripts/hero-border-contract.test.mjs`: dependency-free source contract checks for the primitive, styles, and exact hero/scroll-cue nesting.

---

### Task 1: Build the reusable rotating-border primitive

**Files:**
- Create: `components/ui/border-rotate.tsx`
- Modify: `app/globals.css`
- Create: `scripts/hero-border-contract.test.mjs`

**Interfaces:**
- Consumes: React `CSSProperties`, `HTMLAttributes`, and `ReactNode` types.
- Produces: `BorderRotate(props: BorderRotateProps): React.ReactElement`, with `animationMode`, `animationSpeed`, `gradientColors`, `backgroundColor`, `borderWidth`, and `borderRadius` customization.
- Produces CSS classes: `gradient-border-component`, `gradient-border-auto`, `gradient-border-hover`, and `gradient-border-stop-hover`.

- [ ] **Step 1: Write the failing primitive contract test**

Create `scripts/hero-border-contract.test.mjs`:

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function readSource(relativePath) {
  return readFile(new URL(relativePath, projectRoot), "utf8");
}

test("BorderRotate exposes configurable modes and reduced-motion styles", async () => {
  const component = await readSource("components/ui/border-rotate.tsx");
  const globals = await readSource("app/globals.css");

  assert.match(component, /export function BorderRotate/);
  assert.match(component, /type AnimationMode =/);
  assert.match(component, /gradient-border-auto/);
  assert.match(component, /gradient-border-hover/);
  assert.match(component, /gradient-border-stop-hover/);
  assert.match(globals, /@property --gradient-angle/);
  assert.match(globals, /@keyframes gradient-border-rotate/);
  assert.match(globals, /prefers-reduced-motion: reduce/);
});
```

- [ ] **Step 2: Run the primitive test and verify RED**

Run:

```bash
node --test --test-name-pattern="BorderRotate exposes" scripts/hero-border-contract.test.mjs
```

Expected: FAIL with `ENOENT` for `components/ui/border-rotate.tsx`.

- [ ] **Step 3: Implement the `BorderRotate` component**

Create `components/ui/border-rotate.tsx`:

```tsx
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type AnimationMode =
  | "auto-rotate"
  | "rotate-on-hover"
  | "stop-rotate-on-hover";

type GradientColors = {
  primary: string;
  secondary: string;
  accent: string;
};

interface BorderRotateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "className" | "style"> {
  children: ReactNode;
  className?: string;
  animationMode?: AnimationMode;
  animationSpeed?: number;
  gradientColors?: GradientColors;
  backgroundColor?: string;
  borderWidth?: number;
  borderRadius?: CSSProperties["borderRadius"];
  style?: CSSProperties;
}

const defaultGradientColors: GradientColors = {
  primary: "#584827",
  secondary: "#c7a03c",
  accent: "#f9de90",
};

const animationClasses: Record<AnimationMode, string> = {
  "auto-rotate": "gradient-border-auto",
  "rotate-on-hover": "gradient-border-hover",
  "stop-rotate-on-hover": "gradient-border-stop-hover",
};

export function BorderRotate({
  children,
  className = "",
  animationMode = "auto-rotate",
  animationSpeed = 8,
  gradientColors = defaultGradientColors,
  backgroundColor = "var(--background)",
  borderWidth = 2,
  borderRadius,
  style = {},
  ...props
}: BorderRotateProps) {
  const radius =
    typeof borderRadius === "number"
      ? `${borderRadius}px`
      : borderRadius ?? "var(--border-radius, 20px)";

  const combinedStyle = {
    "--gradient-primary": gradientColors.primary,
    "--gradient-secondary": gradientColors.secondary,
    "--gradient-accent": gradientColors.accent,
    "--bg-color": backgroundColor,
    "--border-width": `${borderWidth}px`,
    "--animation-duration": `${animationSpeed}s`,
    border: `${borderWidth}px solid transparent`,
    borderRadius: radius,
    backgroundImage: `
      linear-gradient(${backgroundColor}, ${backgroundColor}),
      conic-gradient(
        from var(--gradient-angle),
        ${gradientColors.primary} 0%,
        ${gradientColors.secondary} 27%,
        ${gradientColors.accent} 30%,
        ${gradientColors.secondary} 33%,
        ${gradientColors.primary} 40%,
        ${gradientColors.primary} 50%,
        ${gradientColors.secondary} 77%,
        ${gradientColors.accent} 80%,
        ${gradientColors.secondary} 83%,
        ${gradientColors.primary} 90%,
        ${gradientColors.primary} 100%
      )
    `,
    backgroundClip: "padding-box, border-box",
    backgroundOrigin: "padding-box, border-box",
    ...style,
  } as CSSProperties;

  return (
    <div
      className={`gradient-border-component ${animationClasses[animationMode]} ${className}`.trim()}
      style={combinedStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export type { AnimationMode, BorderRotateProps, GradientColors };
```

- [ ] **Step 4: Add the animation and reduced-motion CSS**

Append this focused block to `app/globals.css` outside any selector:

```css
@property --gradient-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes gradient-border-rotate {
  to {
    --gradient-angle: 360deg;
  }
}

.gradient-border-component {
  box-sizing: border-box;
}

.gradient-border-auto,
.gradient-border-stop-hover {
  animation: gradient-border-rotate var(--animation-duration) linear infinite;
}

.gradient-border-hover:hover {
  animation: gradient-border-rotate var(--animation-duration) linear infinite;
}

.gradient-border-stop-hover:hover {
  animation-play-state: paused;
}

@media (prefers-reduced-motion: reduce) {
  .gradient-border-auto,
  .gradient-border-hover:hover,
  .gradient-border-stop-hover {
    animation: none;
  }
}
```

- [ ] **Step 5: Run the primitive test and verify GREEN**

Run:

```bash
node --test --test-name-pattern="BorderRotate exposes" scripts/hero-border-contract.test.mjs
```

Expected: one passing test, zero failures.

- [ ] **Step 6: Run focused lint**

Run:

```bash
npx eslint components/ui/border-rotate.tsx
```

Expected: exit code 0 with no lint errors.

- [ ] **Step 7: Commit the primitive**

```bash
git add components/ui/border-rotate.tsx app/globals.css scripts/hero-border-contract.test.mjs
git commit -m "feat: add rotating border primitive"
```

### Task 2: Wrap only the glass hero panel

**Files:**
- Modify: `components/home/HeroSplit.tsx`
- Modify: `scripts/hero-border-contract.test.mjs`

**Interfaces:**
- Consumes: `BorderRotate` from `@/components/ui/border-rotate`.
- Preserves: `HeroSplit({ heroContent, siteConfig })`, `home-scroll-cue`, and all existing interaction handlers.
- Produces: a hero DOM hierarchy where `Glassmorphism` is inside `BorderRotate` and `ScrollCue` follows the closing `BorderRotate` tag.

- [ ] **Step 1: Add a failing hero-nesting contract test**

Append this test to `scripts/hero-border-contract.test.mjs`:

```js
test("HeroSplit wraps the glass panel but excludes the scroll cue", async () => {
  const hero = await readSource("components/home/HeroSplit.tsx");
  const borderStart = hero.indexOf("<BorderRotate");
  const glassStart = hero.indexOf("<Glassmorphism", borderStart);
  const borderEnd = hero.indexOf("</BorderRotate>", glassStart);
  const scrollCue = hero.indexOf("<ScrollCue", borderEnd);

  assert.ok(borderStart >= 0, "BorderRotate wrapper is missing");
  assert.ok(glassStart > borderStart, "Glassmorphism must be inside BorderRotate");
  assert.ok(borderEnd > glassStart, "BorderRotate must close after Glassmorphism");
  assert.ok(scrollCue > borderEnd, "ScrollCue must remain outside BorderRotate");
  assert.match(hero, /animationMode="auto-rotate"/);
  assert.match(hero, /animationSpeed=\{8\}/);
});
```

- [ ] **Step 2: Run the nesting test and verify RED**

Run:

```bash
node --test --test-name-pattern="HeroSplit wraps" scripts/hero-border-contract.test.mjs
```

Expected: FAIL with `BorderRotate wrapper is missing`.

- [ ] **Step 3: Import the primitive**

Add this import beside the existing UI imports in `components/home/HeroSplit.tsx`:

```tsx
import { BorderRotate } from "@/components/ui/border-rotate";
```

- [ ] **Step 4: Wrap only `Glassmorphism` and preserve the scroll cue sibling**

Replace the opening `Glassmorphism` block:

```tsx
<Glassmorphism
  noShadow
  className="relative w-full max-w-7xl h-[600px] md:h-[80vh] min-h-[600px] max-h-[600px] overflow-hidden md:rounded-[var(--radius-layout)]"
>
```

with:

```tsx
<BorderRotate
  animationMode="auto-rotate"
  animationSpeed={8}
  borderWidth={2}
  backgroundColor="var(--background)"
  className="relative h-[600px] min-h-[600px] max-h-[600px] w-full max-w-7xl overflow-hidden [--border-radius:0px] md:h-[80vh] md:[--border-radius:var(--radius-layout)]"
>
  <Glassmorphism
    noShadow
    className="relative h-full w-full overflow-hidden rounded-none md:rounded-[calc(var(--radius-layout)-2px)]"
  >
```

Replace the existing closing tag immediately before `ScrollCue`:

```tsx
</Glassmorphism>
<ScrollCue
```

with:

```tsx
  </Glassmorphism>
</BorderRotate>
<ScrollCue
```

Do not move or modify the `ScrollCue` props.

- [ ] **Step 5: Run the complete contract test and verify GREEN**

Run:

```bash
node --test scripts/hero-border-contract.test.mjs
```

Expected: two passing tests, zero failures.

- [ ] **Step 6: Run focused lint**

Run:

```bash
npx eslint components/home/HeroSplit.tsx components/ui/border-rotate.tsx
```

Expected: exit code 0 with no lint errors.

- [ ] **Step 7: Commit the hero integration**

```bash
git add components/home/HeroSplit.tsx scripts/hero-border-contract.test.mjs
git commit -m "feat: frame home hero with rotating border"
```

### Task 3: Verify production and browser behavior

**Files:**
- Verify only; no planned source edits.

**Interfaces:**
- Consumes: the completed rotating-border primitive and hero integration.
- Produces: evidence that static checks, the production build, desktop layout, mobile layout, interaction, and reduced-motion behavior are correct.

- [ ] **Step 1: Run all available static verification**

Run:

```bash
npm run lint
```

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: exit code 0; Next.js completes compilation, type checking, and route generation.

- [ ] **Step 3: Start the development server**

Run:

```bash
npm run dev
```

Expected: Next.js reports a local URL and remains running for browser verification.

- [ ] **Step 4: Verify the desktop hero in a real browser**

At a desktop viewport near 1440 by 900, open the home page and verify:

- The animated gold border surrounds only the glass panel.
- The portraits, title, split line, and mode buttons remain visible.
- Professional, reset, and tech controls still transition correctly.
- The scroll cue sits below and outside the border and still scrolls to work experience.
- The page has no horizontal scrollbar and the browser console has no new errors.

- [ ] **Step 5: Verify mobile and reduced motion**

At a viewport near 390 by 844, verify the hero remains within the viewport width, uses square mobile corners, and does not clip controls or the scroll cue. Emulate `prefers-reduced-motion: reduce` and verify the gradient border remains visible but does not rotate.

- [ ] **Step 6: Report verification and preserve unrelated changes**

Run:

```bash
git status --short
```

Expected: only pre-existing unrelated user changes remain; all feature files are committed. Report the exact verification commands and any environmental limitation without altering unrelated files.
