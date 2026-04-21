# Art From Heart 

## What This Is
A cute, cozy, and emotionally-driven handmade products store built for teens and couples. Unlike a generic e-commerce template, this platform feels warm, aesthetic, and strictly gift-focused relying on modern frontend mechanics to achieve an immersive shopping experience.

## Core Value
- **Aesthetic First:** Soft pastel palettes (peach, beige, light pink, lavender), rounded UI elements, subtle animations, and smooth mobile-first interactions.
- **Total Admin Independence:** A comprehensive, database-driven admin dashboard that allows the owner to change categories, update products, adjust pricing, manage stock, set shipping rules, and change ordering modes without ever touching code.
- **Frictionless WhatsApp Ordering:** An engaging cart experience that compiles into a pre-filled WhatsApp message for high-touch, relational customer service (Phase 1).

## Requirements

### Validated
- ✓ **Admin Dashboard:** Full CRUD for categories and products. Configurable settings block. — v1.0
- ✓ **Dynamic Product Models:** Name, description, price, Cloudflare R2 images arrays, category relations, tags, stock types, `free_shipping_eligible` flags, and `featured` flags. — v1.0
- ✓ **Auth System:** Clerk integration allowing customer accounts and restricting the admin dashboard to a single dedicated admin account. — v1.0
- ✓ **Cart & Checkout Flow:** Users can add multiple items to a cart. Checkout redirects to WhatsApp with a pre-filled message detailing the order. — v1.0
- ✓ **Future-Proof Checkout Architecture:** Backend is structured to support true payment gateways (Razorpay/Stripe) in future phases using a disabled feature toggle. — v1.0
- ✓ **Frontend Pages:** Home (featured products/categories/story), Shop (filtering by category), Product Detail page, About, Contact, and the Admin route. — v1.0
- ✓ **Cloudflare R2 Integration:** File upload implementation for product images using Cloudflare R2. — v1.0

### Active
- [ ] **Admin Dashboard (Banners):** Full CRUD for promotional banners via the UI, connecting directly into Postgres.
- [ ] **System Mode Payment Gateways:** Complete the loop for Razorpay or Stripe, removing the WhatsApp-only limitation for when the business is ready to scale.

### Out of Scope
- None added yet.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| **Cart to WhatsApp Checkout** | The business requires high-touch order fulfillment for handmade gifts in Phase 1 without the overhead of immediate payment gateways. | ✓ Good |
| **Cloudflare R2 Storage** | Cost-effective and highly reliable storage bucket for serving user-uploaded image assets. | ✓ Good |
| **Clerk for All Auth** | Re-using the existing Clerk workspace allows seamless expansion from 1 admin account to full customer accounts. | ✓ Good |
| **System Mode Toggles** | Future-proofs the codebase allowing admins to enable automatic checkout loops (Razorpay/Stripe) when ready. | ✓ Good |

---
*Last updated: April 2026 after completed v1.0 milestone*
