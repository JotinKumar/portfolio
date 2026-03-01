# Data-Driven Public Pages Design

Date: 2026-03-01

## Scope
- Public pages only: `/`, `/profile`, `/articles`, `/projects`, `/contact`.
- Keep interactivity/animations client-side.
- Move text/copy/links/navigation/social/profile competencies/hero labels to DB-backed content.

## Architecture
- Server components fetch all content from Supabase tables via shared query layer.
- Client components receive data props only for interactive behavior.
- No fallback to hardcoded resume/profile constants for public rendering.

## Data Model
- `SiteConfig` singleton for global branding and defaults.
- `NavigationItem` for header/footer link groups.
- `SocialLink` for footer/contact social actions.
- `HeroContent` for split hero labels, skills, image URLs, and home section labels.
- `PageContent` for per-page title/subtitle/empty-state copy and flexible JSON content.
- `Competency` for profile competency lists.

## Rendering Rules
- Public shell (`header`, `footer`, metadata defaults) driven from `SiteConfig` + nav/social tables.
- Home hero and section labels driven by `HeroContent`.
- Profile page driven by `PageContent(PROFILE)` + `Competency` + `WorkExperienceCard`.
- Articles/projects/contact list page labels and empty states driven by `PageContent`.

## Admin Impact
- Admin settings page extended to display new content entities to support operations and editing workflows.

## Migration
- Add enum and tables via Prisma migration.
- Seed baseline rows for all new tables so public rendering has complete content.
