# Supabase Runtime Data Migration Design

**Scope**
- Replace Prisma runtime reads/writes in `app/**` with Supabase queries.
- Keep Prisma only for schema/migrations/seed workflows.
- Preserve existing UI behavior and fallback handling.

**Architecture**
- Use `createServerSupabaseClient()` for server components and route handlers.
- Query Postgres tables through Supabase `.from('<table>')` APIs.
- Normalize Supabase row shapes with lightweight local TypeScript interfaces.

**Data Flow**
- Public pages (`/`, `/articles`, `/projects`, `/profile`) read directly from Supabase.
- Admin pages read dashboard and table data from Supabase.
- Contact API writes messages to Supabase and keeps existing Resend logic.

**Error Handling**
- Keep current graceful fallback behavior (empty state/default values) where present.
- Throw on Supabase query errors inside `try/catch` blocks to preserve existing failure paths.

**Testing/Verification**
- Run TypeScript check (`npx tsc --noEmit`) and production build (`npm run build`).
- Confirm no Prisma runtime imports remain in `app/**`.
