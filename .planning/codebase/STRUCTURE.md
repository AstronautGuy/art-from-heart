# Structure

## Root
- `package.json`: Project dependencies and scripts.
- `next.config.js`: Next.js configuration.
- `drizzle.config.ts`: Drizzle ORM configuration for schema and migrations.
- `tailwind.config.ts` / `postcss.config.js`: Styling configuration (Tailwind v4 / PostCSS).
- `eslint.config.js` / `prettier.config.js`: Code quality tools setup.
- `.env.example`: Template for required environment variables.

## `src/` Directory
- **`app/`**: Next.js App Router components, pages, layouts, and global CSS (via `styles/`).
- **`server/`**: Contains execution logic intended purely for the server context (secured by `server-only`).
  - **`api/`**: The tRPC server endpoints.
  - **`db/`**: The Drizzle connection and schema.
- **`env.js`**: Environment variable validation (likely using `@t3-oss/env-nextjs`).
- **`trpc/`**: Configuration for the tRPC client and React Query hooks (`react.tsx`, `server.ts`, `query-client.ts`).
- **`middleware.ts`**: Edge middleware, likely for Clerk authentication routing.
