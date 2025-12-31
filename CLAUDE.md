# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15+ (App Router) starter kit integrated with Supabase for authentication and database operations. The project uses TypeScript, Tailwind CSS, and shadcn/ui components with the "new-york" style.

## Development Commands

```bash
# Development server (runs on localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
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
├── protected/         # Protected pages requiring authentication
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
```

## Path Aliases

Configured in `tsconfig.json`:
- `@/*` maps to project root
- Import examples: `@/lib/supabase/server`, `@/components/ui/button`

## Styling

- **Tailwind CSS** with `cssVariables: true` mode
- **Base color**: neutral
- **shadcn/ui**: "new-york" style variant with Lucide icons
- **Dark mode**: Managed by `next-themes` with system preference detection
- Add new UI components: `npx shadcn@latest add <component-name>`

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

## shadcn/ui Component Management

- Configuration in `components.json`
- Style: "new-york"
- Aliases configured for easy imports
- To reinstall with different style: delete `components.json` and re-run `npx shadcn@latest init`
