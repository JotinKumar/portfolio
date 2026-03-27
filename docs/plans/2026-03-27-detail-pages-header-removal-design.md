# Detail Page Header Removal Refinement

## Context

The first redesign pass fixed the core mismatch between blog and project detail pages, but both pages still open with a relatively large introductory block. That block is cleaner than the original version, yet it still carries too much visual weight at the top of the page.

The goal of this refinement is to remove that dominant top block and replace it with a more editorial opening inspired by the provided references:

- text-led, layout-led openings for blog pages
- screenshot-led openings for project pages
- slimmer supporting rails instead of hero-style introduction panels

## Goals

- Remove the large top header block from both blog and project detail pages.
- Preserve orientation and navigation without reintroducing bulky framing.
- Make blog detail pages feel more like editorial reading spreads.
- Make project detail pages feel more like case studies where the gallery leads.
- Keep both pages visually related through shared editorial rhythm and asymmetry.

## Non-Goals

- No query-layer or schema changes.
- No change to the overall information architecture of the detail pages.
- No attempt to copy the reference layouts directly.

## Recommended Direction

Use a lighter editorial opening on both pages.

For blogs:

- Keep only a minimal navigation cue near the top.
- Let the title composition open directly in the reading column.
- Keep category, date, read time, and tags in a slim side rail.
- Move the image lower so it behaves like a supporting editorial figure.

For projects:

- Remove the dominant top intro block entirely.
- Let the gallery become the first major visual element.
- Move the back link, status, links, and stack information into a compact rail.
- Follow the gallery with overview and supporting narrative sections.

## Blog Detail Refinement

### Opening

The blog page should begin with a composed title block in the main content column rather than a large boxed hero. The title should remain the clear entry point, supported by a short excerpt where available.

### Metadata

The supporting rail should continue to carry:

- back navigation
- category
- publish date
- reading time
- tags

This keeps the page informative without pulling visual focus away from the article.

### Supporting Media

If a cover image exists, it should sit below the title opening as an inserted figure. It should not feel like the main identity of the page.

## Project Detail Refinement

### Opening

The project page should open with the gallery immediately. This better matches the job of the page: showing the work before explaining it.

### Rail

A compact side rail should hold:

- back navigation
- status
- live/source actions
- stack summary

The rail should feel informational, not like a second hero.

### Content Flow

After the gallery, the narrative sections should continue in this order:

- overview
- what the project is trying to do
- focus areas
- technical details

## Shared Visual Rules

- Remove top-heavy bordered intro compositions.
- Keep the pages asymmetrical and editorial rather than card-stacked.
- Use typography and spacing to lead the eye before relying on bordered containers.
- Preserve strong readability and scanning on mobile and desktop.

## Verification Scope

Validate that:

- the blog still has a clear entry point without the old top block
- the project gallery becomes the obvious first interaction target
- navigation and metadata remain easy to find
- sparse content still collapses cleanly

## Implementation Handoff

Next step is to create a focused implementation plan for removing the top header blocks and replacing them with lighter editorial openings.
