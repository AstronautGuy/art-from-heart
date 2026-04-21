# Conventions

- **T3 Stack Best Practices**: Type safety is prioritized using TypeScript, Zod, and tRPC.
- **Data Validation**: Zod is actively used in the tRPC API layer.
- **Schema Management**: Drizzle Kit is used for database migrations and introspecting/pushing the schema.
- **Pnpm**: Use `pnpm` as the package manager instead of `npm` or `yarn` (dictated by `pnpm-workspace.yaml` and `pnpm-lock.yaml`).
- **Server Separation**: The `server-only` package ensures server modules in `src/server` cannot be mistakenly imported into client bundles.
- **Formatting**: Adheres strictly to Prettier, configured with the Tailwind plugin (`prettier-plugin-tailwindcss`) to auto-sort tailwind classes.
