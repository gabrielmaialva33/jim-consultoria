# Project Context: Jim Consultoria

## Overview
**Jim Consultoria** is an enterprise-grade web application tailored for managing cultural grants (ProAC, Lei Rouanet, PNAB). It serves as a CRM and workflow management tool for consultancy services.

## Tech Stack
-   **Frontend:** SvelteKit 2.x (Svelte 5)
-   **Language:** TypeScript (Strict Mode)
-   **Styling:** Tailwind CSS 4.0
-   **Database:** Supabase (PostgreSQL)
-   **Auth:** Supabase Auth (SSR)
-   **Form Handling:** Superforms + Zod
-   **Linting/Formatting:** Biome
-   **Package Manager:** pnpm

## Architecture & Patterns

### 1. Data Fetching & Security
-   **Server-Side First:** All data fetching occurs in `+page.server.ts` via `load` functions.
-   **No Client SQL:** Direct Supabase queries from client components are forbidden (except for realtime subscriptions).
-   **RLS:** Row Level Security is enabled on all tables.
-   **Validation:** All inputs are validated using Zod schemas found in `src/lib/schemas`.

### 2. State Management
-   **Svelte 5 Runes:** Utilizes `$state`, `$derived`, and `$effect` for local component state.
-   **URL State:** Search parameters are the source of truth for shareable UI state (filters, pagination).

### 3. Component Structure
-   **Atomic Design:** Components are organized in `src/lib/components/ui` (atoms/molecules) and feature folders (organisms).
-   **Shadcn-like:** Reusable UI components follow a pattern similar to shadcn-svelte but custom-built.

## Database Schema (Core Tables)
-   `leads`: Potential clients/projects.
-   `grants`: Cultural funding opportunities (ProAC, etc.).
-   `tasks`: Action items associated with leads or internal processes.
-   `activities`: Audit log and activity tracking.

## Development Workflow

### Commands
-   **Start Dev Server:** `pnpm dev`
-   **Lint & Fix:** `pnpm lint:fix` (Uses Biome)
-   **Type Check:** `pnpm check`
-   **Build:** `pnpm build`

### Key Paths
-   **Migrations:** `supabase/migrations/`
-   **DB Types:** `src/lib/supabase/types.ts`
-   **Server Logic:** `src/lib/server/`
-   **Public Routes:** `src/routes/(marketing)/`
-   **Admin Routes:** `src/routes/admin/`

## Conventions
-   **Styling:** Use Tailwind utility classes. Avoid custom CSS files unless absolutely necessary.
-   **Type Safety:** Always import generated database types from `$lib/supabase/types`.
-   **Forms:** Use `superforms` for all form interactions.
