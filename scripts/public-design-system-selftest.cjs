const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (relativePath) =>
  fs.readFileSync(path.join(root, relativePath), "utf8");
const readIfExists = (relativePath) => {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "";
};
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
const sheet = read("components/ui/sheet.tsx");
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
const header = read("components/layout/header.tsx");
const navigationState = readIfExists("lib/navigation-state.ts");
const headerAccountState = readIfExists("lib/header-account-state.ts");
const headerAccountControl = readIfExists("components/layout/header-account-control.tsx");
const headerAccountBranch = readIfExists("components/layout/header-account-branch.tsx");
const dialog = readIfExists("components/ui/dialog.tsx");
const authPanel = readIfExists("components/auth/auth-panel.tsx");
const authPage = read("app/(public)/auth/page.tsx");

// Header/auth/hero behavior specification. Keep these checks together so the
// intentional RED commit reports every missing behavior in one test run.
const requestedBehaviorFailures = [];
const requireBehavior = (condition, name) => {
  if (!condition) requestedBehaviorFailures.push(name);
};
const runTypeScriptCheck = (script) => {
  const tsNodeRegister = require.resolve("ts-node/register", { paths: [root] });
  execFileSync(process.execPath, ["-r", tsNodeRegister, "-e", script], {
    cwd: root,
    env: {
      ...process.env,
      TS_NODE_COMPILER_OPTIONS: JSON.stringify({
        jsx: "react-jsx",
        module: "commonjs",
        moduleResolution: "node",
      }),
    },
    stdio: "pipe",
  });
};
const extractMarkedJsxRegion = (source, attribute, value) => {
  const marker = `${attribute}="${value}"`;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";
  const openingStart = source.lastIndexOf("<", markerIndex);
  const openingEnd = source.indexOf(">", markerIndex);
  if (openingStart < 0 || openingEnd < 0) return "";
  const opening = source.slice(openingStart, openingEnd + 1);
  const tag = opening.match(/^<([A-Za-z][\w.]*)\b/)?.[1];
  if (!tag || /\/\s*>$/.test(opening)) return opening;

  const tagPattern = new RegExp(`<(/?)${tag.replace(".", "\\.")}\\b[^>]*(/?)>`, "g");
  tagPattern.lastIndex = openingStart;
  let depth = 0;
  for (const match of source.matchAll(tagPattern)) {
    if (match.index < openingStart) continue;
    const isClosing = match[1] === "/";
    const isSelfClosing = match[2] === "/";
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) return source.slice(openingStart, match.index + match[0].length);
  }
  return "";
};
const extractNamedJsxRegion = (source, tag) => {
  const openingStart = source.indexOf(`<${tag}`);
  if (openingStart < 0) return "";
  let openingEnd = -1;
  let braceDepth = 0;
  let quote = "";
  for (let index = openingStart; index < source.length; index += 1) {
    const character = source[index];
    const previous = source[index - 1];
    if (quote) {
      if (character === quote && previous !== "\\") quote = "";
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") braceDepth += 1;
    else if (character === "}") braceDepth -= 1;
    else if (character === ">" && braceDepth === 0) {
      openingEnd = index;
      break;
    }
  }
  if (openingEnd < 0) return "";
  const opening = source.slice(openingStart, openingEnd + 1);
  if (/\/\s*>$/.test(opening)) return opening;

  const tagPattern = new RegExp(`<(/?)${tag.replace(".", "\\.")}\\b[^>]*(/?)>`, "g");
  tagPattern.lastIndex = openingStart;
  let depth = 0;
  for (const match of source.matchAll(tagPattern)) {
    if (match.index < openingStart) continue;
    const isClosing = match[1] === "/";
    const isSelfClosing = match[2] === "/";
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) return source.slice(openingStart, match.index + match[0].length);
  }
  return "";
};
const extractJsxPropExpression = (source, prop) => {
  const propStart = source.indexOf(`${prop}={`);
  if (propStart < 0) return "";
  const expressionStart = source.indexOf("{", propStart);
  let depth = 0;
  for (let index = expressionStart; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    else if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(expressionStart + 1, index);
  }
  return "";
};

const blobDrawLoop =
  floatingBlobsBar.match(/blobsRef\.current\.forEach\(\(blob\) => \{[\s\S]*?\n\s*\}\);/)?.[0] ?? "";
requireBehavior(
  /ctx\.beginPath\(\)[\s\S]*?ctx\.arc\([\s\S]*?ctx\.fill\(\)/.test(blobDrawLoop),
  "circular blob draw loop uses beginPath, arc, and fill",
);
requireBehavior(
  !blobDrawLoop.includes("ctx.fillRect("),
  "circular blob draw loop does not use fillRect",
);
requireBehavior(
  /const radius = blob\.size \/ 2;[\s\S]*?blob\.x <= radius[\s\S]*?width - radius[\s\S]*?blob\.y <= radius[\s\S]*?height - radius/.test(blobDrawLoop),
  "circular blob radius controls both horizontal and vertical bounce boundaries",
);
requireBehavior(
  /const size = Math\.min\([\s\S]*?const radius = size \/ 2;[\s\S]*?x: getRandom\(radius, width - radius\)[\s\S]*?y: getRandom\(radius, height - radius\)[\s\S]*?size,/.test(floatingBlobsBar),
  "blob centers initialize within radius-aware canvas boundaries",
);

const decorativeDeclarations = [...globals.matchAll(
  /--decorative-[123]:\s*oklch\([^\s]+\s+([\d.]+)\s+[\d.]+\)/g,
)].map((match) => Number(match[1]));
requireBehavior(
  decorativeDeclarations.length === 6 &&
    decorativeDeclarations.slice(0, 3).every((chroma) => chroma >= 0.14),
  "light decorative tokens use clearly vibrant OKLCH chroma",
);
requireBehavior(
  decorativeDeclarations.length === 6 &&
    decorativeDeclarations.slice(3).every((chroma) => chroma >= 0.12),
  "dark decorative tokens use clearly vibrant OKLCH chroma",
);

requireBehavior(
  /export function isNavigationItemActive|export const isNavigationItemActive/.test(navigationState),
  "centralized isNavigationItemActive helper is exported",
);
let navigationHelperExecutionError = "helper file is missing";
if (navigationState) {
  try {
    const helperPath = path.join(root, "lib/navigation-state.ts");
    const routeTableScript = `
      const { isNavigationItemActive } = require(${JSON.stringify(helperPath)});
      const cases = [
        ["/", "/", true],
        ["/", "/blogs", false],
        ["/blogs", "/", false],
        ["/blogs/post", "/blogs", true],
        ["/blogroll", "/blogs", false],
        ["/projects", "/projects", true],
        ["/projects", "/blogs", false],
        ["/blogs", "https://example.com", false],
        ["/blogs", "#contact", false],
      ];
      for (const [pathname, href, expected] of cases) {
        const actual = isNavigationItemActive(pathname, href);
        if (actual !== expected) {
          throw new Error(pathname + " vs " + href + ": expected " + expected + ", received " + actual);
        }
      }
    `;
    runTypeScriptCheck(routeTableScript);
    navigationHelperExecutionError = "";
  } catch (error) {
    navigationHelperExecutionError = error instanceof Error ? error.message : String(error);
  }
}
requireBehavior(
  navigationHelperExecutionError === "",
  `navigation helper passes executable route table (${navigationHelperExecutionError})`,
);

const navigationSurface = (surface) => {
  const marker = `data-navigation-surface="${surface}"`;
  const markerIndex = header.indexOf(marker);
  if (markerIndex < 0) return { activeState: "", source: "" };
  const mappingIndex = header.lastIndexOf("items.map", markerIndex);
  const end = header.indexOf("</Link>", markerIndex);
  const source = header.slice(Math.max(0, mappingIndex), end < 0 ? markerIndex : end + 7);
  const assignments = [...source.matchAll(
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*isNavigationItemActive\([^)]*\)/g,
  )];
  const assignedState = assignments.at(-1)?.[1] ?? "";
  return {
    activeState: assignedState || "isNavigationItemActive\\([^)]*\\)",
    source,
  };
};
for (const surface of ["desktop", "mobile"]) {
  const { activeState, source } = navigationSurface(surface);
  const escapedState = activeState.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const statePattern = activeState.startsWith("isNavigationItemActive\\")
    ? activeState
    : escapedState;
  requireBehavior(
    source.includes("isNavigationItemActive(") &&
      new RegExp(`aria-current=\\{\\s*${statePattern}\\s*\\?\\s*["']page["']`).test(source) &&
      new RegExp(`${statePattern}\\s*(?:&&|\\?)`).test(source) &&
      source.includes("border-primary/35") &&
      source.includes("bg-primary/12"),
    `${surface} navigation binds the active-route helper, aria-current, and active shade to its own link`,
  );
}
requireBehavior(
  header.includes('from "@/lib/navigation-state"'),
  "header imports the centralized active-route helper",
);

const headerActions = extractMarkedJsxRegion(header, "data-header-actions", "true");
requireBehavior(
  headerActions.includes("Toggle theme") &&
    headerActions.includes("<HeaderAccountControl") &&
    headerActions.includes('size="icon"'),
  "semantic header-actions wrapper contains the theme and same-size account controls",
);

let headerAccountStateExecutionError = "helper file is missing";
if (headerAccountState) {
  try {
    const helperPath = path.join(root, "lib/header-account-state.ts");
    const accountStateScript = `
      const assert = require("node:assert/strict");
      const { resolveHeaderAccountView } = require(${JSON.stringify(helperPath)});
      assert.deepStrictEqual(
        resolveHeaderAccountView(null, false),
        { dialog: "login", role: null, actions: [] },
      );
      assert.deepStrictEqual(
        resolveHeaderAccountView("owner@example.com", true),
        { dialog: "account", role: "admin", actions: ["admin-dashboard", "edit-site-profile", "logout"] },
      );
      assert.deepStrictEqual(
        resolveHeaderAccountView("reader@example.com", false),
        { dialog: "account", role: "regular", actions: ["edit-profile", "logout"] },
      );
    `;
    runTypeScriptCheck(accountStateScript);
    headerAccountStateExecutionError = "";
  } catch (error) {
    headerAccountStateExecutionError = error instanceof Error ? error.message : String(error);
  }
}
requireBehavior(
  headerAccountStateExecutionError === "",
  `header account render-model selects exact logged-out/Admin/regular views (${headerAccountStateExecutionError})`,
);
let headerAccountBranchExecutionError = "branch component or view helper is missing";
if (headerAccountState && headerAccountBranch) {
  try {
    const helperPath = path.join(root, "lib/header-account-state.ts");
    const branchPath = path.join(root, "components/layout/header-account-branch.tsx");
    const branchScript = `
      const assert = require("node:assert/strict");
      const React = require("react");
      const { renderToStaticMarkup } = require("react-dom/server");
      const { resolveHeaderAccountView } = require(${JSON.stringify(helperPath)});
      const { HeaderAccountBranch } = require(${JSON.stringify(branchPath)});
      const login = React.createElement("span", { "data-sentinel": "login" }, "login");
      const account = React.createElement("span", { "data-sentinel": "account" }, "account");
      const render = (view) => renderToStaticMarkup(
        React.createElement(HeaderAccountBranch, { view, login, account }),
      );
      const loggedOut = render(resolveHeaderAccountView(null, false));
      const admin = render(resolveHeaderAccountView("owner@example.com", true));
      const regular = render(resolveHeaderAccountView("reader@example.com", false));
      assert.equal(loggedOut, '<span data-sentinel="login">login</span>');
      assert.equal(admin, '<span data-sentinel="account">account</span>');
      assert.equal(regular, '<span data-sentinel="account">account</span>');
    `;
    runTypeScriptCheck(branchScript);
    headerAccountBranchExecutionError = "";
  } catch (error) {
    headerAccountBranchExecutionError = error instanceof Error ? error.message : String(error);
  }
}
requireBehavior(
  headerAccountBranchExecutionError === "",
  `HeaderAccountBranch renders Login/Account sentinels exclusively (${headerAccountBranchExecutionError})`,
);
const viewModelAssignment = headerAccountControl.match(
  /const\s+([A-Za-z_$][\w$]*)\s*=\s*resolveHeaderAccountView\([^;]+\)/,
);
const viewModelVariable = viewModelAssignment?.[1] ?? "";
const escapedViewModel = viewModelVariable.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const currentUserViewCall = headerAccountControl.match(
  /resolveHeaderAccountView\(\s*([A-Za-z_$][\w$]*)\??\.email(?:\s*\?\?\s*null)?\s*,\s*isAdminEmail\(\s*\1\??\.email\s*\)\s*\)/,
);
requireBehavior(
  headerAccountControl.includes('from "@/lib/header-account-state"') &&
    viewModelVariable.length > 0 &&
    Boolean(currentUserViewCall),
  "header account UI derives its render model from the current user email and Admin check",
);

const loggedOutBranch = extractMarkedJsxRegion(headerAccountControl, "data-auth-state", "logged-out");
const authenticatedBranch = extractMarkedJsxRegion(
  headerAccountControl,
  "data-auth-state",
  "authenticated",
);
requireBehavior(
  loggedOutBranch.length > 0 && authenticatedBranch.length > 0,
  "header account UI exposes semantic logged-out and authenticated regions",
);
const accountBranchComposition = extractNamedJsxRegion(
  headerAccountControl,
  "HeaderAccountBranch",
);
const loginBranchProp = extractJsxPropExpression(accountBranchComposition, "login");
const accountBranchProp = extractJsxPropExpression(accountBranchComposition, "account");
requireBehavior(
  headerAccountControl.includes('from "@/components/layout/header-account-branch"') &&
    new RegExp(`view=\\{\\s*${escapedViewModel}\\s*\\}`).test(accountBranchComposition) &&
    loginBranchProp.includes('data-auth-state="logged-out"') &&
    accountBranchProp.includes('data-auth-state="authenticated"'),
  "HeaderAccountControl supplies its tested view and semantic Login/Account nodes to HeaderAccountBranch",
);

const accountTrigger = (source, state) =>
  source.match(
    new RegExp(`<Button[^>]*data-account-state="${state}"[^>]*>[\\s\\S]*?</Button>`),
  )?.[0] ?? "";
const isThemeSizedControl = (source) =>
  source.includes('size="icon"') ||
  (source.includes("h-10") && source.includes("w-10")) ||
  source.includes("size-10");
const loggedOutTrigger = accountTrigger(loggedOutBranch, "logged-out");
const authenticatedTrigger = accountTrigger(authenticatedBranch, "authenticated");
const triggerOpeningTag = (source) => source.match(/^<Button[^>]*>/)?.[0] ?? "";
const loggedOutOpeningTag = triggerOpeningTag(loggedOutTrigger);
const authenticatedOpeningTag = triggerOpeningTag(authenticatedTrigger);
requireBehavior(
  loggedOutTrigger.includes('aria-label="Login"') &&
    />[\s\S]*?\bLogin\b[\s\S]*?<\/Button>/.test(loggedOutTrigger),
  "logged-out branch renders a named Login trigger",
);
requireBehavior(
  isThemeSizedControl(loggedOutOpeningTag) && loggedOutOpeningTag.includes("rounded-none"),
  "logged-out Login trigger matches the theme switcher size",
);
requireBehavior(
  authenticatedOpeningTag.includes('size="icon"') &&
    authenticatedOpeningTag.includes("rounded-none") &&
    authenticatedOpeningTag.includes('aria-label="Open account menu"'),
  "authenticated avatar trigger is square and matches the theme switcher size",
);

const adminActions = extractMarkedJsxRegion(headerAccountControl, "data-account-role", "admin");
const regularActions = extractMarkedJsxRegion(headerAccountControl, "data-account-role", "regular");
const actionComesFromViewModel = (source, action) =>
  Boolean(escapedViewModel) &&
  new RegExp(
    `${escapedViewModel}\\.actions\\.includes\\(\\s*["']${action}["']\\s*\\)`,
  ).test(source);
const roleComesFromViewModel = (source, role) =>
  Boolean(escapedViewModel) &&
  new RegExp(`${escapedViewModel}\\.role\\s*===\\s*["']${role}["']`).test(source);
requireBehavior(
  roleComesFromViewModel(adminActions, "admin") &&
    actionComesFromViewModel(adminActions, "admin-dashboard") &&
    actionComesFromViewModel(adminActions, "edit-site-profile") &&
    adminActions.includes('href="/admin/dashboard"') &&
    adminActions.includes('href="/admin/settings"') &&
    !adminActions.includes('href="/account/profile"'),
  "Admin account branch owns only Admin dashboard and site-profile actions",
);
requireBehavior(
  roleComesFromViewModel(regularActions, "regular") &&
    actionComesFromViewModel(regularActions, "edit-profile") &&
    regularActions.includes('href="/account/profile"') &&
    !regularActions.includes('href="/admin/dashboard"') &&
    !regularActions.includes('href="/admin/settings"'),
  "regular-user account branch owns only the personal profile action",
);
requireBehavior(
  authenticatedBranch.includes("Log out") &&
    actionComesFromViewModel(authenticatedBranch, "logout"),
  "authenticated account Dialog exposes logout",
);

const dialogRegion = (source, purpose) => {
  return extractMarkedJsxRegion(source, "data-dialog-purpose", purpose);
};
const loginDialog = dialogRegion(loggedOutBranch, "login");
const accountDialog = dialogRegion(authenticatedBranch, "account");
requireBehavior(
  loginDialog.includes("<DialogContent") &&
    loginDialog.includes("<DialogTitle") &&
    loginDialog.includes("<DialogDescription") &&
    loginDialog.includes("<AuthPanel") &&
    !loggedOutBranch.includes('data-dialog-purpose="account"'),
  "Login Dialog and authentication content are bounded to the logged-out branch",
);
requireBehavior(
  accountDialog.includes("<DialogContent") &&
    accountDialog.includes("<DialogTitle") &&
    accountDialog.includes("<DialogDescription") &&
    accountDialog.includes("Account") &&
    accountDialog.includes("Log out") &&
    accountDialog.includes('data-account-role="admin"') &&
    accountDialog.includes('data-account-role="regular"') &&
    !authenticatedBranch.includes('data-dialog-purpose="login"'),
  "Account Dialog, role actions, and logout are bounded to the authenticated branch",
);
requireBehavior(
  dialog.includes("@radix-ui/react-dialog") &&
    dialog.includes("DialogTitle") && dialog.includes("DialogDescription"),
  "shared Dialog primitive exposes accessible title and description",
);
requireBehavior(
  dialog.includes("rounded-[var(--radius-layout)]") &&
    dialog.includes("rounded-none") &&
    dialog.includes("DialogContent") &&
    dialog.includes("DialogClose"),
  "shared Dialog uses a rounded outer surface with a square close control",
);
requireBehavior(
  authPanel.includes("onAuthenticated") &&
    authPanel.includes("redirectTo") &&
    authPanel.includes("signInWithPassword") &&
    authPanel.includes("signUp") &&
    authPanel.includes("signInWithOAuth"),
  "AuthPanel owns reusable email, signup, and Google authentication behavior",
);
requireBehavior(
  authPage.includes("<AuthPanel") &&
    authPage.includes('redirectTo="/"') &&
    !authPage.includes("signInWithPassword") &&
    !authPage.includes("signInWithOAuth") &&
    !authPage.includes("signUp("),
  "public auth page composes AuthPanel and delegates authentication behavior",
);
requireBehavior(
  (() => {
    const avatarImage = authenticatedBranch.match(
      /<(?:Image|img|span)\b[^>]*data-account-avatar-image="true"[^>]*>/,
    )?.[0] ?? "";
    return avatarImage.includes("rounded-full") && !authenticatedOpeningTag.includes("rounded-full");
  })(),
  "authenticated avatar is the explicit circular image exception",
);

for (const [name, source] of Object.entries({ professionalHero, techHero })) {
  const initialTitle = source.match(/isInitial \? "([^"]+)" : "text-\[1\.35rem\]/)?.[1] ?? "";
  const initialTitleMinimum = Number(initialTitle.match(/clamp\(([\d.]+)rem/)?.[1] ?? 0);
  requireBehavior(
    initialTitle.includes("text-[clamp(") && initialTitleMinimum > 0.95 &&
      !initialTitle.includes("text-[0.95rem]"),
    `${name} initial split-screen role title is larger than 0.95rem`,
  );
  requireBehavior(
    /className="[^"]*text-\[0\.7[0-2]rem\][^"]*px-2(?:\.5)?[^"]*py-0\.5/.test(source),
    `${name} hero badges use smaller explicit typography and compact padding`,
  );
}

for (const token of [
  "--color-control-border: var(--control-border)",
  "--color-badge-border: var(--badge-border)",
  "--color-overlay-surface: var(--overlay-surface)",
  "--color-overlay-foreground: var(--overlay-foreground)",
  "--control-border: oklch(0.65 0.025 60)",
  "--overlay-surface: oklch(0.2 0.012 45 / 0.78)",
  "--overlay-foreground: oklch(0.965 0.004 92)",
  "--radius-layout: 2.5rem",
  "--radius-card: 1.25rem",
  "--radius-control: 0rem",
  "--font-mono: var(--font-body)",
  "--overlay-surface: oklch(0.16 0.01 45 / 0.84)",
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
assert.ok(
  sheet.includes("rounded-xs [.public-design-scope_&]:rounded-none"),
  "Sheet close must preserve the Profile baseline and become square under the HTML public scope",
);
assert.ok(
  !sheet.includes('right-4 rounded-none opacity-70'),
  "Sheet close must not apply square geometry outside the public design scope",
);

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
  "bg-overlay-foreground text-overlay-surface",
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
assert.ok(
  !projectCard.includes("bg-overlay-foreground text-background"),
  "Featured project primary action must not place a near-white theme background color on its near-white surface",
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
  ["components/ui/dialog.tsx", /radius-layout/],
  ["components/ui/project-card.tsx", /rounded-t-lg/],
]);

const isAllowedRawPaletteContext = (relativePath, line) =>
  (relativePath === "components/ui/article-card.tsx" &&
    (line.includes("absolute inset-0 bg-gradient-to-t") ||
      line.includes("type-meta mb-4 w-fit rounded-none border-white/25") ||
      line.includes("type-section-title max-w-[12ch]") ||
      line.includes("type-meta rounded-none border-white/25") ||
      line.includes("type-meta text-white/") ||
      line.includes("type-card-title text-[clamp(1.65rem") ||
      line.includes("article-card-surface") ||
      line.includes("translate-y-full overflow-hidden bg-black") ||
      line.includes("type-body invisible max-w-[24ch]"))) ||
  (relativePath === "components/ui/blog-lead-card.tsx" &&
    (line.includes("bg-gradient-to-t from-black/60") ||
      line.includes("type-section-title text-3xl") ||
      line.includes("type-meta mt-2 text-white/80") ||
      line.includes("type-body mb-4 line-clamp-3") ||
      line.includes("type-meta m-0 flex list-none"))) ||
  (relativePath === "components/home/featured-projects.tsx" &&
    (line.includes("rounded-none border border-white/16") ||
      line.includes("type-meta text-white/72") ||
      line.includes("type-body text-white/90") ||
      line.includes("border-white/20 bg-black/24"))) ||
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
      const isCompactHeroBadge =
        ["components/home/ProfessionalHero.tsx", "components/home/TechHero.tsx"].includes(relativePath) &&
        line.includes("type-meta") &&
        /text-\[0\.7[0-2]rem\]/.test(line) &&
        /px-2(?:\.5)?/.test(line) &&
        line.includes("py-0.5");
      const isUndersized =
        (match[2] === "rem" ? value < 0.75 : value < 12) && !isCompactHeroBadge;
      if (isUndersized) reportViolation(relativePath, lineNumber, "text-size", line);
    }

    if (/\bfont-(?:bold|extrabold|black)\b/.test(line)) {
      reportViolation(relativePath, lineNumber, "font-weight", line);
    }

    const roundedMatches = line.match(/\brounded-(?!none\b)[^\s"'`}]+/g) || [];
    if (roundedMatches.length > 0) {
      const allowedContext = allowedRoundedContexts.get(relativePath);
      const isExplicitAvatarImage =
        relativePath === "components/layout/header-account-control.tsx" &&
        !line.includes("<Button") &&
        /<(?:Image|img|span)\b/.test(line) &&
        line.includes('data-account-avatar-image="true"') &&
        line.includes("rounded-full");
      const isScopedSheetClose =
        relativePath === "components/ui/sheet.tsx" &&
        line.includes("rounded-xs [.public-design-scope_&]:rounded-none");
      if (
        (!allowedContext || !allowedContext.test(line)) &&
        !isExplicitAvatarImage &&
        !isScopedSheetClose
      ) {
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

console.log("Established visual-system and recursive public audit assertions passed.");

assert.equal(
  requestedBehaviorFailures.length,
  0,
  `Requested header/auth/hero behaviors are missing:\n${requestedBehaviorFailures
    .map((failure) => `- ${failure}`)
    .join("\n")}`,
);

console.log("Public design-system self-test passed.");
