const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const toPosix = (value) => value.split(path.sep).join("/");
const listSourceFiles = (relativeDirectory) => {
  const absoluteDirectory = path.join(root, relativeDirectory);
  return fs.readdirSync(absoluteDirectory, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) return listSourceFiles(relativePath);
    return /\.(?:ts|tsx)$/.test(entry.name) ? [toPosix(relativePath)] : [];
  });
};

const globals = read("app/globals.css");
const publicLayout = read("app/(public)/layout.tsx");
const publicScope = read("components/layout/public-design-scope.tsx");
const button = read("components/ui/button.tsx");
const badge = read("components/ui/badge.tsx");
const input = read("components/ui/input.tsx");
const textarea = read("components/ui/textarea.tsx");
const navigation = read("components/ui/navigation-menu.tsx");
const glassmorphism = read("components/ui/glassmorphism.tsx");
const heroSplit = read("components/home/HeroSplit.tsx");
const professionalHero = read("components/home/ProfessionalHero.tsx");
const techHero = read("components/home/TechHero.tsx");
const workTimeline = read("components/home/work-timeline.tsx");
const floatingBlobsBar = read("components/ui/floating-blobs-bar.tsx");
const scrollCue = read("components/ui/scroll-cue.tsx");
const blogsEditorialHero = read("components/blogs/blogs-editorial-hero.tsx");
const featuredBlogLeadCard = read("components/blogs/featured-blog-lead-card.tsx");
const blogsTaxonomyRail = read("components/blogs/blogs-taxonomy-rail.tsx");
const archiveCard = read("components/ui/archive-card.tsx");
const articleCard = read("components/ui/article-card.tsx");
const blogLeadCard = read("components/ui/blog-lead-card.tsx");
const projectCard = read("components/ui/project-card.tsx");
const footer = read("components/layout/footer.tsx");
const blogsPage = read("app/(public)/blogs/page.tsx");

for (const token of [
  "--color-control-border: var(--control-border)",
  "--color-badge-border: var(--badge-border)",
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
  /\.dark \.public-design-scope,\s*\.dark\.public-design-scope\s*{[\s\S]*?--primary-foreground:\s*oklch\(0\.222 0\.008 48\);/,
);
assert.equal(
  (globals.match(/--control-border:\s*var\(--border\);/g) || []).length,
  2,
  "Root and dark themes must retain the legacy control border outside public pages",
);
assert.equal(
  (globals.match(/--badge-border:\s*color-mix\(in oklab, var\(--border\) 80%, transparent\);/g) || [])
    .length,
  2,
  "Root and dark themes must preserve the legacy 80% badge border",
);
assert.match(
  globals,
  /\.public-design-scope\s*{[\s\S]*?--control-border:\s*oklch\(0\.65 0\.025 60\);[\s\S]*?--badge-border:\s*oklch\(0\.65 0\.025 60\);/,
);
assert.match(
  globals,
  /\.dark \.public-design-scope,\s*\.dark\.public-design-scope\s*{[\s\S]*?--control-border:\s*oklch\(0\.52 0\.02 50\);[\s\S]*?--badge-border:\s*oklch\(0\.52 0\.02 50\);/,
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
assert.ok(
  publicScope.includes('pathname === "/profile" ? "contents" : "public-design-scope contents"'),
  "The stable SSR wrapper must exclude Profile without changing element type",
);
assert.ok(publicScope.includes("return <div className={className}>{children}</div>"));
assert.ok(!publicScope.includes("return <>{children}</>"));
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
for (const [name, source] of Object.entries({ button, input, textarea })) {
  assert.ok(
    source.includes("border-control-border"),
    `${name} must consume the scoped semantic border token`,
  );
}
assert.ok(
  badge.includes("border-badge-border"),
  "Badge must consume its semantic border while preserving the legacy Profile alpha",
);

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

assert.ok(
  heroSplit.includes("rounded-[var(--radius-layout)]"),
  "The Home hero layout must use the semantic layout radius",
);
assert.ok(!heroSplit.includes("rounded-full"), "Home hero controls must be square");
assert.ok(!heroSplit.includes("rounded-2xl"), "Home hero internal overlays must be square");
assert.ok(!heroSplit.includes("border-white"), "Home hero borders must use semantic colors");
assert.ok(!heroSplit.includes("rgba("), "Home hero decoration must not use raw RGBA colors");

for (const [name, source] of Object.entries({ professionalHero, techHero })) {
  assert.ok(
    source.includes('className="type-meta border-foreground/18'),
    `${name} skill badges must use the shared meta typography`,
  );
  assert.ok(!source.includes("text-[8px]"), `${name} skill labels must not be tiny`);
  assert.ok(!source.includes("text-[9px]"), `${name} skill labels must not be tiny`);
  assert.ok(!source.includes("rounded-full"), `${name} internal controls must be square`);
}

assert.ok(!workTimeline.includes("font-mono"), "Timeline years must not use monospace typography");
assert.ok(
  workTimeline.includes("font-sans tabular-nums"),
  "Timeline years must use Outfit-compatible sans typography with tabular numbers",
);
assert.ok(!workTimeline.includes("rounded-full"), "Timeline bullets and markers must be square");

assert.ok(
  floatingBlobsBar.includes("getComputedStyle(document.documentElement)"),
  "Floating blob colors must resolve from the active CSS theme",
);
for (const token of ["--decorative-1", "--decorative-2", "--decorative-3"]) {
  assert.ok(floatingBlobsBar.includes(token), `Floating blobs must consume ${token}`);
}
assert.doesNotMatch(
  floatingBlobsBar,
  /#[\da-f]{3,8}/i,
  "Floating blobs must not carry a hard-coded multicolor palette",
);
assert.ok(!floatingBlobsBar.includes("ctx.arc("), "Floating decorations must not render circular blobs");
assert.ok(floatingBlobsBar.includes("ctx.fillRect("), "Floating decorations must render square geometry");
assert.match(
  floatingBlobsBar,
  /const themeObserver = new MutationObserver\(\(\) => \{[\s\S]*?blobsRef\.current = createBlobs\([\s\S]*?if \(prefersReducedMotionRef\.current\) \{[\s\S]*?draw\(ctx, dimensionsRef\.current\.width, height\);/,
  "Theme changes must repaint the static canvas when reduced motion disables animation frames",
);

assert.ok(scrollCue.includes("rounded-none"), "The scroll cue wrapper must be square");
assert.ok(!scrollCue.includes("rounded-full"), "The scroll cue wrapper must not be circular");
assert.doesNotMatch(scrollCue, /#[\da-f]{3,8}/i, "The scroll cue must not use hard-coded colors");
assert.ok(
  scrollCue.includes('d="M18 6 H54 V66 H18 Z"'),
  "The scroll cue must use a rectangular outline rather than a curved mouse capsule",
);
assert.ok(!scrollCue.includes(" C"), "The scroll cue must not contain curved path geometry");
assert.ok(!scrollCue.includes('strokeLinecap="round"'), "The scroll cue must not use round line caps");
assert.ok(!scrollCue.includes('strokeLinejoin="round"'), "The scroll cue must not use round joins");
assert.ok(
  (scrollCue.match(/(?:stroke|fill)="currentColor"/g) || []).length >= 5,
  "The scroll cue border and icon must inherit a semantic current color",
);

for (const [name, source] of Object.entries({
  blogsEditorialHero,
  blogsTaxonomyRail,
  archiveCard,
  articleCard,
  blogLeadCard,
})) {
  assert.ok(!source.includes("rounded-full"), `${name} internal controls must be square`);
  assert.ok(!source.includes("font-black"), `${name} must not use extreme black font weights`);
}
assert.ok(
  blogsEditorialHero.includes("flex-col items-center") &&
    blogsEditorialHero.includes("sm:flex-row") &&
    blogsEditorialHero.includes("gap-y-1"),
  "The three-word blog masthead must stack with a compact gap on mobile",
);
assert.ok(
  blogsEditorialHero.includes("focus-within:border-ring") &&
    blogsEditorialHero.includes("focus-within:ring-2"),
  "The square blog search wrapper must expose a visible focus-within treatment",
);
assert.equal(
  (blogsEditorialHero.match(/aria-label="Search articles"/g) || []).length,
  2,
  "The blog search input and icon submit must both have programmatic labels",
);

assert.ok(
  blogsEditorialHero.includes("items-center rounded-none border border-control-border"),
  "The named editorial search control must be explicitly square",
);
assert.ok(
  blogsEditorialHero.includes('className="h-9 w-9 rounded-none"'),
  "The named editorial submit action must be explicitly square",
);
assert.equal(
  (blogsTaxonomyRail.match(/type-meta rounded-none/g) || []).length,
  2,
  "Both taxonomy tag groups must use explicit square geometry",
);
assert.equal(
  (featuredBlogLeadCard.match(/type-meta rounded-none/g) || []).length,
  2,
  "Both featured blog metadata tags must use explicit square geometry",
);
assert.ok(
  featuredBlogLeadCard.includes("items-center justify-center rounded-none bg-primary"),
  "The featured blog arrow action must be explicitly square",
);
assert.equal(
  (archiveCard.match(/type-meta inline-block rounded-none/g) || []).length,
  2,
  "Both archive metadata tags must use explicit square geometry",
);
assert.ok(
  archiveCard.includes("type-nav inline-flex items-center gap-1 rounded-none"),
  "The archive read action must be explicitly square",
);
assert.ok(
  articleCard.includes("type-meta mb-4 w-fit rounded-none"),
  "The featured article category tag must be explicitly square",
);
assert.ok(
  articleCard.includes("type-meta rounded-none border-white/25"),
  "The standard article category tag must be explicitly square",
);
assert.ok(
  articleCard.includes("items-center justify-center rounded-none bg-primary"),
  "The article arrow action must be explicitly square",
);
assert.ok(
  blogLeadCard.includes("type-nav pointer-events-auto inline-block rounded-none"),
  "The blog lead read action must be explicitly square",
);
assert.equal(
  (featuredBlogLeadCard.match(/rounded-full/g) || []).length,
  1,
  "Featured blog card may round only its author avatar; tags and actions must be square",
);
assert.ok(
  !featuredBlogLeadCard.includes("font-black"),
  "Featured blog metadata must not use an extreme black font weight",
);
assert.ok(
  !featuredBlogLeadCard.includes('items-start font-serif leading-none'),
  "Featured blog date metadata must use the shared Outfit role",
);
assert.ok(
  featuredBlogLeadCard.includes('text-[4.8rem] font-semibold'),
  "Featured blog date numerals must use a loaded Outfit weight no heavier than 600",
);
assert.ok(
  featuredBlogLeadCard.includes('className="type-meta text-foreground/40"'),
  "Featured blog avatar fallback must use the shared Outfit metadata role",
);

assert.ok(
  blogsEditorialHero.includes('className="type-display'),
  "The blog editorial title must use the shared Playfair display role",
);
assert.ok(
  !blogsEditorialHero.includes("[-webkit-text-stroke"),
  "The blog title treatment must use semantic foreground colors",
);
assert.ok(
  featuredBlogLeadCard.includes('className="type-section-title'),
  "The featured blog title must use the shared Playfair heading role",
);
assert.ok(
  blogsTaxonomyRail.includes('className="type-meta'),
  "Taxonomy UI labels must use the shared Outfit metadata role",
);
assert.ok(
  archiveCard.includes('className="type-card-title'),
  "Archive titles must use the shared Playfair card-title role",
);
assert.ok(
  articleCard.includes('className="type-section-title'),
  "Featured article titles must use the shared Playfair heading role",
);
assert.ok(
  blogLeadCard.includes('className="type-body'),
  "Blog lead copy must use the shared Outfit body role",
);

assert.doesNotMatch(
  archiveCard,
  /#[\da-f]{3,8}/i,
  "Archive cards must not use a hard-coded multicolor palette",
);
assert.ok(!archiveCard.includes("CARD_ACCENTS"), "Archive cards must use semantic theme colors");
assert.ok(
  !featuredBlogLeadCard.includes("dark:bg-[color:"),
  "Featured blog surfaces must use semantic light/dark colors",
);
assert.ok(!blogLeadCard.includes("#BDA26B"), "Blog lead accents must not use hard-coded gold");
assert.ok(!blogLeadCard.includes("#8e7c49"), "Blog lead actions must not use hard-coded gold");
assert.ok(!blogLeadCard.includes("#ddd"), "Blog lead metadata must use semantic colors");
assert.ok(!blogLeadCard.includes("#444"), "Blog lead actions must use semantic colors");
assert.ok(
  blogLeadCard.includes("rounded-[var(--radius-layout)]"),
  "The blog lead outer card must use the rounded semantic layout geometry",
);

assert.ok(
  articleCard.includes("rounded-none bg-background"),
  "The square article cutout must match the active page background",
);
assert.equal(
  (articleCard.match(/shadow-\[10px_10px_0_10px_var\(--background\)\]/g) || []).length,
  2,
  "The article cutout must derive both square continuation shadows from --background",
);

assert.doesNotMatch(
  articleCard,
  /group-hover:text-\[[^\]]+\]/,
  "Article titles and metadata must not shrink on hover",
);
assert.ok(
  !articleCard.includes("transition-[font-size,line-height,letter-spacing]"),
  "Article title hover transitions must not animate font size",
);
assert.ok(
  articleCard.includes("group-hover:shadow-xl"),
  "Article card hover elevation must use a shared semantic shadow utility",
);
assert.ok(
  !articleCard.includes("group-hover:shadow-[0_28px_60px_rgba"),
  "Article card hover elevation must not use a raw RGBA shadow",
);

// Final named public-surface audit. Profile, Admin, and image/avatar presentation
// are intentionally outside this audit; these assertions cover visible UI roles.
for (const className of [
  "border-overlay-foreground/20 bg-overlay-surface text-overlay-foreground",
  "bg-overlay-foreground text-background",
  "border-overlay-foreground/30 bg-overlay-surface text-overlay-foreground",
]) {
  assert.ok(
    projectCard.includes(className),
    `Featured project overlay must use semantic UI colors: ${className}`,
  );
}
assert.ok(
  !projectCard.includes("bg-white text-black"),
  "Featured project actions must not use fixed black/white UI colors",
);
assert.ok(!projectCard.includes("rounded-full"), "Project controls and tags must remain square");

assert.ok(
  footer.includes('className="font-serif text-xl font-medium"'),
  "Footer brand text must use the shared Playfair heading role",
);
assert.ok(
  footer.includes('className="type-body text-muted-foreground"'),
  "Footer descriptive copy must use the shared Outfit body role",
);
assert.ok(
  footer.includes('className="type-nav text-muted-foreground'),
  "Footer navigation must use the shared Outfit UI role",
);
assert.ok(
  footer.includes('className="type-meta flex items-center'),
  "Footer utility rows must use the shared Outfit metadata role",
);
assert.ok(!footer.includes("text-red-500"), "Footer accents must use semantic theme colors");

assert.ok(
  blogsPage.includes('<p className="type-meta text-muted-foreground">Journal</p>'),
  "The Blogs Journal kicker must use the shared 0.75rem Outfit metadata role",
);
assert.ok(!blogsPage.includes("text-[0.65rem]"), "Blogs UI text must not fall below 0.75rem");

for (const undersized of ["text-[0.66rem]", "text-[0.68rem]", "text-[0.7rem]", "text-[0.72rem]", "text-[0.74rem]"]) {
  assert.ok(
    !workTimeline.includes(undersized),
    `Public timeline labels must not fall below 0.75rem: ${undersized}`,
  );
}

assert.equal(
  (featuredBlogLeadCard.match(/rounded-full/g) || []).length,
  1,
  "The explicitly excluded featured author avatar must retain its image radius",
);
const blogDetailShell = read("components/blogs/blog-detail-shell.tsx");
assert.equal(
  (blogDetailShell.match(/rounded-full/g) || []).length,
  1,
  "The explicitly excluded article author avatar must retain its image radius",
);

const publicSourceFiles = [
  ...listSourceFiles("app/(public)"),
  ...listSourceFiles("components"),
].filter(
  (relativePath) =>
    !relativePath.startsWith("app/(public)/profile/") &&
    !relativePath.startsWith("components/profile/") &&
    !relativePath.startsWith("components/admin/"),
);

const allowedRoundedContexts = new Map([
  ["components/blogs/featured-blog-lead-card.tsx", /radius-(?:layout|card)|rounded-full/],
  ["components/blogs/blogs-editorial-hero.tsx", /radius-layout/],
  ["components/blogs/blog-detail-shell.tsx", /rounded-full/],
  ["components/home/HeroSplitSkeleton.tsx", /rounded-\[2\.5rem\]/],
  ["components/home/HeroSplit.tsx", /radius-layout/],
  ["components/home/ProfessionalHero.tsx", /rounded-\[2\.5rem\]/],
  ["components/home/TechHero.tsx", /rounded-\[2\.5rem\]/],
  ["components/layout/header.tsx", /rounded-sm/],
  ["components/ui/article-card.tsx", /rounded-(?:xl|\[1\.35rem\])/],
  ["components/ui/archive-card.tsx", /radius-card/],
  ["components/ui/blog-lead-card.tsx", /radius-layout/],
  ["components/ui/card.tsx", /rounded-xl/],
  ["components/ui/glassmorphism.tsx", /radius-layout/],
  ["components/ui/project-card.tsx", /rounded-t-lg/],
]);

const rawPaletteContextFiles = new Set([
  "components/ui/article-card.tsx",
  "components/ui/blog-lead-card.tsx",
  "components/home/featured-projects.tsx",
]);

const isAllowedRawPaletteContext = (relativePath, line) =>
  rawPaletteContextFiles.has(relativePath) ||
  (relativePath === "components/blogs/featured-blog-lead-card.tsx" &&
    (line.includes("aspect-square overflow-hidden") || line.includes("bg-gradient-to-b"))) ||
  (["components/home/ProfessionalHero.tsx", "components/home/TechHero.tsx"].includes(relativePath) &&
    line.includes("absolute inset-0 bg-gradient-to-t")) ||
  (relativePath === "components/ui/project-card.tsx" && line.includes("bg-gradient-to-r from-black")) ||
  (["components/ui/badge.tsx", "components/ui/button.tsx"].includes(relativePath) &&
    line.includes("bg-destructive text-white")) ||
  (relativePath === "components/ui/sheet.tsx" && line.includes("fixed inset-0 z-50 bg-black/50"));

const publicAuditViolations = [];
const reportViolation = (relativePath, lineNumber, rule, sourceLine) => {
  publicAuditViolations.push(
    `${relativePath}:${lineNumber} [${rule}] ${sourceLine.trim()}`,
  );
};

for (const relativePath of publicSourceFiles) {
  const lines = read(relativePath).split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    for (const match of line.matchAll(/\btext-\[(\d*\.?\d+)(rem|px)\]/g)) {
      const value = Number(match[1]);
      const isUndersized = match[2] === "rem" ? value < 0.75 : value < 12;
      if (isUndersized) reportViolation(relativePath, lineNumber, "text-size", line);
    }

    if (/\bfont-(?:bold|extrabold|black)\b/.test(line)) {
      const isAvatarFallback =
        relativePath === "components/blogs/blog-detail-shell.tsx" &&
        line.includes('className="text-sm font-bold uppercase"');
      if (!isAvatarFallback) reportViolation(relativePath, lineNumber, "font-weight", line);
    }

    const roundedMatches = line.match(/\brounded-(?!none\b)[^\s"'`}]+/g) || [];
    if (roundedMatches.length > 0) {
      const allowedContext = allowedRoundedContexts.get(relativePath);
      if (!allowedContext || !allowedContext.test(line)) {
        reportViolation(relativePath, lineNumber, "internal-radius", line);
      }
    }

    const hasRawPalette =
      /#[\da-f]{3,8}\b/i.test(line) ||
      /\b(?:text|bg|border|from|via|to)-(?:black|white)(?:\/\d+)?\b/.test(line) ||
      /\b(?:text|bg|border|from|via|to)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+\b/.test(line);
    if (hasRawPalette && !isAllowedRawPaletteContext(relativePath, line)) {
      reportViolation(relativePath, lineNumber, "raw-palette", line);
    }
  });
}

assert.equal(
  publicAuditViolations.length,
  0,
  `Public source audit found visible design-system violations:\n${publicAuditViolations.join("\n")}`,
);

console.log("Public design-system self-test passed.");
