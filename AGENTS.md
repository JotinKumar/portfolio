# Repository Guidelines

Whatever action you can do yourself, please do yourself. This includes starting apps and performing verification.

## Design Instructions

For design and UI work, use the `gpt-taste` skill at `.agents/skills/gpt-taste/SKILL.md` and follow its instructions. Do not use the Sites skill.

Use only Phosphor Icons for all icons in this project. Do not introduce icons from other icon libraries.

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

## Coding Style & Naming Conventions

Use strict TypeScript, two-space indentation, semicolons, and the existing ESLint configuration. Prefer the `@/` alias over long relative imports. Component symbols use PascalCase, helpers use camelCase, and most component files use kebab-case (for example, `project-detail-shell.tsx`). Follow Next.js filenames such as `page.tsx`, `layout.tsx`, and `route.ts`. Mark client components with `"use client"`; otherwise prefer server components.

## Testing Guidelines

Playwright is the end-to-end framework. Add browser specs under `tests/` using `*.spec.ts`; cover user-visible behavior, responsive states, authentication, and failure paths. No coverage threshold is configured. Before opening a pull request, run lint, build, and relevant Playwright tests. Ensure the branch includes a Playwright config and specs before relying on E2E commands.

## Commit & Pull Request Guidelines

History follows Conventional Commit prefixes such as `feat:`, `fix:`, `refactor:`, `test:`, and `docs:`. Keep commits focused with imperative summaries. Pull requests should explain the user-facing change, list verification commands, link issues, and include screenshots for visual changes. Call out schema migrations, new environment variables, and deployment implications.

## Security & Configuration

Keep `.env` and `.env.local` untracked. Never expose `SUPABASE_SECRET_KEY`, `RESEND_API_KEY`, `DATABASE_URL`, or `DIRECT_URL` to client code. Only variables prefixed with `NEXT_PUBLIC_` may be browser-readable. Review Prisma migrations and row-level security changes carefully before deployment.
