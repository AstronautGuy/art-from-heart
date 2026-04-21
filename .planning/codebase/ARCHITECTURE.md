# Architecture

## Overview
The application follows the **T3 Stack** architecture, optimized for end-to-end type safety, modern React conventions (React 19), and Next.js App Router capabilities.

## Layers

### Frontend (Client UI & Server Components)
Built entirely within the Next.js App Router (`src/app`). It uses standard Tailwind CSS for styles. Server and Client Components fetch data via tRPC endpoints.

### API Layer (tRPC)
Located in `src/server/api`. Includes:
- **`trpc.ts`**: Core initialization and context/middleware definitions.
- **`root.ts`**: The main App Router tying together individual subsystem routers.
- **`routers/`**: Subfolders or files grouping endpoints by domain (e.g., users, posts).

### Database Layer
Located in `src/server/db`. Includes:
- **`index.ts`**: Connects the Postgres client and initializes Drizzle ORM.
- **`schema.ts`**: Definitions of all database tables and relations.

## Execution Flow
1. **Client / RSP Component**: Calls a tRPC procedure.
2. **tRPC Server**: Receives the request, validates input (often via Zod), and processes the request.
3. **Database**: tRPC procedures query or mutate the database via Drizzle ORM.
4. Data flows back to the frontend typed automatically.
