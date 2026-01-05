# Repository Guidelines

## Project Structure & Module Organization

- `app/` holds Next.js App Router layouts, pages, and route handlers (route groups like `(mobile)` and dynamic segments like `[id]`).
- `components/` contains reusable UI and feature components; `components/ui/` is shadcn/ui.
- `lib/` houses shared utilities and Supabase clients (`lib/supabase/` has `server.ts`, `client.ts`, `proxy.ts`, and generated `database.types.ts`).
- `docs/` contains setup and guides; `app/globals.css` and `postcss.config.mjs` define Tailwind v4 styling.

## Build, Test, and Development Commands

- `npm run dev`: start the Next.js dev server on `localhost:3000`.
- `npm run build`: production build.
- `npm start`: run the production server.
- `npm run lint` / `npm run lint:fix`: ESLint checks (and auto-fix).
- `npm run format` / `npm run format:check`: Prettier format or check.
- `npm run type-check` / `npm run type-check:watch`: TypeScript type checks.

## Coding Style & Naming Conventions

- TypeScript + React (Next.js 16+). Formatting is enforced by Prettier with `prettier-plugin-tailwindcss`; ESLint extends Next.js defaults.
- Use kebab-case filenames for components and routes (e.g., `login-form.tsx`, `event-card.tsx`). Use PascalCase for component names and camelCase for functions/variables.
- Tailwind v4 is configured via CSS (`app/globals.css`). Keep class ordering consistent with existing components.

## Testing Guidelines

- No automated test runner is configured yet. Minimum checks before PRs: `npm run lint` and `npm run type-check`.

## Commit & Pull Request Guidelines

- Commits follow Conventional Commits: `type(scope): summary` or `type: summary` (e.g., `feat(auth): add magic link flow`, `docs: update guide`).
- PRs should include a short summary, linked issue (if any), commands run, and screenshots for UI changes (desktop + mobile when relevant).

## Security & Configuration Tips

- Use `.env.local` for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`; never commit secrets.
- Create new Supabase clients per request/function (do not cache singletons). See `CLAUDE.md` for detailed patterns.
