# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Jim Consultoria is a cultural grants consultancy platform for Brazilian cultural incentive programs (ProAC ICMS, Lei Rouanet, PNAB). It manages leads through a CRM pipeline, evaluates grant eligibility, and tracks tasks/activities.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm check        # TypeScript type checking
pnpm lint         # Check with Biome
pnpm lint:fix     # Auto-fix lint issues
pnpm ci           # CI validation (Biome)
```

## Tech Stack

- **Framework:** SvelteKit 2.x with Svelte 5 (uses Runes: `$state`, `$derived`, `$effect`)
- **Styling:** Tailwind CSS 4.0
- **Backend:** Supabase (PostgreSQL with RLS)
- **Validation:** Zod v4 + sveltekit-superforms
- **Linting:** Biome (not ESLint/Prettier)

## Architecture

### Authentication Flow
- `src/hooks.server.ts` creates Supabase client and validates user via `auth.getUser()` on every request
- User/session stored in `event.locals.user` and `event.locals.session`
- Admin routes (`/admin/*`) protected in `src/routes/admin/+layout.server.ts`
- Never use `getSession()` for authorization checks—always use `getUser()`

### Data Flow Pattern
- All data fetching in `+page.server.ts` load functions
- No direct Supabase calls from client components
- Data passed to components via `data` prop

### Key Directories
- `src/lib/server/services/` — Server-only business logic (e.g., LeadsService)
- `src/lib/schemas/` — Zod schemas with Portuguese validation messages
- `src/lib/supabase/types.ts` — TypeScript types for database entities
- `src/lib/scoring.ts` — Lead eligibility scoring algorithm
- `supabase/migrations/` — SQL migrations (enums, tables, RLS policies)

### Database Schema
Four main tables with RLS enabled:
- **leads** — Contact info, organization type, cultural areas, grant interests, eligibility score
- **grants** — Grant programs with requirements, deadlines, budgets
- **tasks** — Tasks linked to leads/grants with priority and status
- **activities** — Activity log (notes, calls, emails, status changes)

### Code Style (Biome)
- Tabs for indentation
- Single quotes, no trailing commas
- 100 char line width
- `useConst` and `noUnusedImports` enforced (relaxed in .svelte files)

## Domain Context

Brazilian cultural grants terminology:
- **ProAC ICMS** — São Paulo state tax incentive program
- **Lei Rouanet** — Federal cultural incentive law
- **PNAB** — Política Nacional Aldir Blanc (national cultural policy)
- **CNPJ** — Brazilian business tax ID
- **SALIC** — Federal cultural projects management system
