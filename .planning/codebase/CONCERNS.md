# Concerns

- **Testing Coverage**: No unit testing or end-to-end testing frameworks are currently installed, which could slow down verification for complex business logic.
- **Authentication Scope**: Clerk handles auth, but verifying its connection endpoints securely requires thorough middleware configuration. We must be sure `middleware.ts` is robust.
- **Next.js & React 19 Bleeding Edge**: The project operates on standard new paradigms (Next.js 15, Tailwind v4, React 19). They are powerful but might introduce ecosystem library incompatibilities if legacy packages are added.
- **Schema Migrations**: Usage of `db:push` shouldn't be executed casually in environments resembling production. `db:migrate` must be correctly managed moving forward.
