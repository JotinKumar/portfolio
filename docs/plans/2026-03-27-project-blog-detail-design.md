# Project And Blog Detail Page Design

## Context

The public project and blog detail pages currently do not match the editorial direction used across the rest of the portfolio. They rely on generic card sections, oversized hero image treatment, and fallback placeholders that make the pages feel more like scaffolded admin output than curated public-facing pages.

The goal is to bring both detail pages into line with the existing public design language while respecting the different jobs of each page:

- Blog detail pages should be text-first and optimized for reading.
- Project detail pages should be case-study pages centered on product evidence.

## Goals

- Align both detail pages with the site's existing editorial design language.
- Remove generic hero-card patterns that clash with the rest of the public pages.
- Make blog detail pages feel authored, readable, and text-led.
- Make project detail pages feel like structured case studies with strong visual proof.
- Handle sparse data gracefully without filler placeholders.

## Non-Goals

- No schema or query-layer redesign.
- No content model expansion as part of this pass.
- No attempt to force both pages into the same rigid template.

## Recommended Approach

Use two specialized detail-page templates built from the same public design system primitives.

Shared across both pages:

- page spacing and section rhythm
- typography system
- back-navigation treatment
- button and badge styles
- border, surface, and spacing language

Different per page:

- blog detail favors reading comfort and restrained supporting media
- project detail favors inspection, evidence, and structured project breakdowns

This keeps the site cohesive without flattening two very different content types into one layout.

## Blog Detail Design

### Core Direction

The blog detail page should read like an essay or journal entry rather than a marketing page. The title and metadata should introduce the piece, but the article body should be the dominant visual element.

### Layout

- A compact introductory header with title, category, date, read time, and tags.
- Optional supporting image near the top of the article, but never as a dominant hero block.
- Main content set in a restrained reading measure for comfort and hierarchy.
- Optional slim side rail on large screens for back link, metadata, and tag navigation.

### Content Priorities

- reading experience first
- clean headline hierarchy
- generous paragraph rhythm
- tags and metadata as support, not decoration
- optional image only when it adds context

### Rules

- Do not reserve a large image hero area when a cover image exists.
- Do not show visual placeholder blocks when no image exists.
- Do not wrap the article body in a generic dashboard-style card treatment.
- Preserve whitespace and hierarchy so long-form text feels intentional.

### Empty-State Behavior

- If there is no cover image, the article simply remains text-first.
- If there are no tags, omit the tag section entirely.
- If content is plain text, render it in a readable editorial container without fake embellishment.

## Project Detail Design

### Core Direction

The project detail page should behave like a portfolio case study. Visitors should understand what the project is, what it looks like, how it works, what was built with it, and what comes next.

### Layout

Above the fold:

- back link
- title
- short summary
- category and status
- external links when available

Immediately below:

- screenshot or page gallery presented early as the main proof of work

Supporting sections:

- project overview
- what the product is trying to do
- pages or screens walkthrough
- technology stack
- future improvements or roadmap

### Content Priorities

- visual proof early
- clear project intent
- structured case-study narrative
- concise technical context
- forward-looking improvements when present

### Rules

- Prefer immediate access to the gallery over a large decorative hero image block.
- Keep the introduction compact so the screenshots can appear quickly.
- Avoid fake screenshot placeholders when screenshots are missing.
- Remove filler copy such as unspecified timeline blocks if the data is absent.

### Empty-State Behavior

- If there are no screenshots, collapse the gallery section entirely or replace it with a restrained message.
- If there are no external links, do not render an empty action row.
- If tags or secondary metadata are missing, tighten the layout rather than preserving empty slots.

## Shared Interaction And Visual System

- Keep navigation back to the archive pages clear and lightweight.
- Maintain consistency with existing public typography classes and spacing rhythm.
- Favor editorial asymmetry and curated composition over stacked generic cards.
- Use borders and surfaces sparingly to support hierarchy rather than enclosing every section.
- Preserve responsiveness so both pages remain intentional on mobile and desktop.

## Data And Rendering Notes

- Existing query functions can remain unchanged.
- This work is primarily a presentation refactor.
- Conditional rendering should be tightened so missing data removes sections instead of producing placeholders.
- The implementation should prefer reusable section primitives where they help, but should not over-componentize at the expense of page composition.

## Verification Scope

Validate both pages in these states:

- with and without cover images
- with many tags and with no tags
- with and without external links
- with many screenshots and with few or none
- on mobile and desktop layouts

Expected verification outcome:

- blog detail feels text-first and no longer image-dominated
- project detail feels like a case study rather than a generic detail scaffold
- both pages visually align with the editorial language already present across the site

## Implementation Handoff

Next step is to convert this approved design into an implementation plan using the `writing-plans` workflow.
