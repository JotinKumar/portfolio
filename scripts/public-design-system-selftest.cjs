const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const globals = read("app/globals.css");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const input = read("components/ui/input.tsx");
const textarea = read("components/ui/textarea.tsx");
const navigation = read("components/ui/navigation-menu.tsx");

for (const token of [
  "--color-control-border: var(--control-border)",
  "--color-overlay-surface: var(--overlay-surface)",
  "--color-overlay-foreground: var(--overlay-foreground)",
  "--control-border: oklch(0.65 0.025 60)",
  "--overlay-surface: oklch(0.2 0.012 45 / 0.78)",
  "--overlay-foreground: oklch(0.965 0.004 92)",
  "--decorative-1: oklch(0.68 0.13 46)",
  "--decorative-2: oklch(0.78 0.08 72)",
  "--decorative-3: oklch(0.58 0.06 38)",
  "--radius-layout: 2.5rem",
  "--radius-card: 1.25rem",
  "--radius-control: 0rem",
  "--font-mono: var(--font-body)",
  "--control-border: oklch(0.52 0.02 50)",
  "--primary-foreground: oklch(0.222 0.008 48)",
  "--overlay-surface: oklch(0.16 0.01 45 / 0.84)",
  "--decorative-1: oklch(0.62 0.1 46)",
  "--decorative-2: oklch(0.68 0.06 72)",
  "--decorative-3: oklch(0.48 0.05 38)",
]) {
  assert.ok(globals.includes(token), `Missing global visual-system token: ${token}`);
}

assert.match(globals, /\.type-body\s*{[\s\S]*?font-size:\s*1rem;/);
assert.match(globals, /\.type-meta,[\s\S]*?font-size:\s*0\.75rem;/);

for (const [name, source] of Object.entries({ button, badge, input, textarea })) {
  assert.ok(source.includes("rounded-none"), `${name} must use square controls`);
  assert.ok(!source.includes("rounded-full"), `${name} must not use pill controls`);
  assert.ok(
    source.includes("border-control-border"),
    `${name} must use the semantic control border`,
  );
}

assert.equal(
  (navigation.match(/rounded-none/g) || []).length,
  2,
  "Navigation trigger and link must both be square",
);
assert.ok(!navigation.includes("rounded-md"), "Navigation controls must not be rounded");

console.log("Public design-system self-test passed.");
