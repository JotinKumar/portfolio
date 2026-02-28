# Project Detail Pages Design

**Date:** 2026-02-28
**Branch:** `main`

## Goal
Create individual project pages with a blogging-style reading experience, consistent visual treatment, and robust media fallbacks.

## Scope
- Add `/projects/[slug]` project detail route.
- Make projects list cards link to detail pages.
- Support multiple images via `screenshots` field with placeholders.
- Show timeline section with temporary fallback: "Timeline not specified".

## Architecture
- Server-rendered project detail page using query helper by slug.
- Safe parsing for string-encoded fields (`screenshots`, `techStack`, `tags`).
- Shared placeholder patterns with article/project cards for visual consistency.

## UX Structure
1. Back button + metadata header.
2. Hero media block with cover image or placeholder.
3. Screenshot gallery grid with per-tile fallback placeholder.
4. Overview section (`description`).
5. Technology stack section (chips).
6. Concepts/tags section (chips).
7. Timeline section with temporary fallback text.
8. Live/code CTA footer.

## Data Rules
- If project not found -> friendly in-app fallback state + back link.
- `coverImage` missing -> placeholder.
- `screenshots` invalid/empty -> placeholder gallery block.
- Timeline always renders with temporary fallback message.

## Verification
1. `cmd /c npx tsc --noEmit --pretty false --incremental false`
2. `cmd /c npm test`
3. Optional local visual check for `/projects` and `/projects/[slug]`.