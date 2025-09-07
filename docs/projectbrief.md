# Project Brief: Jotin Portfolio

## Overview

Jotin Portfolio is a modern, responsive web application designed to showcase personal and professional achievements, projects, articles, and contact information. Built with Next.js 15, TypeScript, and Supabase authentication, it provides a comprehensive platform with both public pages and an admin dashboard for content management.

## Current Architecture

### Authentication System
- **Supabase Auth**: Complete authentication system with email/password and OAuth (Google) login
- **Server-side Auth**: Middleware-based route protection for admin areas
- **No custom JWT**: Removed legacy JWT authentication in favor of Supabase's secure auth system

### Database & ORM
- **Prisma ORM**: Database abstraction with PostgreSQL as provider
- **Models**: Articles, Projects, WorkExperience, Contact, Settings (AdminUser model removed)
- **Seeding**: Automated database seeding with sample content

### Frontend Architecture
- **Next.js 15**: App router with server and client components
- **TypeScript**: Full type safety throughout the application
- **TailwindCSS 4**: Modern utility-first styling
- **shadcn/ui**: Optimized component library with only used components
- **Framer Motion**: Smooth animations and transitions

## Key Features

### Public Pages
- **Home**: Dual-personality hero section (Professional ↔ Tech) with smooth toggles
- **Articles**: Searchable and filterable blog posts with categories
- **Projects**: Portfolio showcase with live demos and GitHub links
- **Contact**: Contact form with Resend email integration
- **Profile**: Resume-style professional summary
- **Login**: Supabase authentication with Google OAuth

### Admin Dashboard (Protected Routes)
- **Dashboard**: Overview and analytics
- **Articles Management**: CRUD operations for blog posts
- **Projects Management**: CRUD operations for portfolio items
- **Experience Management**: Work timeline management
- **Messages**: Contact form submissions
- **Settings**: Site-wide configuration

### Component Architecture
- **UI Components**: Optimized shadcn/ui components (button, card, form, etc.)
- **Layout Components**: Header with navigation, footer
- **Section Components**: Hero toggle, work timeline, article cards, project cards
- **Admin Components**: Admin sidebar and management interfaces

## Technology Stack

### Core Framework
- **Next.js**: 15.5.2 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x

### Authentication & Database
- **Supabase**: Authentication and database hosting
- **Prisma**: 6.15.0 ORM with PostgreSQL provider
- **@supabase/ssr**: Server-side rendering support

### UI & Styling
- **TailwindCSS**: 4.x utility-first styling
- **shadcn/ui**: Optimized component library
- **Framer Motion**: 12.23.12 animations
- **Lucide React**: 0.542.0 icon library
- **next-themes**: 0.4.6 dark mode support

### Form Handling & Validation
- **React Hook Form**: 7.62.0
- **Zod**: 4.1.5 schema validation
- **@hookform/resolvers**: 5.2.1

### Email & Communication
- **Resend**: 6.0.2 email API
- **Sonner**: 2.0.7 toast notifications

### Development & Testing
- **Playwright**: 1.55.0 E2E testing
- **ESLint**: 9.x code linting
- **Vercel**: Deployment platform

## Folder Structure

```
jotin-portfolio/
├── app/                        # Next.js 15 App Router
│   ├── (marketing)/           # Public pages group
│   ├── admin/                 # Protected admin pages
│   ├── articles/              # Article pages
│   ├── projects/              # Project pages
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   └── contact/           # Contact form endpoint
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home page
├── components/
│   ├── ui/                    # shadcn/ui components (optimized)
│   ├── layout/                # Header, footer, navigation
│   ├── sections/              # Feature sections (hero, timeline, cards)
│   ├── admin/                 # Admin-specific components
│   └── theme-provider.tsx     # Dark mode provider
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── supabase.ts            # Supabase client (browser)
│   ├── supabase-server.ts     # Supabase client (server)
│   └── utils.ts               # Utility functions
├── prisma/
│   ├── schema.prisma          # Database schema (PostgreSQL)
│   └── seed.ts                # Database seeding script
├── scripts/
│   └── create-admin-user.js   # Supabase admin user creation
├── docs/                      # Project documentation
├── public/                    # Static assets
└── tests/                     # Playwright test files
```

## MCP Integration Instructions

**IMPORTANT**: Always use these MCP servers for their respective tasks to maintain consistency and efficiency.

### 1. Context7 MCP (@context7)
**Usage**: Use for maintaining project context, documentation retrieval, and file management.
```bash
# Always use Context7 for:
@context7 resolve-library-id "next.js"        # Find library documentation
@context7 get-library-docs "/vercel/next.js"  # Get up-to-date docs
@context7 get-library-docs "/supabase/supabase" # Get Supabase documentation
```

### 2. Playwright MCP (@playwright)
**Usage**: Use for all testing scenarios - E2E testing, UI testing, and browser automation.
```bash
# Always use Playwright MCP for:
- Testing authentication flows
- Testing admin dashboard functionality
- Testing responsive design
- Testing form submissions
- Browser automation tasks
- Visual regression testing
```

### 3. shadcn/ui MCP (@shadcnui)
**Usage**: Use for ALL UI component operations - never create components manually.
```bash
# Always use shadcn/ui MCP for:
@shadcnui add button          # Add new components
@shadcnui add card            # Add UI components
@shadcnui add form            # Add form components
@shadcnui list               # List available components
@shadcnui search "dialog"    # Search for components
```

## Development Workflow

### Setup Instructions
1. **Environment Setup**:
   ```bash
   npm install
   # Set up .env.local with Supabase credentials
   npx prisma migrate dev
   npx prisma db seed
   ```

2. **Development**:
   ```bash
   npm run dev      # Start development server
   npm run build    # Build for production
   npm run lint     # Run ESLint
   ```

3. **Testing** (Always use @playwright MCP):
   ```bash
   npx playwright test          # Run all tests
   npx playwright test --ui     # Run with UI mode
   npx playwright test --headed # Run with visible browser (headless: false)
   npx playwright codegen       # Generate test code
   ```

### Code Standards
- **TypeScript**: Strict mode enabled, full type safety
- **ESLint**: Configured for Next.js and TypeScript
- **Prisma**: All database operations through Prisma client
- **Supabase**: All authentication through Supabase auth
- **Components**: Always use @shadcnui MCP for UI components

### Authentication Flow
1. User authenticates via Supabase (email/password or Google OAuth)
2. Middleware checks authentication for `/admin` routes
3. Server components use `getUser()` from `lib/supabase-server.ts`
4. Client components use `createClient()` from `lib/supabase.ts`

## Optimization Notes

### Performance Optimizations
- Removed unused dependencies (bcryptjs, jsonwebtoken, cookies-next)
- Optimized Radix UI imports (only necessary packages included)
- Removed unused UI components (avatar, dialog, dropdown-menu, etc.)
- Database indexing for frequently queried fields

### Security
- Supabase handles all authentication securely
- Middleware-based route protection
- Environment variable management for sensitive data
- No custom JWT implementation (security risk eliminated)

## Deployment

**Platform**: Vercel
**Database**: Supabase PostgreSQL
**CDN**: Vercel Edge Network
**Domain**: jotin.in

### Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
DIRECT_URL=your_direct_url
RESEND_API_KEY=your_resend_key
```

## Maintenance Guidelines

### Regular Updates
1. Keep dependencies updated regularly
2. Monitor Supabase dashboard for auth metrics
3. Review Vercel analytics for performance
4. Test admin functionality after updates

### Adding New Features
1. Always use @context7 for documentation lookup
2. Always use @shadcnui for new UI components  
3. Always use @playwright for testing new features
4. Update this project brief when architecture changes

## Support & Documentation

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Prisma**: https://www.prisma.io/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Playwright**: https://playwright.dev

---

**Current Status**: Optimized and production-ready
**Last Updated**: January 2025
**Architecture**: Modern, secure, and maintainable