# Profile Hybrid Resume Design

**Date:** 2026-02-28
**Branch:** `main`

## Goal
Redesign `/profile` into a beautiful, resume-centered page that balances executive clarity with selective visual flair.

## Selected Direction
Hybrid layout:
- Executive readability and recruiter-friendly hierarchy
- Selective visual style and subtle motion accents
- Server-side rendering by default

## Architecture
1. Server-rendered page using existing profile data source (`getProfileData`) and resume fallbacks.
2. Sectioned layout with consistent shell width:
- Hero Resume Header
- Professional Summary
- Experience Timeline
- Core Competencies
- Contact + Social Actions
3. Keep logic/data on server; no unnecessary client boundary.

## Visual System
- Structured typography hierarchy (name/title/facts/impact bullets)
- Gradient and glass accents used sparingly
- Bounded cards with strong spacing rhythm
- Subtle reveal classes (`animate-in`, `fade-in`, `slide-in`) only where helpful

## Data Mapping
- Continue using `settings` where available.
- Fallback to `RESUME_*` constants when DB values are missing.
- Parse `skills` and `achievements` once per experience item.

## UX Requirements
- Smooth scanability on desktop and mobile.
- Quick facts visible near top.
- CTA visibility for resume download/contact.
- Experience blocks prioritize impact and skills.

## Non-Goals
- No schema changes
- No auth flow changes
- No broad design-system refactor

## Verification
1. `cmd /c npx tsc --noEmit --pretty false --incremental false`
2. `cmd /c npm test`
3. Visual smoke check for `/profile` at desktop and mobile breakpoints.