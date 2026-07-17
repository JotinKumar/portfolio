const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");

const globals = read("app/globals.css");
const publicLayout = read("app/(public)/layout.tsx");
const publicScope = read("components/layout/public-design-scope.tsx");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const input = read("components/ui/input.tsx");
const textarea = read("components/ui/textarea.tsx");
const navigation = read("components/ui/navigation-menu.tsx");
const glassmorphism = read("components/ui/glassmorphism.tsx");

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
  "--overlay-surface: oklch(0.16 0.01 45 / 0.84)",
  "--decorative-1: oklch(0.62 0.1 46)",
  "--decorative-2: oklch(0.68 0.06 72)",
  "--decorative-3: oklch(0.48 0.05 38)",
]) {
  assert.ok(globals.includes(token), `Missing global visual-system token: ${token}`);
}

assert.match(globals, /\.type-body\s*{[\s\S]*?font-size:\s*0\.97rem;/);
assert.match(globals, /\.type-meta,[\s\S]*?font-size:\s*0\.72rem;/);
assert.match(
  globals,
  /\.public-design-scope \.type-body\s*{[\s\S]*?font-size:\s*1rem;/,
);
assert.match(
  globals,
  /\.public-design-scope \.type-meta,[\s\S]*?font-size:\s*0\.75rem;/,
);
assert.match(
  globals,
  /\.dark\s*{[\s\S]*?--primary-foreground:\s*oklch\(1\.0000 0 0\);/,
);
assert.match(
  globals,
  /\.dark\.public-design-scope\s*{[\s\S]*?--primary-foreground:\s*oklch\(0\.222 0\.008 48\);/,
);
assert.equal(
  (globals.match(/--control-border:\s*var\(--border\);/g) || []).length,
  2,
  "Root and dark themes must retain the legacy control border outside public pages",
);
assert.match(
  globals,
  /\.public-design-scope\s*{[\s\S]*?--control-border:\s*oklch\(0\.65 0\.025 60\);/,
);
assert.match(
  globals,
  /\.dark\.public-design-scope\s*{[\s\S]*?--control-border:\s*oklch\(0\.52 0\.02 50\);/,
);
assert.ok(
  !globals.includes("border-color: var(--control-border)"),
  "Scoped tokens must not override interactive border states with direct CSS",
);

assert.ok(publicScope.includes('"use client"'));
assert.ok(publicScope.includes("usePathname"));
assert.ok(publicScope.includes("useLayoutEffect"));
assert.ok(publicScope.includes("document.documentElement"));
assert.ok(publicScope.includes('pathname !== "/profile"'));
assert.ok(
  publicScope.includes('classList.toggle("public-design-scope", enabled)'),
  "Route changes must toggle the HTML scope deterministically",
);
assert.ok(
  publicScope.includes('classList.remove("public-design-scope")'),
  "The HTML scope must be removed when the route scope unmounts",
);
assert.ok(
  publicScope.includes("}, [pathname])"),
  "The HTML scope effect must update on every route change",
);
assert.ok(publicScope.includes("return <>{children}</>"));
assert.ok(!publicScope.includes('className="public-design-scope'));
assert.ok(publicLayout.includes("<PublicDesignScope>"));
assert.ok(publicLayout.includes("</PublicDesignScope>"));
assert.ok(
  publicLayout.indexOf("<PublicDesignScope>") < publicLayout.indexOf("<Background>"),
  "Public design scope must wrap the complete public shell",
);

for (const [name, source] of Object.entries({ button, badge, input, textarea })) {
  assert.ok(source.includes("rounded-none"), `${name} must use square controls`);
  assert.ok(!source.includes("rounded-full"), `${name} must not use pill controls`);
}
for (const [name, source] of Object.entries({ button, badge, input, textarea })) {
  assert.ok(
    source.includes("border-control-border"),
    `${name} must consume the scoped semantic border token`,
  );
}

assert.equal(
  (navigation.match(/rounded-none/g) || []).length,
  2,
  "Navigation trigger and link must both be square",
);
assert.ok(!navigation.includes("rounded-md"), "Navigation controls must not be rounded");

for (const className of [
  "rounded-[var(--radius-layout)]",
  "border-border/70",
  "bg-card/80",
  "dark:bg-card/85",
  "shadow-lg",
]) {
  assert.ok(
    glassmorphism.includes(className),
    `Glassmorphism must use the semantic class: ${className}`,
  );
}
assert.ok(
  !glassmorphism.includes("[background:rgba"),
  "Glassmorphism must not override its semantic surface with raw RGBA",
);
assert.ok(
  !glassmorphism.includes("[border-color:rgba"),
  "Glassmorphism must not override its semantic border with raw RGBA",
);
assert.ok(
  !glassmorphism.includes("rgba(0,0,255"),
  "Glassmorphism must not use a hard-coded blue dark shadow",
);

console.log("Public design-system self-test passed.");
