# Repository Guidelines

Whatever action you can do yourself, please do yourself. This includes starting apps and performing appropriate verification.

## Execution Mode

Default to direct implementation in the current agent.

Superpowers skills are optional tools, not mandatory workflow stages. Select them based on task complexity, uncertainty, and risk. Never invoke `superpowers:subagent-driven-development` or `superpowers:executing-plans` solely because a task includes a plan, checklist, or implementation document.

For small and clearly defined tasks:

- Work directly in the current agent.
- Do not create subagents.
- Do not create a separate implementation plan unless it is genuinely needed.
- Inspect only the files relevant to the requested change.
- Make the smallest reasonable change.
- Run focused validation after editing.
- Do not make intermediate commits unless explicitly requested.

Small tasks include CSS adjustments, responsive fixes, copy changes, simple configuration updates, localized bug fixes, and changes limited to one to three known files.

## Superpowers Skill Usage

Use Superpowers skills only when they clearly improve the result.

### Brainstorming

Use `superpowers:brainstorming` when:

- The desired behavior or design is unclear.
- There are several reasonable approaches.
- Requirements conflict or are incomplete.
- A product, UX, architecture, or workflow decision is needed.

Do not use brainstorming when the user has already provided a clear design, approved plan, or exact implementation instructions.

### Writing Plans

Use `superpowers:writing-plans` when:

- The change spans several related components or systems.
- Implementation order matters.
- Database, API, authentication, deployment, or architectural changes are involved.
- The user explicitly asks for a plan before implementation.

Keep plans proportional to the task. Do not generate detailed task-by-task plans for minor UI work.

### Test-Driven Development

Use `superpowers:test-driven-development` when:

- Implementing business logic, calculations, data transformations, APIs, or reusable utilities.
- Fixing a regression that should be protected by a test.
- The repository already has an appropriate test framework.

Do not require a RED/GREEN cycle for copy, spacing, colors, layout tweaks, or other purely visual changes unless an existing automated test provides meaningful coverage.

### Systematic Debugging

Use `superpowers:systematic-debugging` when:

- The root cause is unknown.
- A previous fix failed.
- The problem is intermittent.
- The issue spans multiple systems, dependencies, environments, or runtime states.

Debug obvious syntax, configuration, and localized styling issues directly without invoking the full workflow.

### Subagent-Driven Development

Use `superpowers:subagent-driven-development` only when:

- The task is large and can be divided into meaningful independent workstreams.
- Several major features or subsystems must be implemented.
- Independent implementation or review meaningfully reduces risk.
- The expected benefit justifies substantially higher token and tool usage.

Do not use subagents for single-component changes, responsive fixes, minor refactoring, routine tests, documentation updates, or work limited to a few files.

Before using subagents, briefly state why they are necessary. If the justification is weak, work directly in the current agent.

### Executing Plans

Use `superpowers:executing-plans` only for an existing approved implementation plan with multiple meaningful stages.

A Markdown checklist is guidance, not an instruction to invoke a plan-execution workflow or mechanically perform every optional step.

## Resource-Conscious Execution

- Prefer one capable agent over multiple subagents.
- Do not repeatedly read the entire repository.
- Ignore generated and dependency folders such as `node_modules`, `.next`, `dist`, `build`, `coverage`, `.cache`, and `.git` unless directly relevant.
- Prefer focused lint, type-checking, and tests before running the full suite.
- Run expensive verification commands no more than once unless they fail and a relevant fix is made.
- Avoid repeated browser, screenshot, build, or review loops.
- Do not install a new dependency when the repository already contains a suitable option.
- Stop when the requested outcome and appropriate verification are complete.
- Preserve unrelated working-tree changes.

User instructions always take priority. If the user explicitly asks to use or avoid a particular skill or workflow, follow that request.

## Design Instructions

For design and UI work, use the `gpt-taste` skill at `.agents/skills/gpt-taste/SKILL.md` and follow its instructions. Do not use the Sites skill.

Use only Phosphor Icons for all icons in this project. Do not introduce icons from other icon libraries.

For small design or UI changes, use `gpt-taste` directly in the current agent. Do not automatically combine it with brainstorming, writing-plans, executing-plans, or subagent-driven-development.

## Project Structure & Module Organization

This is a TypeScript Next.js App Router portfolio. Routes live in `app/`; `(public)` and `(admin)` separate public pages from administration, while `app/api/` contains route handlers. Reusable UI belongs in feature folders under `components/`, with shared primitives in `components/ui/`. Put data access and helpers in `lib/`, and server-only queries in `lib/server/`. Prisma models, migrations, and seed data live in `prisma/`; static assets live in `public/`.

## Build, Test, and Development Commands

- `npm ci` installs locked dependencies and generates the Prisma client.
- `npm run dev` starts the local Next.js development server.
- `npm run lint` runs the Next.js ESLint rules for TypeScript and React.
- `npm run build` creates a production build and catches type or route errors.
- `npm start` serves the completed production build.
- `npm run test:e2e` runs Playwright tests; use `npm run test:e2e:headed` when debugging in a visible browser.
- `npm run db:seed` populates the configured PostgreSQL database with development content.

Use validation proportional to the change:

- Small UI or localized code change: run focused lint and type-checking where available.
- Medium feature: run lint, type-checking, and relevant tests.
- Large, risky, or release-bound change: run lint, type-checking, build, and relevant Playwright tests.

Do not start the development server, run a production build, or launch Playwright repeatedly unless needed to verify the requested behavior.

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, semicolons, and the existing ESLint configuration. Prefer the `@/` alias over long relative imports. Component symbols use PascalCase, helpers use camelCase, and most component files use kebab-case (for example, `project-detail-shell.tsx`). Follow Next.js filenames such as `page.tsx`, `layout.tsx`, and `route.ts`. Mark client components with `"use client"`; otherwise prefer server components.

## Testing Guidelines

Playwright is the end-to-end framework. Add browser specs under `tests/` using `*.spec.ts`; cover user-visible behavior, responsive states, authentication, and failure paths. No coverage threshold is configured.

Add or update tests when they provide meaningful protection for behavior or regressions. Do not create brittle source-contract tests merely to verify markup order, class names, or implementation details unless the repository already relies on that testing style.

Before opening a pull request, run verification appropriate to the scope of the change. Ensure the branch includes a Playwright config and specs before relying on E2E commands.

## Commit & Pull Request Guidelines

History follows Conventional Commit prefixes such as `feat:`, `fix:`, `refactor:`, `test:`, and `docs:`. Keep commits focused with imperative summaries. Do not create commits unless the user asks for them or the active workflow explicitly requires them.

Pull requests should explain the user-facing change, list verification commands, link issues, and include screenshots for visual changes. Call out schema migrations, new environment variables, and deployment implications.

## Security & Configuration

Keep `.env` and `.env.local` untracked. Never expose `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `DATABASE_URL`, or `DIRECT_URL` to client code. Only variables prefixed with `NEXT_PUBLIC_` may be browser-readable. Review Prisma migrations and row-level security changes carefully before deployment.
