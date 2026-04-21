# Phase 1: Database & Core Infrastructure - Context

## Decisions

- **Settings Table Structure**: We will use a `JSONB` column to store all dynamic store configurations (like shipping logic, free shipping threshold, toggle modes). This prevents needing a schema migration every time a new setting is added.
- **Image Serving Strategy**: Cloudflare R2 bucket will be made publicly accessible. We will serve images directly via the Cloudflare CDN URL. This reduces bandwidth overhead on the Next.js server and improves load times drastically.
- **Primary Keys Format**: We will use `cuid2` for generating IDs across all tables (e.g. `categories`, `products`). Compared to UUIDs, CUIDs are shorter, URL-safe, and visually cleaner for routing (e.g., `/product/clrxbx...`).

## Canonical Refs
- `.planning/PROJECT.md`
- `.planning/REQUIREMENTS.md`
