# Project Brief: Jotin Portfolio

## Overview

Jotin Portfolio is a modern web application designed to showcase personal and professional achievements, projects, articles, and contact information. Built with Next.js, TypeScript, and integrated with authentication and database solutions, it provides a comprehensive platform for both public and admin-facing features.

## Key Features

- **Public Pages:**
  - Home, Articles, Projects, Contact, Profile, Login

- **Admin Dashboard:**
  - Manage articles, projects, experience, messages, and settings

- **Authentication:**
  - Login and logout routes, integrated with Supabase and Prisma

- **Reusable Components:**
  - UI elements (buttons, cards, forms, navigation, etc.)
  - Section components for articles, projects, timeline, etc.

- **Database Integration:**
  - Prisma ORM for data management
  - Seed scripts and migrations

- **Testing & Reporting:**
  - Playwright for end-to-end testing
  - Automated test reports

- **Styling:**
  - CSS modules and PostCSS

- **Configuration:**
  - ESLint, TypeScript, Vercel deployment, Next.js config

## Folder Structure

- `app/` - Main application pages and API routes
- `components/` - Reusable UI and layout components
- `hooks/` - Custom React hooks
- `lib/` - Utility libraries (auth, database, etc.)
- `prisma/` - Database schema, migrations, and seed scripts
- `public/` - Static assets and uploads
- `scripts/` - Utility scripts (e.g., admin user creation)
- `styles/` - Global and modular styles
- `docs/` - Project documentation

## Technologies Used

- Next.js
- TypeScript
- Prisma
- Supabase
- Playwright
- Vercel
- PostCSS
- ESLint

## Deployment

Configured for deployment on Vercel with environment-specific settings in `vercel.json`.

## Getting Started

1. Install dependencies: `npm install`
2. Set up environment variables and database
3. Run development server: `npm run dev`
4. Access admin dashboard via `/admin`

## Authors & Maintainers

- Jotin (Primary developer)


---
For more details, refer to individual documentation files and source code comments.
