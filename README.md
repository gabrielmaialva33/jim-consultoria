# Jim Consultoria

## Overview

This is an enterprise-grade web application built with [SvelteKit](https://kit.svelte.dev/), [Supabase](https://supabase.com/), and [Tailwind CSS](https://tailwindcss.com/). It serves as a consultancy platform for cultural grants management (ProAC, Lei Rouanet, PNAB).

## Architecture

### Tech Stack

-   **Frontend Framework:** SvelteKit 2.x (Svelte 5)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS 4.0
-   **Database & Auth:** Supabase (PostgreSQL)
-   **Validation:** Zod + Superforms
-   **Linting/Formatting:** Biome
-   **Package Manager:** pnpm

### Directory Structure

```
src/
├── lib/
│   ├── components/    # Shared UI components (Atomic Design)
│   │   ├── ui/        # Base UI elements (Buttons, Inputs)
│   │   └── landing/   # Feature-specific components
│   ├── server/        # Server-only logic (DB access, Admin actions)
│   ├── supabase/      # Supabase client & types
│   ├── schemas/       # Zod schemas for validation
│   └── utils/         # Helper functions
├── routes/
│   ├── (marketing)/   # Public pages (grouped layout)
│   ├── admin/         # Protected admin dashboard
│   ├── auth/          # Authentication flows
│   └── api/           # API Endpoints
```

### Key Patterns

1.  **Authentication:**
    -   Handled via `@supabase/ssr` in `src/hooks.server.ts`.
    -   Use `auth.getUser()` for secure server-side validation.
    -   Protected routes in `admin/` verify sessions in `+layout.server.ts`.

2.  **Data Fetching:**
    -   All data fetching happens in `+page.server.ts` `load` functions.
    -   Data is passed to components via `data` prop.
    -   No direct Supabase calls from client components (except for specific realtime subscriptions).

3.  **State Management:**
    -   Uses Svelte 5 Runes (`$state`, `$derived`, `$effect`) for local state.
    -   URL state (search params) is preferred for shareable UI state.

4.  **Security:**
    -   Row Level Security (RLS) enabled on all tables.
    -   Service role keys are NEVER used on the client.
    -   Strict TypeScript typing for all Database entities.

## Development

### Prerequisites

-   Node.js 20+
-   pnpm
-   Supabase CLI (optional, for local DB)

### Setup

1.  **Install dependencies:**
    ```bash
    pnpm install
    ```

2.  **Environment Variables:**
    Copy `.env.example` to `.env` and fill in your Supabase credentials:
    ```env
    PUBLIC_SUPABASE_URL=your-project-url
    PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

3.  **Run Development Server:**
    ```bash
    pnpm dev
    ```

4.  **Lint & Format:**
    ```bash
    pnpm lint:fix
    ```

## Database

Migrations are managed via Supabase.
-   `supabase/migrations/`: Contains SQL migration files.
-   `src/lib/supabase/types.ts`: Generated TypeScript definitions.

To update types after schema changes:
```bash
npx supabase gen types typescript --project-id "your-project-id" > src/lib/supabase/types.ts
```
