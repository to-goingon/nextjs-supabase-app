# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16+ (App Router) starter kit integrated with Supabase for authentication and database operations. The project uses TypeScript, TailwindCSS v4, and shadcn/ui components with the "new-york" style.

## Development Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Code quality and formatting
npm run lint                # ESLint check
npm run lint:fix            # ESLint check + auto-fix
npm run format              # Format all files with Prettier
npm run format:check        # Check formatting without modifying files
npm run type-check          # TypeScript type checking
npm run type-check:watch    # Type checking in watch mode
```

## Environment Setup

Required environment variables (copy from `.env.example` to `.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

Both values can be found in your Supabase project's API settings.

## Supabase Integration Architecture

This project uses `@supabase/ssr` for cookie-based authentication across the entire Next.js stack. **Critical**: Always create new Supabase clients within each function—never store in global variables (important for Vercel Fluid Compute compatibility).

### Three Supabase Client Patterns

1. **Server Components & Route Handlers** (`lib/supabase/server.ts`):

   ```typescript
   import { createClient } from "@/lib/supabase/server";
   const supabase = await createClient();
   ```

   - Uses `createServerClient` from `@supabase/ssr`
   - Accesses cookies via `next/headers`
   - Handles cookie setting failures gracefully (Server Components can't set cookies, but proxy middleware handles session refresh)

2. **Client Components** (`lib/supabase/client.ts`):

   ```typescript
   import { createClient } from "@/lib/supabase/client";
   const supabase = createClient();
   ```

   - Uses `createBrowserClient` from `@supabase/ssr`
   - For client-side operations in React components marked with `"use client"`

3. **Middleware** (`lib/supabase/proxy.ts`):
   - Exported `updateSession()` function should be called from Next.js middleware
   - **CRITICAL**: Must call `supabase.auth.getClaims()` immediately after client creation to prevent random logouts with SSR
   - Must return the exact `supabaseResponse` object to maintain cookie sync between browser and server
   - Includes basic auth redirect logic (unauthenticated users → `/auth/login`)

### Database Type Generation

TypeScript types are auto-generated in `lib/supabase/database.types.ts`:

- Currently defines `profiles` table schema
- Export `Database`, `Tables<TableName>`, `TablesInsert<TableName>`, `TablesUpdate<TableName>` types
- All Supabase clients are typed with `<Database>` generic for full type safety
- Regenerate types when schema changes using Supabase CLI or MCP tools

## Project Structure

```
app/
├── auth/              # Authentication pages (login, sign-up, password reset, confirm callback)
├── admin/             # Admin pages (dashboard, analytics, users, events)
├── protected/         # Protected pages requiring authentication
├── events/            # Event-related pages ([id], [id]/edit, create)
├── profile/           # User profile page
├── notifications/     # Notifications page
├── share/[token]      # Share page with token
├── layout.tsx         # Root layout with ThemeProvider
└── page.tsx           # Public homepage

components/
├── ui/                # shadcn/ui components (button, card, input, label, etc.)
├── tutorial/          # Tutorial step components
├── *-form.tsx         # Auth form components (login-form, sign-up-form, etc.)
└── *.tsx              # Shared components (auth-button, theme-switcher, etc.)

lib/
├── supabase/          # Supabase client configurations (CRITICAL - see above)
│   ├── server.ts      # Server-side client
│   ├── client.ts      # Client-side client
│   ├── proxy.ts       # Middleware session handler
│   └── database.types.ts  # Generated TypeScript types
└── utils.ts           # Utility functions (cn for class merging)

docs/
└── guides/            # Development guides
    ├── nextjs-16.md   # Next.js 16.1.1 development guide (Korean)
    └── nextjs-supabase-fullstack-guide.md  # Full-stack guide (Korean)
```

## Path Aliases

Configured in `tsconfig.json`:

- `@/*` maps to project root
- Import examples: `@/lib/supabase/server`, `@/components/ui/button`

## Styling with TailwindCSS v4

**IMPORTANT**: This project uses TailwindCSS v4.1.18, which has significant differences from v3:

### Configuration

- **No `tailwind.config.ts` file**: v4 uses CSS-based configuration instead of JavaScript
- **PostCSS plugin**: Uses `@tailwindcss/postcss` instead of legacy `tailwindcss` plugin
- **CSS imports**: In `app/globals.css`, styles are imported via `@import "tailwindcss"` instead of `@tailwind` directives
- **Theme configuration**: Uses `@theme inline` directive in CSS for custom design tokens

### Key Files

- `app/globals.css`: Main CSS file with TailwindCSS imports and theme variables
  - `@import "tailwindcss"` - Core TailwindCSS styles
  - `@import "tw-animate-css"` - Animation utilities (replaces `tailwindcss-animate`)
  - `:root` and `.dark` - CSS variables for light/dark themes
  - `@theme inline` - Maps CSS variables to Tailwind design tokens
- `postcss.config.mjs`: PostCSS configuration with `@tailwindcss/postcss` plugin
- `components.json`: shadcn/ui configuration with `tailwind.config` set to empty string (v4 compatible)

### Animation Package

- Uses `tw-animate-css` (v1.4.0) instead of deprecated `tailwindcss-animate`
- Pure CSS solution compatible with v4's architecture
- Same utility classes as before (`animate-in`, `fade-in`, `zoom-in`, etc.)

### shadcn/ui Integration

- **Style**: "new-york" variant
- **Base color**: neutral
- **CSS Variables mode**: enabled (`cssVariables: true`)
- **Icon library**: Lucide React
- **Dark mode**: Managed by `next-themes` with system preference detection
- Add new components: `npx shadcn@latest add <component-name>`

### Important Notes

- Automatic content detection: All template files are discovered automatically (no `content` configuration needed)
- Faster builds: v4 is up to 5x faster for full builds, 100x faster for incremental builds
- Modern CSS features: Requires Safari 16.4+, Chrome 111+, Firefox 128+
- No plugins in CSS: v4 uses pure CSS, not the JavaScript plugin system

## Authentication Flow

1. **Client-side auth** (forms use `createClient()` from `lib/supabase/client.ts`)
2. **Session management** via cookies (auto-handled by proxy middleware)
3. **Protected routes**: Check `supabase.auth.getClaims()` in Server Components
4. **Route protection**: Middleware redirects unauthenticated users to `/auth/login`

## MCP Server Configuration

The project has `.mcp.json` configured with:

- **Supabase MCP**: Direct HTTP connection to project (project_ref: hbjjytsmhgsgbecthwky)
- **shadcn MCP**: For managing UI components
- **shrimp-task-manager**: Task management tools

When working with Supabase schema or data, prefer using the Supabase MCP tools for migrations, SQL execution, and type generation.

## Important Patterns

- **No middleware.ts file**: Session refresh is handled via the `lib/supabase/proxy.ts` `updateSession()` function (should be imported and called from middleware if needed)
- **Auth in Client Components**: Import from `@/lib/supabase/client`
- **Auth in Server Components**: Import from `@/lib/supabase/server` and await the client
- **Never cache Supabase clients**: Always create fresh clients per request/function
- **Cookie-based sessions**: User sessions work across Server Components, Client Components, Route Handlers, Server Actions, and Middleware

## Code Quality Tools

### ESLint Configuration

- **File**: `eslint.config.mjs` (ESLint v9 flat config)
- **Extends**: `next/core-web-vitals`, `next/typescript`, `prettier`
- **AI-friendly rules**:
  - `@typescript-eslint/no-unused-vars`: warn (allows `_` prefix for intentionally unused vars)
  - `@typescript-eslint/no-explicit-any`: warn (not error)
  - `react/no-unescaped-entities`: warn
- **Ignored paths**: `.next/`, `out/`, `node_modules/`, `build/`

### Prettier Configuration

- **File**: `.prettierrc`
- **Settings**: 2-space tabs, 100 char line width, semicolons, double quotes, LF line endings
- **Plugins**: `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes)
- **Ignored**: `.prettierignore` excludes build artifacts and env files

### Pre-commit Hooks (Husky + lint-staged)

Git commits automatically run:

1. Prettier formatting on changed files
2. ESLint auto-fix on TypeScript files
3. All checks must pass before commit succeeds

Configuration in `package.json` under `lint-staged` key.

### TypeScript

- **Strict mode enabled** in `tsconfig.json`
- Run `npm run type-check` before pushing to catch type errors
- All Supabase clients use `<Database>` generic for type safety

## Development Guides (Korean)

- `docs/guides/nextjs-16.md`: Comprehensive Next.js 16.1.1 development guide
- `docs/guides/nextjs-supabase-fullstack-guide.md`: Full-stack development guide with Supabase integration

These guides cover:

- Server vs Client Components
- Data fetching strategies
- Caching and revalidation
- Route Handlers (API Routes)
- Error handling
- Performance optimization
- Security best practices
